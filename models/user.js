const {Schema, model} = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  avatarUrl: String,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        }
      }
    ]
  }
})

userSchema.methods.addToCart = function(product) {

  try {

    if (!product) throw new Error('Error!')

    const items = [...this.cart.items]
    const idx = items.findIndex(c => c.productId.toString() === product._id.toString())
  
    if (idx >= 0) {
      items[idx].count = items[idx].count + 1
    } else {
      items.push({
        productId: product._id,
        count: 1
      })
    }
  
    this.cart = {items}
    return this.save()

  } catch(error) {
    return false
  }
  
}

userSchema.methods.removeFromCart = function(id) {
  let items = [...this.cart.items]
  const idx = items.findIndex(p => p.productId.toString() === id.toString())

  if (items[idx].count === 1) {
    items = items.filter(p => p.productId.toString() !== id.toString())
  } else {
    items[idx].count--
  }

  this.cart = {items}
  return this.save()
}

userSchema.methods.clearCart = function() {
  this.cart = {items: []}
  return this.save()
}

module.exports = model('User', userSchema)