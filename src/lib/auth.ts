import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import { getPayload } from 'payload'
import config from '@/payload.config'

const client = new MongoClient(process.env.DATABASE_URI!)
const clientPromise = Promise.resolve(client)

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const payload = await getPayload({ config })

          // Authenticate with Payload
          const result = await payload.login({
            collection: 'users',
            data: {
              email: credentials.email,
              password: credentials.password,
            },
          })

          if (result.user) {
            // Check if account is suspended
            if (result.user.suspended) {
              throw new Error('Account suspended. Please contact support.')
            }

            return {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              role: result.user.role,
            }
          }

          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const payload = await getPayload({ config })

          // Check if user exists in Payload
          const existingUsers = await payload.find({
            collection: 'users',
            where: {
              email: {
                equals: user.email,
              },
            },
          })

          if (existingUsers.docs.length === 0) {
            // Type assertion for Google profile
            const googleProfile = profile as any

            // Create new user in Payload
            await payload.create({
              collection: 'users',
              data: {
                email: user.email!,
                name: user.name || profile?.name || 'Google User',
                firstName: googleProfile?.given_name || '',
                lastName: googleProfile?.family_name || '',
                role: 'customer',
                _verified: true, // Google users are pre-verified
                // Don't set password for OAuth users
              },
            })
          } else {
            // Check if existing user is suspended
            const existingUser = existingUsers.docs[0]
            if (existingUser.suspended) {
              console.log('Suspended user attempted to sign in:', user.email)
              return false
            }
          }

          return true
        } catch (error) {
          console.error('Error creating user in Payload:', error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
      }

      if (account?.provider === 'google') {
        // For Google OAuth users, fetch role from Payload
        try {
          const payload = await getPayload({ config })
          const payloadUser = await payload.find({
            collection: 'users',
            where: {
              email: {
                equals: token.email!,
              },
            },
          })

          if (payloadUser.docs.length > 0) {
            token.role = payloadUser.docs[0].role
            token.payloadId = payloadUser.docs[0].id
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.payloadId = token.payloadId as string
      }

      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
}
