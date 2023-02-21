const jwt = require('jsonwebtoken')

const key = process.env.JWT_KEY

const generateToken = (payload) => {
  const verifyOpts = {
    expiresIn: '1h'
  }
  const token = jwt.sign(payload, key, verifyOpts)
  return token
}
const refreshToken = (payload) => {
  const verifyOpts = {
    expiresIn: '24h'
  }
  const token = jwt.sign(payload, key, verifyOpts)
  return token
}

const decodeToken = (token) => {
  const decoded = jwt.verify(token, key)
  return decoded
}

module.exports = { generateToken, refreshToken, decodeToken }
