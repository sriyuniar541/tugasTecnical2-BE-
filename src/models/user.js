const Pool = require('../config/db')

const register = (data) => {
  const { id, email, password, nama_depan, nama_belakang, no_hp, alamat, otp } = data
  console.log(data)
  return new Promise((resolve, reject) =>
    Pool.query(`INSERT INTO newuser (id,email,password,nama_depan,nama_belakang,no_hp,alamat,verif,otp) 
        VALUES('${id}','${email}','${password}','${nama_depan}','${nama_belakang}','${no_hp}','${alamat}',0,${otp})`,
    (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(err.message)
      }
    })
  )
}

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM newuser where email='${email}'`, (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(err)
      }
    })
  )
}

const getAll = ({ page, limit, offset, sortby, sort, search }) => {
  console.log(page, limit, offset, sortby, sort, search, 'dari model')
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM newuser ORDER BY newuser.${sortby} ${sort} LIMIT ${limit} OFFSET ${offset}`, (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(err)
      }
    })
  )
}

const verification = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`UPDATE newuser SET verif=1 WHERE email ='${email}'`, (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(err)
      }
    }))
}

module.exports = {
  register,
  findEmail,
  getAll,
  verification
}
