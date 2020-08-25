const {Router} = require('express')
const router = Router()
const auth = require('../middleware/auth')
const Product = require('../models/product')
const {productValidator} = require('../utils/validators')
const {validationResult} = require('express-validator')

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить товар',
    isAdd: true
  })
})

router.post('/', auth, productValidator, async (req, res) => {

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Добавить товар',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img
      }
    })
  }

  const new_product = new Product({
    title: req.body.title, 
    price: req.body.price, 
    img: req.body.img,
    userId: req.user._id
  })

  await new_product.save()

  res.redirect(301, '/products');


})

module.exports = router