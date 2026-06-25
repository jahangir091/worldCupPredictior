import { writeFileSync } from 'fs'

const res = await fetch('https://www.worldometers.info/geography/flags-of-the-world/')
const html = await res.text()

const regex = /<img[^>]+src="([^"]+)"[^>]*alt="Flag of ([^"]+)"/gi
const flags = {}
let m
while ((m = regex.exec(html)) !== null) {
  const url = m[1].startsWith('http') ? m[1] : `https://www.worldometers.info${m[1]}`
  flags[m[2].trim()] = url
}

console.log('Found', Object.keys(flags).length, 'flags')
console.log('Sample:', Object.entries(flags).slice(0, 3))
writeFileSync('scripts/worldometer-flags.json', JSON.stringify(flags, null, 2))
