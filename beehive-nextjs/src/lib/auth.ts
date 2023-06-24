import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
config()


const SERVER = 'http://localhost:4000'
//'https://beehive-graphql-api.onrender.com/'
//'http://localhost:4000'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        //perform authentication logic
        //find out user from db
        const GET_RELIEVER = `
          query GetRelieverByEmail($email: String!) {
            getRelieverByEmail(email: $email) {
              id
              first_name
              email
              password
              role
              token
            }
          }
        `
        const GET_MANAGER = `
        query GetManagerByEmail($email: String!) {
          getManagerByEmail(email: $email) {
            id
            first_name
            email
            password
            role
            token
          }
        }
      `

        async function getRelieverByEmail() {
          const response = await fetch(SERVER, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: GET_RELIEVER, variables: { email } }),
          })

          const data = await response.json()
          return data
        }
        const reliever = await getRelieverByEmail()

        async function getManagerByEmail() {
          const response = await fetch(SERVER, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: GET_MANAGER, variables: { email } }),
          })

          const data = await response.json()
          return data
        }
        const manager = await getManagerByEmail()

        //if the user log in as a manager
        if (
          reliever.data.getRelieverByEmail === null ||
          email !== reliever.data.getRelieverByEmail.email ||
          !(await bcrypt.compare(
            password,
            reliever.data.getRelieverByEmail.password
          ))
        ) {
          if (
            manager.data.getManagerByEmail === null ||
            email !== manager.data.getManagerByEmail.email ||
            !(await bcrypt.compare(
              password,
              manager.data.getManagerByEmail.password
            ))
          ) {
            throw new Error('invalid password or email')
          }
          return {
            id: manager.data.getManagerByEmail.id,
            name: manager.data.getManagerByEmail.first_name,
            email: manager.data.getManagerByEmail.email,
            role: manager.data.getManagerByEmail.role,
            token:manager.data.getManagerByEmail.token
          }
        }

        //if the user log in as a reliever
        return {
          id: reliever.data.getRelieverByEmail.id,
          name: reliever.data.getRelieverByEmail.first_name,
          email: reliever.data.getRelieverByEmail.email,
          role: reliever.data.getRelieverByEmail.role,
          token:reliever.data.getRelieverByEmail.token
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user}) {

      return { ...token, ...user }
    },
    async session({ session, token, user }) {
      session.user = token
      
      return session
    },
  },
}
