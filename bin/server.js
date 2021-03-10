const app = require('../app')
const db = require('../model/db')
const createFolder = require('../helpers/create-dir')
require('dotenv').config()

const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, async () => {
    const UPLOAD_DIR = process.env.UPLOAD_DIR
    const AVATAR_OF_USER = process.env.AVATAR_OF_USER

    await createFolder(UPLOAD_DIR)
    await createFolder(AVATAR_OF_USER)

    console.log(`Server running. Use our API on port ${PORT}`)
  })
}).catch(error => {
  console.log(`Server not running. Error mesage: ${error.message}`)
  process.exit(1)
})
