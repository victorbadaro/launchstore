const db = require("../../config/db")

const Base = {
    init({ table }) {
        if(!table)
            throw new Error('Invalid Params')
        
        this.table = table
        return this
    },
    async findOne(filters) {
        let query = `SELECT * FROM ${this.table}`

        Object.keys(filters).map(key => {
            query = `
                ${query}
                ${key}`
            
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })

        const result = await db.query(query)

        return result.rows[0]
    },
    async create(fields) {
        let keys = []
        let values = []

        try {
            Object.keys(fields).map(key => {
                keys.push(key)
                values.push(fields[key])
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')}) VALUES (${values.join(',')}) RETURNING id`
            const result = await db.query(query)

            return result.rows[0].id
        } catch (error) {
            console.error(error)
        }
    },
    async update(id, fields) {
        try {
            let update = []
            
            Object.keys(fields).map(key => {
                const line = `${key} = '${fields[key]}'`

                update.push(line)
            })
    
            let query = `UPDATE ${this.table} SET ${update.join(',')} WHERE id = ${id}`
    
            await db.query(query)
            return
        } catch (error) {
            console.error(error)
        }
    },
    delete(id) {
        return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
    }
}

module.exports = Base