# Claude Code ↔ OpenCode Zen Bridge

A lightweight local proxy that translates Anthropic Messages API requests into OpenAI Chat Completions API requests, allowing **Claude Code CLI** to use **OpenCode Zen free models** (DeepSeek V4 Flash, Qwen, MiniMax, etc).

## How it works

```
Claude Code CLI  ──►  Bridge (localhost:3000)  ──►  OpenCode Zen API
(Anthropic format)     (converts format)          (OpenAI format)
```

## Installation

### 1. Install Python 3.11+ (if not installed)

```powershell
winget install Python.Python.3.12
```
Restart your terminal after installation.

### 2. Install dependencies

```powershell
cd proxy
pip install -r requirements.txt
```

### 3. Set your OpenCode Zen API key

```powershell
$env:OPENCODE_ZEN_API_KEY = "sk-your-key-here"
```

To make it permanent, add it to your PowerShell profile:
```powershell
notepad $PROFILE
```
Add: `$env:OPENCODE_ZEN_API_KEY = "sk-your-key-here"`

## Run the bridge

### Foreground (for testing)

```powershell
cd proxy
python main.py
```

### Background (Windows)

**Method 1 – PowerShell background job:**
```powershell
cd proxy
Start-Job -Name "zen-bridge" -ScriptBlock { python main.py }
```

**Method 2 – Windows Task Scheduler (survives reboots):**
- Create a `.bat` file:
```batch
@echo off
cd C:\Users\kripa\Desktop\intern\proxy
set OPENCODE_ZEN_API_KEY=sk-your-key-here
python main.py
```
- Schedule it to run at startup via Task Scheduler (set "Run whether user is logged on or not")

**Method 3 – NSSM (runs as Windows Service):**
```powershell
# Install NSSM first: https://nssm.cc/download
nssm install ZenBridge "C:\Users\kripa\AppData\Local\Programs\Python\Python312\python.exe" "C:\Users\kripa\Desktop\intern\proxy\main.py"
nssm set ZenBridge AppEnvironmentExtra OPENCODE_ZEN_API_KEY=sk-your-key-here
nssm start ZenBridge
```

## Configure Claude Code

Edit `%USERPROFILE%\.claude\settings.json`:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:3000",
    "ANTHROPIC_MODEL": "deepseek-v4-flash-free",
    "ANTHROPIC_API_KEY": "sk-your-opencode-zen-key-here"
  }
}
```

Then run:
```bash
claude
```

When prompted "Do you want to use custom API config?" → **Yes**

## Available free models

| Model ID | Description |
|----------|-------------|
| `deepseek-v4-flash-free` | DeepSeek V4 Flash (free) |
| `qwen3.6-plus-free` | Qwen 3.6 Plus (free) |
| `minimax-m3-free` | MiniMax M3 (free) |
| `nemotron-3-ultra-free` | Nemotron 3 Ultra (free) |
| `north-mini-code-free` | North Mini Code (free) |
| `mimo-v2.5-free` | Mimo v2.5 (free) |

Switch models in Claude Code with: `/model <model-id>`

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENCODE_ZEN_API_KEY` | — | Your OpenCode Zen API key |
| `ZEN_BASE_URL` | `https://opencode.ai/zen` | OpenCode Zen base URL |
| `BRIDGE_HOST` | `127.0.0.1` | Listen address |
| `BRIDGE_PORT` | `3000` | Listen port |
| `BRIDGE_TIMEOUT` | `120` | Upstream request timeout (seconds) |

## Verify it works

```powershell
# Health check
curl http://localhost:3000/health

# List models
curl http://localhost:3000/v1/models

# Test a chat request
curl -X POST http://localhost:3000/v1/messages ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: sk-your-key-here" ^
  -H "anthropic-version: 2023-06-01" ^
  -d "{\"model\":\"deepseek-v4-flash-free\",\"max_tokens\":100,\"messages\":[{\"role\":\"user\",\"content\":\"Say hello\"}]}"
```

## Limitations

- **No tool call support** – Free models don't support function/tool calling. Claude Code's tool-use features (bash, file edit, etc.) won't work. The model can only generate text responses.
- **No vision/images** – Image content blocks are silently dropped.
- **No extended thinking** – Anthropic's `thinking` beta feature is not supported.
- **Token counting is approximate** – Usage numbers are estimated.
