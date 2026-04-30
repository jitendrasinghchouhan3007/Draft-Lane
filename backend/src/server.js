import dotenv from 'dotenv'

import app from './app.js'
import { connectDb } from './config/db.js'

dotenv.config()

const port = Number.parseInt(process.env.PORT || '5000', 10)
const isVercel = process.env.VERCEL === '1'

if (isVercel) {
  await connectDb()
} else {
  connectDb()
    .then(() => {
      app.listen(port, () => {
        console.log(`Backend running on http://localhost:${port}`)
      })
    })
    .catch((error) => {
      console.error('Unable to start server')
      console.error(error)
      process.exit(1)
    })
}

export default app