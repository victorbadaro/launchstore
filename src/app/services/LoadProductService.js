const { sep } = require('path')
const Product = require('../models/Product')

const { formatPrice, date } = require('../../lib/utils')

async function getImages(productId) {
    let files = await Product.files(productId)
    files = files.map(file => ({
        ...file,
        src: `${file.path.replace('public', '')}`
    }))

    return files
}

async function format(product) {
    const files = await getImages(product.id)

    product.img = `${files[0].src}`.split(sep).join('/')
    product.files = files
    product.formattedOldPrice = formatPrice(product.old_price)
    product.formattedPrice = formatPrice(product.price)

    const { day, month, hour, minutes } = date(product.updated_at)
    
    product.published = {
        day: `${day}/${month}`,
        hour: `${hour}h${minutes}min.`
    }

    return product
}

const LoadService = {
    load(service, filter) {
        this.filter = filter

        return this[service]()
    },
    async product() {
        try {
            const product = await Product.findOne(this.filter)
            return format(product)
        } catch (error) {
            console.error(error)
        }
    },
    async products() {
        try {
            const products = await Product.findAll(this.filter)
            const productsPromises = products.map(format)

            return Promise.all(productsPromises)
        } catch (error) {
            console.error(error)
        }
    },
    async productWithDeleted() {
        try {
            const product = await Product.findOneWithDeleted(this.filter)
            return format(product)
        } catch (error) {
            console.error(error)
        }
    },
    format
}


module.exports = LoadService