const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')

let usersIDs = []

async function createUsers() {
    const users = []
    const password = await hash('1234', 8)

    while(users.length < 3) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.random.number(99999999999),
            cep: faker.random.number(99999999),
            address: faker.address.streetName()
        })
    }

    const usersPromises = users.map(user => User.create(user))

    usersIDs = await Promise.all(usersPromises)
}

createUsers()