const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const { formatPrice, date } = require('../../lib/utils')

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
        
        if(req.files.length == 0)
            return res.send('Please send at least one image')
        
        req.body.user_id = req.session.userId

        const result = await Product.create(req.body)
        const productID = result.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file, product_id: productID }))
        await Promise.all(filesPromise)

        return res.redirect(`/products/${productID}/edit`)
    },
    async show(req, res) {
        let result = await Product.find(req.params.id)
        const product = result.rows[0]

        if(!product)
            return res.send('Product Not Found!')

        const { day, month, hour, minutes } = date(product.updated_at)

        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}h${minutes}min.`
        }

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        result = await Product.files(product.id)
        const files = result.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('products/show', { product, files })
    },
    async edit(req, res) {
        let result = await Product.find(req.params.id)
        const product = result.rows[0]

        if(!product)
            return res.send('Produto não encontrado!')
        
        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)
        
        // GET CATEGORIES
        result = await Category.all()
        const categories = result.rows

        // GET IMAGES
        result = await Product.files(product.id)
        let files = result.rows

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render('products/edit', { product, categories, files })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys)
            if(req.body[key] == '' && key != 'removed_files')
                res.send('Por favor, preencha todos os campos!')
        
        if(req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create({ ...file, product_id: req.body.id}))

            await Promise.all(newFilesPromise)
        }
        
        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1

            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }
        
        req.body.price = req.body.price.replace(/\D/g, '')

        if(req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)

            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)
    },
    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}