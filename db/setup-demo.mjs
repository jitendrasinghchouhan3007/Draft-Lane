import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFilePath = fileURLToPath(import.meta.url)
const dbDir = path.dirname(currentFilePath)
const projectRoot = path.resolve(dbDir, '..')

const filesToPrepare = [
  {
    source: path.join(projectRoot, 'backend', '.env.example'),
    target: path.join(projectRoot, 'backend', '.env'),
  },
  {
    source: path.join(projectRoot, 'frontend', '.env.example'),
    target: path.join(projectRoot, 'frontend', '.env'),
  },
]

for (const file of filesToPrepare) {
  if (fs.existsSync(file.target)) {
    console.log(`Keeping existing ${path.relative(projectRoot, file.target)}`)
    continue
  }

  fs.copyFileSync(file.source, file.target)
  console.log(`Created ${path.relative(projectRoot, file.target)}`)
}

console.log('Demo setup files are ready.')
console.log('If MongoDB is not running locally, start it with: docker-compose -f db/mongo-compose.yml up -d')