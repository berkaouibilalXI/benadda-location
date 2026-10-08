// Runs after the two Vite builds (see "build" in package.json).
// Turns the empty app shell into one finished HTML file per language, plus
// robots.txt, sitemap.xml and a 404 page, all inside dist/.
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const ssrDir = path.resolve('dist-ssr')

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8')
for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) throw new Error(`index.html is missing ${marker}`)
}

const { render, languages, buildRobots, buildSitemap } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const defaultCode = languages[0].code
for (const { code } of languages) {
  const { html, head, lang, dir } = render(code)
  const page = template
    .replace('<html lang="fr" dir="ltr">', `<html lang="${lang}" dir="${dir}">`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html)
  const outDir = code === defaultCode ? dist : path.join(dist, code)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), page)
  console.log(`prerendered ${code === defaultCode ? '/' : `/${code}/`}  (${(page.length / 1024).toFixed(1)} KB)`)
}


let lastmod = new Date().toISOString().slice(0, 10)
try {
  lastmod = execSync('git log -1 --format=%cs', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || lastmod
} catch {

}
fs.writeFileSync(path.join(dist, 'robots.txt'), buildRobots())
fs.writeFileSync(path.join(dist, 'sitemap.xml'), buildSitemap(lastmod))


fs.writeFileSync(
  path.join(dist, '404.html'),
  `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" /><title>Page introuvable | Benadda DreamCar</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#000;color:#fff;font-family:Arial,sans-serif;text-align:center}
h1{font-size:64px;margin:0;color:#e51d23}p{color:#9a9a9a}a{color:#fff;font-weight:700}</style></head>
<body><main><h1>404</h1><p>Page introuvable.</p><p><a href="/">Retour à l'accueil</a></p></main></body></html>
`,
)

fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`done · sitemap lastmod ${lastmod}`)
