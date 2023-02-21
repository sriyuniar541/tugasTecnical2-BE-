const express = require('express')
const router = express.Router()
const { usersControllers } = require('../controllers/users')
const { protect } = require('../middleWare/auth')
const multer = require('multer')
const uploaded = multer()

router.post('/register', uploaded.array(), usersControllers.register)
router.post('/login', uploaded.array(), usersControllers.login)
router.get('/:email/:otp', uploaded.array(), usersControllers.otp)
router.get('/', protect, usersControllers.getAll)

module.exports = router
