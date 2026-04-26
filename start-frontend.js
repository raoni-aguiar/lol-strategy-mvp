import { createServer } from 'vite'
import { exec } from 'child_process'

const port = process.env.PORT || 4173
exec(`npx vite preview --host --port ${port}`, (err, stdout, stderr) => {
  if (err) console.error(err)
  console.log(stdout)
  console.error(stderr)
})