const { unlinkSync } = require('fs')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')
const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async create(req, res) {
        try {
            const categories = await Category.findAll()
            return res.render('products/create', { categories })
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            let { category_id, name, description, old_price, price, quantity, status } = req.body

            price = price.replace(/\D/g, '')

            const product_id = await Product.create({
                category_id,
                user_id: req.session.userId,
                name,
                description,
                old_price: old_price || price,
                price,
                quantity,
                status: status || 1
            })

            const filesPromise = req.files.map(file => File.create({
                name: file.filename,
                path: file.path,
                product_id
            }))
            await Promise.all(filesPromise)

            return res.redirect(`/products/${product_id}/edit`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            const product = await LoadProductService.load('product', {
                where: {
                    id: req.params.id
                }
            })

            return res.render('products/show', { product })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            const product = await LoadProductService.load('product', {
                where: {
                    id: req.params.id
                }
            })

            // GET CATEGORIES
            const categories = await Category.findAll()

            return res.render('products/edit', { product, categories })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            if (req.files.length != 0) {
                const newFilesPromise = req.files.map(file => File.create({ ...file, product_id: req.body.id }))

                await Promise.all(newFilesPromise)
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1

                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(id => File.delete(id))

                await Promise.all(removedFilesPromise)
            }

            req.body.price = req.body.price.replace(/\D/g, '')

            if (req.body.old_price != req.body.price) {
                const oldProduct = await Product.find(req.body.id)

                req.body.old_price = oldProduct.price
            }

            await Product.update(req.body.id, {
                category_id: req.body.category_id,
                name: req.body.name,
                description: req.body.description,
                old_price: req.body.old_price,
                price: req.body.price,
                quantity: req.body.quantity,
                status: req.body.status
            })

            return res.redirect(`/products/${req.body.id}`)
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        const files = await Product.files(req.body.id)

        await Product.delete(req.body.id)

        files.map(file => {
            try {
                if (file.path !== 'public/images/placeholder.png') {
                    unlinkSync(file.path)
                }
            } catch (error) {
                console.error(error)
            }
        })

        return res.redirect('/products/create')
    }
}