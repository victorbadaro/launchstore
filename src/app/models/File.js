const Base = require('./Base')

Base.init({ table: 'files' })

module.exports = {
    ...Base,
}

// async delete(id) {
//     try {
//         const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
//         const file = result.rows[0]

//         // fs.unlink(file.path, (err) => {
//         //     if(err)
//         //         throw err

//         //     return db.query('DELETE FROM files WHERE id = $1', [id]) // Parar deletar do banco
//         // })
        
//         fs.unlinkSync(file.path) // Para deletar o arquivo da pasta public/images
//         return db.query('DELETE FROM files WHERE id = $1', [id]) // Parar deletar do banco
//     } catch(err) {
//         console.error(err)
//     }
// 