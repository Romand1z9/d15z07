const path = require('path')
const fs = require('fs')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'storage',
  'cart.json'
)

class Cart {

    static async add(product) {

      const cart = await Cart.fetch()

      const idx = cart.products.findIndex(p => p.id === product.id)
      const candidate = cart.products[idx]
  
      if (candidate) {
        // товар уже есть
        candidate.count++
        cart.products[idx] = candidate
      } else {
        // добавить новый товар
        product.count = 1
        cart.products.push(product)
      }
  
      cart.price += +product.price
  
      return new Promise((resolve, reject) => {
        fs.writeFile(p, JSON.stringify(cart), err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })

    } 
  
    static async fetch() {

      return new Promise((resolve, reject) => {

        fs.readFile(p, 'utf-8', (err, content) => {

          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(content))
          }

        })
      
      })

    }

    static async remove(id) {
      
      const cart = await Cart.fetch()

      const idx = cart.products.findIndex(c => c.id === id)
      const product = cart.products[idx]
  
      if (product.count === 1) { // удалить
        cart.products = cart.products.filter(p => p.id !== id)
      } else { // изменить количество
        cart.products[idx].count--
      }
  
      cart.price -= product.price
  
      return new Promise((resolve, reject) => {
        fs.writeFile(p, JSON.stringify(cart), err => {
          if (err) {
            reject(err)
          } else {
            resolve(cart)
          }
        })
      })

    }

  }
  
module.exports = Cart