const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
    create(req, res) {
        // Pegar categorias (utilizando Promise)
        Category.all()
        .then(function(result) {
            const categories = result.rows
            return res.render('products/create', { categories })
        })
        .catch(function(err) {
            throw new Error(err)
        })
    },
    async post(req, res) {
        // Lógica de salvar (utilizando async await)
        const keys = Object.keys(req.body)

        for(key of keys)
            if(req.body[key] == '')
                res.send('Por favor, preencha todos os campos!')
        
        let result = await Product.create(req.body)
        const productID = result.rows[0].id

        result = await Category.all()
        const categories = result.rows

        return res.render('products/create', { productID, categories })
    }
}