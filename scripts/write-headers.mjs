// Writes vercel.json and public/_headers from config/security-headers.json so every host sends the same policy.
// Runs automatically before `npm run build`.
import { writeFileSync } from 'node:fs'
import security from '../config/security-headers.json' with { type: 'json' }

const all = { 'Content-Security-Policy': security.csp.join('; '), ...security.headers }
const longCache = 'public, max-age=31536000, immutable'
const assetDirs = ['images']

const vercel = {
  headers: [
    { source: '/(.*)', headers: Object.entries(all).map(([key, value]) => ({ key, value })) },
    { source: `/(${assetDirs.join('|')})/(.*)`, headers: [{ key: 'Cache-Control', value: longCache }] },
  ],
}
writeFileSync('vercel.json', `${JSON.stringify(vercel, null, 2)}\n`)

const lines = ['/*', ...Object.entries(all).map(([key, value]) => `  ${key}: ${value}`), '']
assetDirs.forEach((dir) => lines.push(`/${dir}/*`, `  Cache-Control: ${longCache}`, ''))
writeFileSync('public/_headers', lines.join('\n'))

