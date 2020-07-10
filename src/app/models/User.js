const db = require('../../config/db')

module.exports = {
    async findOne(filters) {
        let query = 'SELECT * FROM users'

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}`

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const result = await db.query(query)
        return result.rows[0]
    }
}