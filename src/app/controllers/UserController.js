const User = require('../models/User')

module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },
    post(req, res) {
        // CHECK IF HAS ALL FIELDS
        const keys = Object.keys(req.body)

        for(let key of keys) {
            if(req.body[key] == '')
                return res.send('Please, fill all fields!')
        }

        // CHECK IF USER EXISTS [EMAIL, CPF_CNPJ]
        const { email, cpf_cnpj } = req.body
        const user = await User.findOne({
            where: {email},
            or: {cpf_cnpj}
        })

        // CHECK IF PASSWORD MATCH
    },
    show(req, res) {},
    update(req, res) {},
    delete(req, res) {}
}