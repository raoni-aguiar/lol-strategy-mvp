const { execSync } = require('child_process')
const port = process.env.PORT || 3000
console.log(`Serving on port ${port}`)
execSync(`npx serve dist -l ${port}`, { stdio: 'inherit' })