import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'

const flagsJson = JSON.parse(readFileSync('scripts/worldometer-flags.json', 'utf8'))
const outDir = 'public/flags'
mkdirSync(outDir, { recursive: true })

const TEAM_FLAG_NAMES = {
  MEX: 'Mexico', RSA: 'South Africa', KOR: 'South Korea', CZE: 'Czech Republic (Czechia)',
  CAN: 'Canada', BIH: 'Bosnia and Herzegovina', QAT: 'Qatar', SUI: 'Switzerland',
  BRA: 'Brazil', MAR: 'Morocco', HAI: 'Haiti', SCO: 'United Kingdom',
  USA: 'United States', PAR: 'Paraguay', AUS: 'Australia', TUR: 'Turkey',
  GER: 'Germany', CUW: 'Curaçao', CIV: "Côte d'Ivoire", ECU: 'Ecuador',
  NED: 'Netherlands', JPN: 'Japan', SWE: 'Sweden', TUN: 'Tunisia',
  BEL: 'Belgium', EGY: 'Egypt', IRN: 'Iran', NZL: 'New Zealand',
  ESP: 'Spain', CPV: 'Cabo Verde', KSA: 'Saudi Arabia', URU: 'Uruguay',
  FRA: 'France', SEN: 'Senegal', IRQ: 'Iraq', NOR: 'Norway',
  ARG: 'Argentina', ALG: 'Algeria', AUT: 'Austria', JOR: 'Jordan',
  POR: 'Portugal', COD: 'DR Congo', UZB: 'Uzbekistan', COL: 'Colombia',
  ENG: 'United Kingdom', CRO: 'Croatia', GHA: 'Ghana', PAN: 'Panama',
}

const TEAM_FLAG_ISO = {
  MEX: 'mx', RSA: 'za', KOR: 'kr', CZE: 'cz', CAN: 'ca', BIH: 'ba', QAT: 'qa', SUI: 'ch',
  BRA: 'br', MAR: 'ma', HAI: 'ht', SCO: 'gb-sct', USA: 'us', PAR: 'py', AUS: 'au', TUR: 'tr',
  GER: 'de', CUW: 'cw', CIV: 'ci', ECU: 'ec', NED: 'nl', JPN: 'jp', SWE: 'se', TUN: 'tn',
  BEL: 'be', EGY: 'eg', IRN: 'ir', NZL: 'nz', ESP: 'es', CPV: 'cv', KSA: 'sa', URU: 'uy',
  FRA: 'fr', SEN: 'sn', IRQ: 'iq', NOR: 'no', ARG: 'ar', ALG: 'dz', AUT: 'at', JOR: 'jo',
  POR: 'pt', COD: 'cd', UZB: 'uz', COL: 'co', ENG: 'gb-eng', CRO: 'hr', GHA: 'gh', PAN: 'pa',
}

const FLAG_IMAGE_BASE = 'https://www.worldometers.info/images/flags/w240'

const FALLBACK_URLS = {
  'gb-sct': 'https://flagcdn.com/w160/sc.png',
  'gb-eng': 'https://flagcdn.com/w160/gb-eng.png',
  cw: 'https://flagcdn.com/w160/cw.png',
}

const manifest = {}

for (const [teamId, iso] of Object.entries(TEAM_FLAG_ISO)) {
  const name = TEAM_FLAG_NAMES[teamId]
  let url = flagsJson[name]
  if (!url && !iso.includes('-')) url = `${FLAG_IMAGE_BASE}/${iso}.webp`
  if (!url) url = FALLBACK_URLS[iso]
  if (iso.includes('-') && FALLBACK_URLS[iso]) url = FALLBACK_URLS[iso]
  if (!url) {
    console.warn('No URL for', teamId)
    continue
  }

  const fileName = `${iso}.webp`
  const outPath = `${outDir}/${fileName}`

  if (!existsSync(outPath)) {
    const res = await fetch(url, { headers: { 'User-Agent': 'worldCupPredictior/1.0' } })
    if (!res.ok) {
      console.warn('Failed', teamId, res.status, url)
      continue
    }
    writeFileSync(outPath, Buffer.from(await res.arrayBuffer()))
    console.log('Downloaded', teamId, '->', fileName)
  } else {
    console.log('Exists', fileName)
  }

  manifest[teamId] = iso
}

writeFileSync('src/data/flagManifest.json', JSON.stringify(manifest, null, 2))
console.log('Done:', Object.keys(manifest).length, 'flags')
