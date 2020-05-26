const Category = require('../models/Category')
const Product = require('../models/Product')
const { formatPrice } = require('../../lib/utils')

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

        return res.redirect(`/products/${productID}/edit`)
    },
    async edit(req, res) {
        let result = await Product.find(req.params.id)
        const product = result.rows[0]

        if(!product)
            return res.send('Produto não encontrado!')
        
        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        
        result = await Category.all()
        const categories = result.rows

        return res.render('products/edit', { product, categories })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys)
            if(req.body[key] == '')
                res.send('Por favor, preencha todos os campos!')
        
        req.body.price = req.body.price.replace(/\D/g, '')

        if(req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)

            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}/edit`)
    },
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}