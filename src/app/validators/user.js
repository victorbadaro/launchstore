const User = require('../models/User')

async function post(req, res, next) {
    // CHECK IF HAS ALL FIELDS
    const keys = Object.keys(req.body)

    for(let key of keys) {
        if(req.body[key] == '')
            return res.render('user/register', { error: 'Por favor, preencha todos os campos', user: req.body })
    }

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

module.exports = {
    post
}