// Create admin user script
// Usage: node create-admin.js

require('dotenv').config()
const payload = require('payload')

async function createAdmin() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    local: true,
  })

  try {
    const admin = await payload.create({
      collection: 'users',
      data: {
        name: 'Admin User',
        email: 'admin@example.com', // Change this to your email
        password: 'admin123', // Change this to your password
        role: 'admin',
        addresses: [],
        cart: [],
        orderHistory: [],
      },
    })

    console.log('Admin user created successfully:', admin)
  } catch (error) {
    console.error('Error creating admin user:', error)
  }

  process.exit(0)
}

createAdmin()
