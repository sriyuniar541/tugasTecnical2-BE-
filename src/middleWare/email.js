const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  secure: true,
  port: 465,
  auth: {
    user: process.env.usernameEmail,
    pass: process.env.usernamePassword
  }
})

module.exports = (email, subject, text) => {
  const mailOptions = {
    from: process.env.usernameEmail,
    to: email,
    subject: `${subject} is your otp`,
    text
  }

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('Error ' + err)
      console.log('email not sent!')
    } else {
      console.log('Email sent successfully')
      return 'email sent successfully'
    }
  })
}
