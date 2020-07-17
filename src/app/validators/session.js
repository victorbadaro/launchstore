const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body
    const user = await User.findOne({ where: {email} })

    if(!user)
        return res.render('session/login', { error: 'Usuário não cadastrado', user: req.body })
    
    const passed = await compare(password, user.password)

    if(!passed)
        return res.render('session/login', { error: 'Senha incorreta', user: req.body })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        const user = await User.findOne({ where: {email} })

        if(!user)
            return res.render('session/forgot-password', { error: 'Email não cadastrado!', user: req.body })
        
        req.user = user
        
        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    login,
    forgot
}