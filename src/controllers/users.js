const { response } = require('../middleware/common')
const {
  register,
  findEmail,
  getAll,
  verification
} = require('../models/user')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { generateToken, refreshToken } = require('../helpers/auth')
const refreshTokens = []
const email = require('../middleware/email')
const Port = process.env.PORT
const Host = process.env.HOST

const usersControllers = {
  register: async (req, res, next) => {
    const { rows: [newuser] } = await findEmail(req.body.email)

    if (newuser) {
      return response(res, 404, false, 'email already use register fail')
    }
    // create otp
    const digits = '0123456789'
    let otp = ''
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)]
    }

    const salt = bcrypt.genSaltSync(10)
    const password = bcrypt.hashSync(req.body.password)

    const data = {
      id: uuidv4(),
      email: req.body.email,
      password,
      nama_depan: req.body.nama_depan,
      nama_belakang: req.body.nama_belakang,
      no_hp: req.body.no_hp,
      alamat: req.body.alamat,
      otp
    }
    console.log(data)

    try {
      const result = await register(data);
      if (result) {
        console.log(result)

        const urlVerif = `http://${Host}:${Port}/users/${req.body.email}/${otp}`
        const text = `thank for you join ${data.nama_depan} please click here for verif you email ${urlVerif}`
        const sendEmail = email(data.email, otp, text)
        if (sendEmail === 'email not send!') {
          return response(res, 404, false, null, 'register fail')
        }
        response(res, 200, true, { otp: data.otp }, 'register success please check your email to verif')
      }
    } catch (err) {
      console.log(err)
      response(res, 404, false, err.message, 'register fail')
    }
  },

  login: async (req, res, next) => {
    const { rows: [newuser] } = await findEmail(req.body.email)
    if (!newuser) {
      return response(res, 404, false, null, 'email not found')
    }
    if (newuser.verif === 0) {
      return response(res, 404, false, null, 'account not verified')
    }

    const password = req.body.password
    const validation = bcrypt.compareSync(password, newuser.password)
    if (!validation) {
      return response(res, 404, false, null, 'wrong password')
    }

    delete newuser.password
    const payload = {
      id: newuser.id,
      email: newuser.email
    }
    const accessToken = generateToken(payload)
    const refToken = refreshToken(payload)

    newuser.token = accessToken
    newuser.refreshToken = refToken
    refreshTokens.push(refreshToken)

    response(res, 200, true, newuser, 'login success')
  },

  otp: async (req, res, next) => {
    const { rows: [newuser] } = await findEmail(req.params.email)
    if (!newuser) {
      return response(res, 404, false, null, 'email not found')
    }
    if (newuser.otp == req.params.otp) {
      const result = await verification(req.params.email)
      return response(res, 200, true, result.rows, 'email succes')
    }
    return response(res, 404, false, null, 'wrong otp please check your email')
  },

  getAll: async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const offset = (page - 1) * limit
    const sortby = req.query.sortby || 'id'
    const sort = req.query.sort || 'DESC'
    const search = req.query.search || ''
    try {
      const result = await getAll({ page, limit, offset, sortby, sort, search })

      if (result) {
        response(res, 200, true, result.rows, 'get all  success')
      }
    } catch (err) {
      console.log(err)
      response(res, 404, false, err.message, ' get all users fail')
    }
  }

}

exports.usersControllers = usersControllers
