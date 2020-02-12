const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const bodyParser = express.json()

authRouter
  .post('/login', bodyParser, (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }
    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Must include all fields`
        })

    AuthService.getUserByUsername(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect user name or password'
          })

        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect user name or password'
              })

            const sub = dbUser.user_name
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload),
              userId: dbUser.id
            })
          })
      })
      .catch(next)
  })

  module.exports = authRouter