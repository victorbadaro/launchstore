const { Router } = require('express')
const routes = Router()

routes.get('/', function(req, res) {
    return res.render('layout')
})

module.exports = routes