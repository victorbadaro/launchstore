const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')
const Product = require('./Product')
const Base = require('./Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base,
    // async create(data) {
    //     try {
    //         const query = `
    //             INSERT INTO users (
    //                 name,
    //                 email,
    //                 password,
    //                 cpf_cnpj,
    //                 cep,
    //                 address
    //             ) VALUES ($1, $2, $3, $4, $5, $6)
    //             RETURNING id`
            
    //         // HASH OF PASSWORD
    //         const passwordHash = await hash(data.password, 8)
            
    //         const values = [
    //             data.name,
    //             data.email,
    //             passwordHash,
    //             data.cpf_cnpj.replace(/\D/g, ''),
    //             data.cep.replace(/\D/g, ''),
    //             data.address
    //         ]
    
    //         const result = await db.query(query, values)
    //         return result.rows[0].id
    //     } catch (error) {
    //         console.error(error)
    //     }
    // },
    async update(id, fields) {
        let query = 'UPDATE users SET'

        Object.keys(fields).map((key, index, array) => {
            if((index + 1) < array.length) {
                query = `
                    ${query}
                    ${key} = '${fields[key]}',`
            } else {
                // last iteration
                query = `
                    ${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}`
            }
        })

        await db.query(query)
        return
    },
    async delete(id) {
        // Pegar todos os produtos do usuário
        let result = await db.query('SELECT * FROM products WHERE user_id = $1', [id])
        const products = result.rows

        // Dos produtos, pegar todas as imagens
        const allFilesPromise = products.map(product => Product.files(product.id))

        let promiseResult = await Promise.all(allFilesPromise)

        // Rodar a remoção do usuário
        await db.query('DELETE FROM users WHERE id = $1', [id])

        // Remover as imagens da pasta 'public'
        promiseResult.map(result => {
            result.rows.map(file => {
                try {
                    fs.unlinkSync(file.path)
                } catch (error) {
                    console.error(error)
                }
            })
        })
    }
}