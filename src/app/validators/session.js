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

async function reset(req, res, next) {
    const { email, password, passwordRepeat, token } = req.body
    const user = await User.findOne({ where: {email} })

    if(!user)
        return res.render('session/password-reset', { error: 'Usuário não cadastrado!', token, user: req.body })

    if(password != passwordRepeat)
        return res.render('session/password-reset', { error: 'A senha e a repetição da senha estão incorretas.', token, user: req.body })

    if(token != user.reset_token)
        return res.render('session/password-reset', { error: 'Token inválido! Solicite uma nova recuperação de senha', token, user: req.body })

    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires)
        return res.render('session/reset-password', { error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.', token, user: req.body})
    
    req.user = user

    return next()
}

module.exports = {
    login,
    forgot,
    reset
}