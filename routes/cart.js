const {Router} = require('express')
const Product = require('../models/product')
const router = Router()
const auth = require('../middleware/auth')

function mapCartItems(cart) {
  return cart.items.map(p => ({
    ...p.productId._doc, 
    id: p.productId.id,
    count: p.count
  }))
}

function computePrice(products) {
  return products.reduce((total, product) => {
    return total += product.price * product.count
  }, 0)
}

router.post('/add', auth, async (req, res) => {
  const product = await Product.findById(req.body.id)
  const result = await req.user.addToCart(product)
  if (result) {
    res.redirect('/cart')
  } 
  else {
    res.json({error: true})
  }
})
  
router.get('/', auth, async (req, res) => {

  const user = await req.user
    .populate('cart.items.productId')
    .execPopulate()

  const products = mapCartItems(user.cart)

  res.render('cart', {
    title: 'Корзина',
    isCart: true,
    products,
    price: computePrice(products)
  })

})
  
router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  const user = await req.user.populate('cart.items.productId').execPopulate()
  const products = mapCartItems(user.cart)
  const cart = {
    products, price: computePrice(products)
  }
  res.status(200).json(cart)
})

module.exports = router