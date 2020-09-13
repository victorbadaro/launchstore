async function post(req, res, next) {
    const keys = Object.keys(req.body)
    
    for(key of keys)
        if(req.body[key] == '')
            res.send('Por favor, volte preencha todos os campos!')
    
    if(!req.files || req.files.length == 0)
        return res.send('Por favor, envie pelo menos uma imagem!')
    
    return next()
}

async function put(req, res, next) {
    const keys = Object.keys(req.body)
    
    for(key of keys)
        if(req.body[key] == '' && key != 'removed_files')
            res.send('Por favor, volte preencha todos os campos!')
    return next()
}

module.exports = {
    post,
    put
}