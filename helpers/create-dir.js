const fs = require('fs/promises')

const isAccessible = path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false)
}

const createFolder = async path => {
  // check results isAccessible. If catch "false" => convert to "true" and starting "if" body
  if (!(await isAccessible(path))) {
    await fs.mkdir(path, { recursive: true })
  }
}

module.exports = createFolder
