const { Router } = require('express')
const ProductController = require('./app/controllers/ProductController')
const routes = Router()

routes.get('/', function(req, res) {
    return res.render('layout')
})

routes.get('/products/create', ProductController.create)

routes.get('/ads/create', function(req, res) {
    return res.redirect('/products/create')
})

module.exports = routes