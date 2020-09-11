const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(let key of keys) {
        if(body[key] == '')
            return {
                error: 'Por favor, preencha todos os campos',
                user: body
            }
    }
}

async function post(req, res, next) {
    // CHECK IF HAS ALL FIELDS
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields)
        return res.render('user/register', { fillAllFields })

    // CHECK IF USER EXISTS [EMAIL, CPF_CNPJ]
    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, '')
    const user = await User.findOne({
        where: {email},
        or: {cpf_cnpj}
    })

    if(user)
        return res.render('user/register', { error: 'Usuário já cadastrado.', user: req.body })

    // CHECK IF PASSWORD MATCH
    if(password != passwordRepeat)
        return res.render('user/register', { error: 'A senha e a repetição da senha estão incorretas', user: req.body })
    
    next()
}

async function show(req, res, next) {
    const { userId: id } = req.session
    const user = await User.findOne({ where: {id} })

    if(!user)
        return res.render('user/register', { error: 'Usuário não encontrado' })
    
    req.user = user
    
    next()
}

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields)
        return res.render('user/index', fillAllFields)
    
    const { id, password } = req.body

    if(!password)
        return res.render('user/index', { error: 'Coloque tua senha para atualizar teu cadastro', user: req.body })
    
    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)

    if(!passed)
        return res.render('user/index', { error: 'Senha incorreta', user: req.body })
    
    req.user = user

    next()
}

module.exports = {
    post,
    show,
    update
}