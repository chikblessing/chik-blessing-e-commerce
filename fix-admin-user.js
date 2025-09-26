// Run this script to fix your admin user
// Usage: node fix-admin-user.js

const { MongoClient } = require('mongodb')

async function fixAdminUser() {
  const client = new MongoClient(
    process.env.DATABASE_URI || 'mongodb://localhost:27017/your-db-name',
  )

  try {
    await client.connect()
    const db = client.db()
    const users = db.collection('users')

    // Find admin user (adjust the query if needed)
    const adminUser = await users.findOne({ role: 'admin' })

    if (!adminUser) {
      console.log('No admin user found')
      return
    }

    console.log('Current admin user:', adminUser)

    // Update admin user with required fields
    const updateResult = await users.updateOne(
      { _id: adminUser._id },
      {
        $set: {
          name: adminUser.name || 'Admin User', // Add name if missing
          role: 'admin',
          addresses: adminUser.addresses || [],
          cart: adminUser.cart || [],
          orderHistory: adminUser.orderHistory || [],
          updatedAt: new Date(),
        },
      },
    )

    console.log('Update result:', updateResult)
    console.log('Admin user has been updated successfully!')
  } catch (error) {
    console.error('Error fixing admin user:', error)
  } finally {
    await client.close()
  }
}

fixAdminUser()
