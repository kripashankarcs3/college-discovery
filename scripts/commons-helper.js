// Helper functions for querying Wikimedia Commons API and downloading images.
// Usage: node scripts/commons-helper.js <command> <args>
//   node scripts/commons-helper.js category "Category:IIT Bombay"
//   node scripts/commons-helper.js search "IIT Delhi main building"
//   node scripts/commons-helper.js info "File:IITBMainBuidling.jpg"
//   node scripts/commons-helper.js download "File:IITBMainBuidling.jpg" iit-bombay

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const API = 'https://commons.wikimedia.org/w/api.php';
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'colleges');
const UA = 'CollegeDiscoverySiteImageSourcing/1.0 (educational, non-commercial; contact: developers.ai33@gmail.com)';
const fetchOpts = { headers: { 'User-Agent': UA } };
const origFetch = fetch;
function fetch2(url, opts) { return origFetch(url, { ...fetchOpts, ...opts }); }

async function categoryMembers(cat) {
  const url = `${API}?action=query&list=categorymembers&cmtitle=${encodeURIComponent(cat)}&cmnamespace=6&cmlimit=100&format=json`;
  const r = await fetch2(url);
  const d = await r.json();
  return (d.query?.categorymembers || []).map(m => m.title);
}

async function searchFiles(q, limit = 20) {
  const url = `${API}?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&format=json&srlimit=${limit}`;
  const r = await fetch2(url);
  const d = await r.json();
  return (d.query?.search || []).map(m => m.title);
}

async function imageInfo(title) {
  const url = `${API}?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size|extmetadata|mime&format=json`;
  const r = await fetch2(url);
  const d = await r.json();
  const pages = d.query?.pages || {};
  const page = Object.values(pages)[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const em = info.extmetadata || {};
  return {
    title: page.title,
    url: info.url,
    width: info.width,
    height: info.height,
    mime: info.mime,
    size: info.size,
    license: em.LicenseShortName?.value,
    licenseUrl: em.LicenseUrl?.value,
    artist: (em.Artist?.value || '').replace(/<[^>]+>/g, '').trim(),
    credit: (em.Credit?.value || '').replace(/<[^>]+>/g, '').trim(),
    restrictions: em.Restrictions?.value,
  };
}

async function downloadFile(title, id) {
  const info = await imageInfo(title);
  if (!info) throw new Error('No imageinfo for ' + title);
  const outPath = path.join(OUT_DIR, `${id}.jpg`);
  const r = await fetch2(info.url);
  if (!r.ok) throw new Error('Download failed: ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  // Normalize to 1200x675 (16:9) cover crop, jpeg quality 82, matching existing real photos.
  const outBuf = await sharp(buf).resize(1200, 675, { fit: 'cover' }).jpeg({ quality: 82 }).toBuffer();
  fs.writeFileSync(outPath, outBuf);
  const meta = await sharp(outBuf).metadata();
  return { outPath, info, bytes: outBuf.length, width: meta.width, height: meta.height };
}

async function main() {
  const [, , cmd, ...args] = process.argv;
  if (cmd === 'category') {
    const res = await categoryMembers(args[0]);
    console.log(JSON.stringify(res, null, 2));
  } else if (cmd === 'search') {
    const res = await searchFiles(args[0]);
    console.log(JSON.stringify(res, null, 2));
  } else if (cmd === 'info') {
    const res = await imageInfo(args[0]);
    console.log(JSON.stringify(res, null, 2));
  } else if (cmd === 'download') {
    const res = await downloadFile(args[0], args[1]);
    console.log(JSON.stringify({ outPath: res.outPath, bytes: res.bytes, info: res.info }, null, 2));
  } else {
    console.log('Unknown command:', cmd);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
