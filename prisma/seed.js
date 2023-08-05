const prisma = require('./client')
const bcrypt = require('bcrypt')

async function seedAdmin() {
  let hashed = await bcrypt.hash("password", 10)
  let user = {
    name: "admin",
    email: "admin@gmail.com",
    password: hashed,
    isAdmin: true
  }
  let Department = {
    name:"General",
    code:"202",
    state:"Open"
  }
  await prisma.Department.create({ data: { ...Department } })
  await prisma.user.create({ data: { ...user } })

}

seedAdmin()
