const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/users') // registration, logIn, logOut
const {
  validateCreateUser,
  validateUploadAvatar,
} = require('../users/validation')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')

// === router REGISTRATION ===
router.post('/auth/register', validateCreateUser, userController.reg)

// === router LOGIN ===
router.post('/auth/login', userController.logIn)

// === router LOGOUT ===
router.post('/auth/logout', guard, userController.logOut)

// === router GET ===
router.get('/current', guard, userController.getUser)

// === router PATCH ===
router.patch(
  '/avatars',
  [guard, upload.single('avatar'), validateUploadAvatar],
  userController.setAvatar,
)

module.exports = router
