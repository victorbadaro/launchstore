const { Router } = require('express')
const HomeController = require('../app/controllers/HomeController')
const routes = Router()

const products = require('./products')
const users = require('./users')

// HOME
routes.get('/', HomeController.index)

routes.use('/products', products)
routes.use('/users', users)

// ALIAS
routes.get('/ads/create', function(req, res) {
    return res.redirect('/products/create')
})

routes.get('/accounts', function(req, res) {
    return res.redirect('/users/register')
})

module.exports = routes