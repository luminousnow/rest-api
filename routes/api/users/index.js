const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/users') // registration, logIn, logOut
const { createUser } = require('../users/validation')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')

// === router REGISTRATION ===
router.post('/auth/register', createUser, userController.reg)

// === router LOGIN ===
router.post('/auth/login', userController.logIn)

// === router LOGOUT ===
router.post('/auth/logout', guard, userController.logOut)

// === router GET ===
router.get('/current', guard, userController.getUser)

// === router PATCH ===
router.get('/avatars', guard, upload.single('avatar'), userController.setAvatar)

module.exports = router
