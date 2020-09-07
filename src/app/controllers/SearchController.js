const Product = require('../models/Product')

const { formatPrice } = require('../../lib/utils')

module.exports = {
    async index(req, res) {
        try {
            let result,
                params = {}
            const { filter, category } = req.query

            if(!filter)
                return res.redirect('/')
            
            params.filter = filter

            if(category)
                params.category = category
            
            let products = await Product.search(params)

            async function getImage(productId) {
                let files = await Product.files(productId)
                files = result.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)

                return files[0]
            }

            const productsPromise = products.map(async product => {
                product.img = await getImage(product.id)
                product.oldPrice = formatPrice(product.old_price)
                product.price = formatPrice(product.price)

                return product
            })

            products = await Promise.all(productsPromise)

            const search = {
                term: req.query.filter,
                total: products.length
            }

            // ARRAY de categorias (não repetidas): [ { id: 1, name: 'Eletrônicos' }, { id: 2, name: 'Comida' } ]
            const categories = products.map(product => ({
                id: product.category_id,
                name: product.category_name
            })).reduce((categoriesFiltered, category) => {
                const found = categoriesFiltered.some(cat => cat.id == category.id)

                if(!found)
                    categoriesFiltered.push(category)
                
                return categoriesFiltered
            }, [])
            
            return res.render('search/index', { products, search, categories })
        } catch (error) {
            console.error(error)
        }
    }
}