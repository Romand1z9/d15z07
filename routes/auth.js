const {Router} = require('express')
const router = Router()
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const regEmailTemplate = require('../emails/registration')
const { loginValidators, registerValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')

router.get('/login', async (req, res) => {
    res.render('auth/login', {
      title: 'Авторизация',
      isLogin: true,
      loginError: req.flash('loginError'),
      registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})
  
router.post('/login', loginValidators,  async (req, res) => {

    const errors = await validationResult(req)
      
    if (!errors.isEmpty()) {
      req.flash('loginError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }

    try {

        const {email, password} = req.body

        const candidate = await User.findOne({ email })

        const areSame = await bcrypt.compare(password, candidate.password)

        if (!areSame) {
          await req.flash('loginError', 'Неверный пароль!')
          return res.redirect('/auth/login#login')
        }
        
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
            if (err) {
                throw err
            }
            res.redirect('/')
        })
    } catch (e) {
        console.log(e)
    }

})

router.post('/register', registerValidators,  async (req, res) => {

    const errors = await validationResult(req)
    
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }

    try {

      const {email, password, confirm, name} = req.body

      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({
        email, name, password: hashPassword, cart: {items: []}
      })

      await user.save()
      res.redirect('/auth/login#login')

    } catch (e) {
      console.log(e)
      res.redirect('/auth/login#register')
    }

  })

module.exports = router