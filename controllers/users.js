const jwt = require('jsonwebtoken')
const fs = require('fs/promises')
const path = require('path')
const Users = require('../model/users') // findByEmail, findById, findByToken, create, updateToken, updateAvatar
// const createFolder = require('../helpers/create-dir')
const { HttpCode } = require('../helpers/constants')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET

// === REGISTRATION ===
const reg = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await Users.findByEmail(email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: { status: 'conflict', message: 'Email in use' },
      })
    }

    const newUser = await Users.create(req.body)

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatarURL,
          subscription: newUser.subscription,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// === LOGIN ===
const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.validPassword(password)

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: { status: 'UNAUTHORIZED', message: 'Invalid credntials' },
      })
    }

    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(id, token)

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// === LOGOUT ===
const logOut = async (req, res, next) => {
  const userId = req.user.id
  await Users.updateToken(userId, null)
  return res.status(HttpCode.NO_CONTENT).json({})
}

// === GET USER ===
const getUser = async (req, res, next) => {
  try {
    const token = req.get('Authorization')?.split(' ')[1]
    const user = await Users.findByToken(token)

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: { status: 'UNAUTHORIZED', message: 'Not authorized' },
      })
    }

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// === PATCH AVATAR ===
const setAvatar = async (req, res, next) => {
  try {
    const id = req.user.id
    const avatarURL = req.user.avatarURL
    const AVATAR_OF_USER = process.env.AVATAR_OF_USER
    const pathFileAvatar = req.file.path
    const newNameAvatar = `${Date.now()}-${req.file.originalname}`

    // await createFolder(path.join(AVATAR_OF_USER, id))
    await fs.rename(pathFileAvatar, path.join(AVATAR_OF_USER, newNameAvatar))
    const avatarPath = path.normalize(path.join(id, newNameAvatar))

    // // Feature for the future. Delete the previous image.

    // try {
    //   await fs.unlink(
    //     path.join(process.cwd(), AVATAR_OF_USER, req.user.avatarURL),
    //   )
    // } catch (error) {
    //   console.log(error.message)
    // }

    await Users.updateAvatar(id, avatarPath)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarURL },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { reg, logIn, logOut, getUser, setAvatar }
