const {Router} = require('express')
const router = Router()
const Product = require('../models/product')
const auth = require('../middleware/auth')
const {productValidator} = require('../utils/validators')
const {validationResult} = require('express-validator')

router.get('/', async (req, res) => {

  try {
    const data = await Product.find().populate('userId', 'email name')

    const products = [];
  
    data.map(p => {
      products.push({
        id: p._id,
        title: p.title,
        price: p.price,
        img: p.img,
        user_id: (p.userId && p.userId._id) ? p.userId._id : null
      })
    })
  
    res.render('products', {
      title: 'Товары',
      isProducts: true,
      products,
      userId: req.user ? req.user._id.toString() : null,
    })
  }
  catch(e) {
    console.log(e)
  }



})

router.get('/:id', async (req, res) => {

  try {
    const id = req.params.id ? req.params.id : null
  
    const product = await Product.findById(id)

    res.render('product', {
      layout: 'empty',
      title: `Товар "${product.title}"`,
      product: {
        id: product._id,
        title: product.title,
        img: product.img,
        price: product.price
      }
    })
  }
  catch (e) {
    console.log(e)
  }

})

router.get('/edit/:id', auth, async (req, res) => {

  //if (!req.query.allow) return res.redirect('/')

  const id = req.params.id ? req.params.id : null
  
  const product = await Product.findById(id)

  if (product.userId.toString() !== req.user._id.toString()) return res.redirect('/products')
  
  res.render('product-edit', {
    title: `Редактировать "${product.title}"`,
    product: {
      id: product._id,
      title: product.title,
      img: product.img,
      price: product.price
    }
  })

})

router.post('/edit', auth, productValidator, async (req, res) => {

  const errors = validationResult(req)
  const {id} = req.body

  if (!errors.isEmpty()) {
    return res.status(422).redirect(`/products/edit/${id}`)
  }

  try {
    const product = await Product.findById(id)

    if (product.userId.toString() !== req.user._id.toString()) return res.redirect('/products')
  
    await Product.findByIdAndUpdate(id, req.body)
    
    res.redirect('/products')
  } catch(e) {
    console.log(e)
  }

})

router.post('/remove', auth, async (req, res) => {

  const id = req.body.id ? req.body.id : null

  try {
    await Product.deleteOne({
      _id: id,
      userId: req.user._id
    })
    res.redirect('/products')

  } catch (e) {
    console.log(e)
  }
})

module.exports = router