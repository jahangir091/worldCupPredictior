import { writeFileSync } from 'fs'

const pairs = [
  ['gb-sct', 'https://flagcdn.com/w160/sc.png'],
  ['gb-eng', 'https://flagcdn.com/w160/gb-eng.png'],
]

for (const [iso, url] of pairs) {
  const res = await fetch(url)
  writeFileSync(`public/flags/${iso}.webp`, Buffer.from(await res.arrayBuffer()))
  console.log('Fixed', iso)
}
