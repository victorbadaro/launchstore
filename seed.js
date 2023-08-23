require('dotenv').config();

const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Product = require('./src/app/models/Product')
const File = require('./src/app/models/File')

let usersIDs = []
let totalProducts = 10
let totalUsers = 3

async function createUsers() {
    const users = []
    const password = await hash('1234', 8)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.datatype.number(99999999999),
            cep: faker.datatype.number(99999999),
            address: faker.address.streetName()
        })
    }

    const usersPromises = users.map(user => User.create(user))

    usersIDs = await Promise.all(usersPromises)
}

async function createProducts() {
    let products = []

    while (products.length < totalProducts) {
        products.push({
            category_id: Math.ceil(Math.random() * 3),
            user_id: usersIDs[Math.floor(Math.random() * totalUsers)],
            name: faker.name.title(),
            description: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            old_price: faker.datatype.number(9999),
            price: faker.datatype.number(9999),
            quantity: faker.datatype.number(99),
            status: Math.round(Math.random())
        })
    }

    const productsPromises = products.map(product => Product.create(product))
    productsIDs = await Promise.all(productsPromises)

    let files = []

    while (files.length < 50) {
        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
            product_id: productsIDs[Math.floor(Math.random() * totalProducts)]
        })
    }

    const filesPromises = files.map(file => File.create(file))

    await Promise.all(filesPromises)
}

async function init() {
    await createUsers()
    await createProducts()
}

init()