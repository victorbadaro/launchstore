const { Router } = require('express')
const HomeController = require('../app/controllers/HomeController')
const routes = Router()

const products = require('./products')
const users = require('./users')
const cart = require('./cart')

// HOME
routes.get('/', HomeController.index)

routes.use('/products', products)
routes.use('/users', users)
routes.use('/cart', cart)

// ALIAS
routes.get('/ads/create', function(req, res) {
    return res.redirect('/products/create')
})

routes.get('/accounts', function(req, res) {
    return res.redirect('/users/login')
})

module.exports = routes