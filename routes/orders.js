const {Router} = require('express')
const Order = require('../models/order')
const router = Router()
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {

  try {
    const orders = await Order.find({'user.userId': req.user._id})
      .populate('user.userId')

    //console.log(orders[0])

    res.render('orders', {
      isOrder: true,
      title: 'Заказы',
      orders: orders.map(o => {
        return {
          _id: o._id,
          userName: o.user.userId.name,
          userEmail: o.user.userId.email,
          date: o.date,
          products: o.products.map(p => {
            return {
              _id: p._id,
              count: p.count,
              title: p.product.title,
              product: {...p.product._doc}
            }
          }),
          price: o.products.reduce((total, p) => {
            return total += p.count * p.product.price
          }, 0)
        }
      })
    })
  } catch (e) {
    console.log(e)
  }

})


router.post('/', auth, async (req, res) => {

  try {
    const user = await req.user
      .populate('cart.items.productId')
      .execPopulate()

    const products = user.cart.items.map(i => ({
      count: i.count,
      product: {...i.productId._doc}
    }))

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products
    })

    await order.save()
    await req.user.clearCart()

    res.redirect('/orders')
  } catch (e) {
    console.log(e)
  }

})

module.exports = router