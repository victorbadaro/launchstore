require('dotenv').config();

const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const session = require('./config/session')
const routes = require('./routes')
const app = express()
const SERVER_PORT = process.env.SERVER_PORT

app.set('view engine', 'njk')
app.use(session)
app.use((req, res, next) => {
    res.locals.session = req.session
    return next()
})
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

nunjucks.configure('src/app/views', {
    express: app,
    autoescape: false,
    noCache: true
})

app.listen(SERVER_PORT, function () {
    console.log('Server is running...')
})