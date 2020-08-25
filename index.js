const app_conf = require('./conf/main')

const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')

const homeRoutes = require('./routes/home')
const authRoutes = require('./routes/auth')
const addRoutes = require('./routes/add')
const productsRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const ordersRoutes = require('./routes/orders')
const profileRoutes = require('./routes/profile')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const fileMiddleware = require('./middleware/file')
const errorMiddleware = require('./middleware/error')
//const { exit } = require('process')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
})

const store = new MongoStore({
  collection: 'sessions',
  uri: app_conf.getUrlConnect()
})

const PORT = process.env.PORT || 3000

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/storage/images', express.static(path.join(__dirname, 'storage', 'images')))
app.use(express.urlencoded({extended: true})) //Entry Params

app.use(session({
  secret: app_conf.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

//routes
app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/add', addRoutes)
app.use('/products', productsRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', ordersRoutes)
app.use('/profile', profileRoutes)

app.use(errorMiddleware)

async function start() {
  try {
    await mongoose.connect(app_conf.getUrlConnect(), {
      useNewUrlParser: true, 
      useUnifiedTopology: true, 
      useFindAndModify: false
    })
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  }
  catch (error) {
    console.log(error)
  }
}

start()

