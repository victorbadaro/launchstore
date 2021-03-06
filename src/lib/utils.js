const { NumberFormat } = require('intl')

module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)

        const year = `000${date.getFullYear()}`.slice(-4)
        const month = `0${date.getMonth() + 1}`.slice(-2)
        const day = `0${date.getDate()}`.slice(-2)
        const hour = date.getHours()
        const minutes = date.getMinutes()

        return {
            day,
            month,
            year,
            hour,
            minutes,
            isoDate: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            brFormat: `${day}/${month}/${year}`
        }
    },
    formatPrice(price) {
        const formattedPrice = NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price/100)
        return formattedPrice
    },
    formatCpfCnpj(value) {
        value = value.replace(/\D/g, '')

        if(value.length > 14)
            value = value.slice(0, -1)

        // CHECK IF IS CNPJ
        // EXEMPLO DE CNPJ
        // 11.222.333/0001-11
        if(value.length > 11) {
            // 11222333444455

            value = value.replace(/(\d{2})(\d)/, '$1.$2') // 11.222333444455
            value = value.replace(/(\d{3})(\d)/, '$1.$2') // 11.222.333444455
            value = value.replace(/(\d{3})(\d)/, '$1/$2') // 11.222.333/444455
            value = value.replace(/(\d{4})(\d)/, '$1-$2') // 11.222.333/4444-55
        } else {
            // CPF
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1.$2')
            value = value.replace(/(\d{3})(\d)/, '$1-$2')
        }

        return value
    },
    formatCep(value) {
        value = value.replace(/\D/g, '')

        if(value.length > 8)
            value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, '$1-$2')

        return value
    }
}