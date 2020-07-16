const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const session = require('./config/session')
const routes = require('./routes')
const app = express()

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

app.listen(5000, function() {
    console.log('Server is running...')
})