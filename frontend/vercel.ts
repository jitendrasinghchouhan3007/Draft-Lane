declare const process: {
  env: Record<string, string | undefined>
}

const rawApiBaseUrl = process.env.VITE_API_BASE_URL?.trim() || ''
const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '')

const config = {
  framework: 'vite',
  installCommand: 'npm install',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  rewrites: [
    ...(apiBaseUrl
      ? [
          {
            source: '/api/:path*',
            destination: `${apiBaseUrl}/:path*`,
          },
        ]
      : []),
    {
      source: '/(.*)',
      destination: '/index.html',
    },
  ],
  headers: apiBaseUrl
    ? [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'x-vercel-enable-rewrite-caching',
              value: '0',
            },
          ],
        },
      ]
    : [],
}

export default config