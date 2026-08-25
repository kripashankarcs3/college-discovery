const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const OUT = path.join(__dirname, '..', 'public', 'images', 'colleges')

const COLLEGES = [
  { id: 'iit-kanpur', abbr: 'IITK', name: 'IIT Kanpur', bg: '#1a1a2e', fg: '#e94560' },
  { id: 'iit-bombay', abbr: 'IITB', name: 'IIT Bombay', bg: '#0f3460', fg: '#16213e' },
  { id: 'iit-delhi', abbr: 'IITD', name: 'IIT Delhi', bg: '#2c3e50', fg: '#3498db' },
  { id: 'iit-madras', abbr: 'IITM', name: 'IIT Madras', bg: '#1a1a2e', fg: '#e94560' },
  { id: 'bhu-varanasi', abbr: 'BHU', name: 'BHU Varanasi', bg: '#2d1b69', fg: '#6c63ff' },
  { id: 'iiit-hyderabad', abbr: 'IIITH', name: 'IIIT Hyderabad', bg: '#1b4332', fg: '#40916c' },
  { id: 'mnnit-prayagraj', abbr: 'MNNIT', name: 'MNNIT Allahabad', bg: '#3d0c11', fg: '#d00000' },
  { id: 'bits-pilani', abbr: 'BITS', name: 'BITS Pilani', bg: '#03045e', fg: '#0077b6' },
  { id: 'nit-trichy', abbr: 'NITT', name: 'NIT Trichy', bg: '#3d405b', fg: '#e07a5f' },
  { id: 'jnu-delhi', abbr: 'JNU', name: 'JNU Delhi', bg: '#283618', fg: '#bc6c25' },
  { id: 'du-stephans', abbr: 'SS', name: 'St. Stephens', bg: '#4a0e4e', fg: '#9b5de5' },
  { id: 'srcc-delhi', abbr: 'SRCC', name: 'SRCC Delhi', bg: '#001219', fg: '#ee9b00' },
  { id: 'hindu-college', abbr: 'HC', name: 'Hindu College', bg: '#1d3557', fg: '#457b9d' },
  { id: 'dtu-delhi', abbr: 'DTU', name: 'DTU Delhi', bg: '#240046', fg: '#9c89b8' },
  { id: 'nsut-delhi', abbr: 'NSUT', name: 'NSUT Delhi', bg: '#2b2d42', fg: '#8d99ae' },
  { id: 'vit-vellore', abbr: 'VIT', name: 'VIT Vellore', bg: '#0d1b2a', fg: '#e0e1dd' },
  { id: 'srm-university', abbr: 'SRM', name: 'SRM University', bg: '#1b263b', fg: '#415a77' },
  { id: 'amrita-university', abbr: 'AU', name: 'Amrita University', bg: '#3a0ca3', fg: '#7209b7' },
  { id: 'christ-bangalore', abbr: 'CU', name: 'Christ University', bg: '#003049', fg: '#d62828' },
  { id: 'rv-bangalore', abbr: 'RVCE', name: 'RV College', bg: '#264653', fg: '#2a9d8f' },
  { id: 'amity-noida', abbr: 'AU', name: 'Amity University', bg: '#344e41', fg: '#a3b18a' },
  { id: 'thapar-university', abbr: 'TU', name: 'Thapar University', bg: '#5c4d7d', fg: '#b8b8d1' },
  { id: 'chandigarh-university', abbr: 'CU', name: 'Chandigarh Univ', bg: '#212529', fg: '#6c757d' },
  { id: 'lpu-punjab', abbr: 'LPU', name: 'LPU Punjab', bg: '#301934', fg: '#cf9fff' },
  { id: 'kiet-ghaziabad', abbr: 'KIET', name: 'KIET Ghaziabad', bg: '#023047', fg: '#fb8500' },
  { id: 'aligarh-muslim-university', abbr: 'AMU', name: 'AMU Aligarh', bg: '#2b2b2b', fg: '#6f1d1b' },
  { id: 'jmi-delhi', abbr: 'JMI', name: 'JMI Delhi', bg: '#3e1f47', fg: '#7b2cbf' },
  { id: 'jadavpur-university', abbr: 'JU', name: 'Jadavpur Univ', bg: '#2b2d42', fg: '#edf2f4' },
  { id: 'manipal-university', abbr: 'MU', name: 'Manipal Univ', bg: '#0a9396', fg: '#005f73' },
  { id: 'symbiosis-pune', abbr: 'SIU', name: 'Symbiosis Pune', bg: '#4a4e69', fg: '#c9ada7' },
  { id: 'pict-pune', abbr: 'PICT', name: 'PICT Pune', bg: '#1d3557', fg: '#a8dadc' },
  { id: 'iet-lucknow', abbr: 'IET', name: 'IET Lucknow', bg: '#3b2f2f', fg: '#a40e4c' },
  { id: 'navrachana-vadodara', abbr: 'NU', name: 'Navrachana Univ', bg: '#2f3e46', fg: '#cad2c5' },
]

function svgPlaceholder(c) {
  const w = 1200, h = 675
  const gx = 0, gy = 0
  const gx2 = w, gy2 = h
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c.bg}"/>
      <stop offset="100%" style="stop-color:${c.fg}"/>
    </linearGradient>
    <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse" opacity="0.06">
      <circle cx="20" cy="20" r="1.5" fill="white"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#grad)"/>
  <rect width="${w}" height="${h}" fill="url(#dots)"/>
  <text x="${w/2}" y="${h/2 - 20}" text-anchor="middle" dominant-baseline="central"
    font-family="Georgia,serif" font-size="180" font-weight="bold" fill="rgba(255,255,255,0.08)"
    letter-spacing="8">${c.abbr}</text>
  <text x="${w/2}" y="${h/2 + 50}" text-anchor="middle" dominant-baseline="central"
    font-family="system-ui,sans-serif" font-size="36" font-weight="600" fill="rgba(255,255,255,0.5)"
    letter-spacing="4" text-transform="uppercase">CAMPUS</text>
  <text x="${w - 30}" y="${h - 30}" text-anchor="end"
    font-family="system-ui,sans-serif" font-size="14" fill="rgba(255,255,255,0.2)">${c.name}</text>
</svg>`
}

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

  let count = 0
  for (const c of COLLEGES) {
    const outPath = path.join(OUT, `${c.id}.jpg`)
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 50000) {
      console.log(`${c.id}: real image (${(fs.statSync(outPath).size/1024).toFixed(0)}KB)`)
      continue
    }

    const svg = svgPlaceholder(c)
    const svgPath = outPath.replace('.jpg', '.svg')
    fs.writeFileSync(svgPath, svg)
    console.log(`${c.id}: SVG placeholder generated`)
    count++
  }
  console.log(`\nGenerated ${count} SVG placeholders`)
}

main().catch(console.error)
