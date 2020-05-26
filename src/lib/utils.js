module.exports = {
    date(timestamp) {
        const date = new Date(timestamp)

        const year = `000${date.getUTCFullYear()}`.slice(-4)
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            isoDate: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            brFormat: `${day}/${month}/${year}`
        }
    },
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL'
        }).format(price/100)
    }
}