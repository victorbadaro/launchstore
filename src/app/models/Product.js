const db = require('../../config/db')
const Base = require('./Base')

Base.init({ table: 'products' })

module.exports = {
    ...Base,
    async files(id) {
        const result = await db.query(`SELECT * FROM files WHERE product_id = $1`, [id])

        return result.rows
    },
    async search(params) {
        const { filter, category } = params
        let query = ''
            filterQuery = 'WHERE'
        
        if(category) {
            filterQuery = `
                ${filterQuery} products.category_id = ${category}
                AND`
            // WHERE products.category_id = 1
            // AND
        }

        filterQuery = `
            ${filterQuery} products.name ILIKE '%${filter}%'
            OR products.description ILIKE '%${filter}%'`
        
        // Se tiver categoria:
        // WHERE products.category_id = 1
        // AND products.name ILIKE '%pizza%'
        // OR products.description ILIKE '%pizza recheada com queijo%'

        // Se não tiver categoria:
        // WHERE products.name ILIKE '%pizza%'
        // OR products.description ILIKE '%pizza recheada com queijo%'

        query = `
            SELECT products.*, categories.name AS category_name
            FROM products
            LEFT JOIN categories ON (products.category_id = categories.id)
            ${filterQuery}`
        
        const result = await db.query(query)
        return result.rows
    }
}