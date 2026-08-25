import json
import logging
import os
import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse, Response

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("bridge")

ZEN_BASE_URL = os.environ.get("ZEN_BASE_URL", "https://opencode.ai/zen")
ZEN_CHAT_URL = f"{ZEN_BASE_URL}/v1/chat/completions"
ZEN_MODELS_URL = f"{ZEN_BASE_URL}/v1/models"
ENV_API_KEY = os.environ.get("OPENCODE_ZEN_API_KEY", "")
LISTEN_HOST = os.environ.get("BRIDGE_HOST", "127.0.0.1")
LISTEN_PORT = int(os.environ.get("BRIDGE_PORT", "3000"))
REQUEST_TIMEOUT = int(os.environ.get("BRIDGE_TIMEOUT", "120"))

http_client: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global http_client
    http_client = httpx.AsyncClient(timeout=httpx.Timeout(REQUEST_TIMEOUT))
    yield
    if http_client:
        await http_client.aclose()


app = FastAPI(title="Claude Code ↔ OpenCode Zen Bridge", version="1.0.0", lifespan=lifespan)


def resolve_api_key(request: Request) -> str:
    key = request.headers.get("x-api-key", "")
    if not key:
        auth = request.headers.get("authorization", "")
        if auth.startswith("Bearer "):
            key = auth[7:]
    if not key:
        key = ENV_API_KEY
    if not key:
        raise HTTPException(status_code=401, detail="No API key found. Set OPENCODE_ZEN_API_KEY env var or pass x-api-key header.")
    return key


def anthropic_to_openai(body: dict) -> dict:
    messages: list[dict] = []

    # ── Model Mapping (Suffix Removed) ───────────────────────────
    MODEL_MAP = {
        "claude-opus-4-8": "qwen3-coder-480b-a35b",
        "claude-sonnet-4": "qwen3-coder-480b-a35b",
        "claude-haiku-4": "qwen3-coder-480b-a35b",
    }

    target_model = MODEL_MAP.get(
        body.get("model"),
        "qwen3-coder-480b-a35b"  # Fallback model updated
    )
    # ───────────────────────────────────────────────────────────────

    system_val = body.get("system")
    if system_val:
        if isinstance(system_val, str):
            messages.append({"role": "system", "content": system_val})
        elif isinstance(system_val, list):
            parts = [b.get("text", "") for b in system_val if b.get("type") == "text"]
            if parts:
                messages.append({"role": "system", "content": "\n".join(parts)})

    for msg in body.get("messages", []):
        role = msg["role"]
        raw = msg.get("content", "")
        if isinstance(raw, list):
            texts = [b.get("text", "") for b in raw if b.get("type") == "text"]
            content = "\n".join(texts)
        else:
            content = raw
        messages.append({"role": role, "content": content})

    openai_body: dict = {
        "model": target_model,
        "messages": messages,
        "stream": True,
        "stream_options": {"include_usage": True},
        "max_tokens": body.get("max_tokens", 8192),
    }

    if "temperature" in body:
        openai_body["temperature"] = body["temperature"]
    if "top_p" in body:
        openai_body["top_p"] = body["top_p"]
    if "stop_sequences" in body:
        openai_body["stop"] = body["stop_sequences"]

    return openai_body


def format_sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


async def proxy_stream(api_key: str, openai_body: dict) -> AsyncGenerator[bytes, None]:
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    msg_id = f"msg_{uuid.uuid4().hex[:24]}"
    model_name = openai_body["model"]
    sent_start = False
    block_started = False
    output_tokens_est = 0
    stop_reason = "end_turn"

    try:
        async with http_client.stream("POST", ZEN_CHAT_URL, json=openai_body, headers=headers) as resp:
            if resp.status_code != 200:
                error_body = await resp.aread()
                error_detail = error_body.decode()
                log.error("Upstream error %s: %s", resp.status_code, error_detail)
                yield format_sse("error", {
                    "type": "error",
                    "error": {"type": "api_error", "message": f"Upstream {resp.status_code}: {error_detail[:500]}"},
                }).encode()
                return

            async for line in resp.aiter_lines():
                if not line.startswith("data: "):
                    continue

                raw = line[6:]
                if raw == "[DONE]":
                    break

                try:
                    chunk = json.loads(raw)
                except json.JSONDecodeError:
                    continue

                choices = chunk.get("choices", [])
                if not choices:
                    continue

                delta = choices[0].get("delta", {})
                finish = choices[0].get("finish_reason")

                # ── message_start ──────────────────────────────────────
                if not sent_start:
                    usage = chunk.get("usage", {}) or {}
                    inp = usage.get("prompt_tokens", 0) or usage.get("input_tokens", 0)
                    sent_start = True
                    block_started = True
                    yield format_sse("message_start", {
                        "type": "message_start",
                        "message": {
                            "id": msg_id,
                            "type": "message",
                            "role": "assistant",
                            "content": [],
                            "model": model_name,
                            "stop_reason": None,
                            "stop_sequence": None,
                            "usage": {"input_tokens": inp, "output_tokens": 0},
                        },
                    }).encode()
                    yield format_sse("content_block_start", {
                        "type": "content_block_start",
                        "index": 0,
                        "content_block": {"type": "text", "text": ""},
                    }).encode()

                # ── content_block_delta (text) ─────────────────────────
                text = delta.get("content", "")
                if text:
                    output_tokens_est += max(1, len(text) // 4)
                    yield format_sse("content_block_delta", {
                        "type": "content_block_delta",
                        "index": 0,
                        "delta": {"type": "text_delta", "text": text},
                    }).encode()

                # ── finish ─────────────────────────────────────────────
                if finish:
                    if finish == "length":
                        stop_reason = "max_tokens"
                    elif finish == "content_filter":
                        stop_reason = "content_filter"
                    else:
                        stop_reason = "end_turn"

                    if block_started:
                        yield format_sse("content_block_stop", {
                            "type": "content_block_stop",
                            "index": 0,
                        }).encode()
                        block_started = False

                    usage = chunk.get("usage", {}) or {}
                    out = usage.get("completion_tokens", 0) or usage.get("output_tokens", 0) or output_tokens_est

                    yield format_sse("message_delta", {
                        "type": "message_delta",
                        "delta": {"stop_reason": stop_reason, "stop_sequence": None},
                        "usage": {"output_tokens": out},
                    }).encode()
                    yield format_sse("message_stop", {"type": "message_stop"}).encode()
                    return  # stream done

            # If stream ended without finish_reason
            if block_started:
                yield format_sse("content_block_stop", {"type": "content_block_stop", "index": 0}).encode()
            yield format_sse("message_delta", {
                "type": "message_delta",
                "delta": {"stop_reason": "end_turn", "stop_sequence": None},
                "usage": {"output_tokens": output_tokens_est},
            }).encode()
            yield format_sse("message_stop", {"type": "message_stop"}).encode()

    except httpx.TimeoutException:
        log.error("Upstream request timed out")
        yield format_sse("error", {
            "type": "error",
            "error": {"type": "timeout_error", "message": "Upstream request timed out"},
        }).encode()
    except Exception as e:
        log.exception("Stream error")
        yield format_sse("error", {
            "type": "error",
            "error": {"type": "internal_error", "message": str(e)},
        }).encode()


# ──────────────────────────────────────────────
#  Routes
# ──────────────────────────────────────────────

@app.post("/v1/messages")
async def messages(request: Request):
    api_key = resolve_api_key(request)
    body = await request.json()
    openai_body = anthropic_to_openai(body)
    log.info("→ model=%s | tokens=%s", openai_body["model"], openai_body.get("max_tokens"))

    streaming = body.get("stream", True)
    if not streaming:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        body_no_stream = {**openai_body, "stream": False}
        try:
            resp = await http_client.post(ZEN_CHAT_URL, json=body_no_stream, headers=headers)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text[:500])
            data = resp.json()
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Upstream request timed out")

        choice = data.get("choices", [{}])[0]
        content = choice.get("message", {}).get("content", "") or choice.get("text", "")
        usage = data.get("usage", {}) or {}
        return {
            "id": f"msg_{uuid.uuid4().hex[:24]}",
            "type": "message",
            "role": "assistant",
            "content": [{"type": "text", "text": content}],
            "model": data.get("model", openai_body["model"]),
            "stop_reason": "end_turn",
            "stop_sequence": None,
            "usage": {
                "input_tokens": usage.get("prompt_tokens", 0) or usage.get("input_tokens", 0),
                "output_tokens": usage.get("completion_tokens", 0) or usage.get("output_tokens", 0),
            },
        }

    return StreamingResponse(
        proxy_stream(api_key, openai_body),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/v1/models")
async def list_models(request: Request):
    try:
        api_key = resolve_api_key(request)
    except HTTPException:
        api_key = ENV_API_KEY

    headers = {"Authorization": f"Bearer {api_key}"} if api_key else {}
    try:
        resp = await http_client.get(ZEN_MODELS_URL, headers=headers)
        if resp.status_code == 200:
            return resp.json()
    except Exception:
        pass

    return {
        "object": "list",
        "data": [
            {"id": "qwen3-coder-480b-a35b", "object": "model"},
            {"id": "deepseek-v4-flash-free", "object": "model"},
            {"id": "qwen3.6-plus-free", "object": "model"},
            {"id": "minimax-m3-free", "object": "model"},
            {"id": "nemotron-3-ultra-free", "object": "model"},
            {"id": "north-mini-code-free", "object": "model"},
            {"id": "mimo-v2.5-free", "object": "model"},
        ],
    }


@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": time.time()}


@app.get("/")
async def root():
    return {
        "name": "Claude Code ↔ OpenCode Zen Bridge",
        "endpoints": {
            "POST /v1/messages": "Chat completions (Anthropic format in → OpenAI format out)",
            "GET /v1/models": "List available models",
            "GET /health": "Health check",
        },
    }
if __name__ == "__main__":
    import uvicorn

    log.info("Starting Claude Code ↔ OpenCode Zen Bridge")
    log.info("Listening on http://%s:%s", LISTEN_HOST, LISTEN_PORT)

    uvicorn.run(
        app,
        host=LISTEN_HOST,
        port=LISTEN_PORT,
        log_level="info"
    )