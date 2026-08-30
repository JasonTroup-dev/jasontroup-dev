import { mkdir, writeFile } from 'node:fs/promises'
import { build } from 'vite'

await build()

await mkdir('dist/server', { recursive: true })
await writeFile(
  'dist/server/index.js',
  `export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response('Static assets binding is unavailable.', { status: 503 })
    }

    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404 || request.method !== 'GET') return response

    const url = new URL(request.url)
    if (url.pathname.includes('.')) return response

    url.pathname = '/index.html'
    return env.ASSETS.fetch(new Request(url, request))
  },
}
`,
)
