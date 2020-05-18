const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const routes = require('./routes')
const app = express()

app.set('view engine', 'njk')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

nunjucks.configure('src/app/views', {
    express: app,
    autoescape: false,
    noCache: true
})

app.listen(3000, function() {
    console.log('Server is running...')
})