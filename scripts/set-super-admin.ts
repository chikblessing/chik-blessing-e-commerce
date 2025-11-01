import { getPayload } from 'payload'
import config from '../src/payload.config'

async function setSuperAdmin() {
  try {
    const payload = await getPayload({ config })

    const email = 'chikblessingglobal@gmail.com'

    console.log(`Looking for user: ${email}`)

    // Find the user
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (users.docs.length === 0) {
      console.error(`❌ User not found: ${email}`)
      process.exit(1)
    }

    const user = users.docs[0]
    console.log(`✅ Found user: ${user.name} (${user.email})`)
    console.log(`Current role: ${user.role}`)

    if (user.role === 'super_admin') {
      console.log('✅ User is already a super admin!')
      process.exit(0)
    }

    // Update to super admin
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        role: 'super_admin',
      },
    })

    console.log(`✅ Successfully updated ${email} to super_admin!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

setSuperAdmin()
