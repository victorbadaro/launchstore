module.exports = {
    loginForm(req, res) {
        return res.render('session/index')
    },
    login(req, res) {},
    logout(req, res) {
        req.session.destroy()

        return res.redirect('/')
    },
    forgotForm(req, res) {},
    resetForm(req, res) {},
    forgot(req, res) {},
    reset(req, res) {}
}