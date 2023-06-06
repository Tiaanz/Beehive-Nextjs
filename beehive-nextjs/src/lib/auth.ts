import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'

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
          query GetOneReliever($email: String!) {
            getOneReliever(email: $email) {
              id
              first_name
              email
              password
              role
            }
          }
        `
        const GET_MANAGER = `
        query GetOneManager($email: String!) {
          getOneManager(email: $email) {
            id
            first_name
            email
            password
            role
          }
        }
      `

        async function getOneReliever() {
          const response = await fetch('http://localhost:4000', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: GET_RELIEVER, variables: { email } }),
          })

          const data = await response.json()
          return data
        }
        const reliever = await getOneReliever()
 
        

        async function getOneManager() {
          const response = await fetch('http://localhost:4000', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: GET_MANAGER, variables: { email } }),
          })

          const data = await response.json()
          return data
        }
        const manager = await getOneManager()

    

        if (
          reliever.data.getOneReliever === null ||
          email !== reliever.data.getOneReliever.email ||
          !(await bcrypt.compare(
            password,
            reliever.data.getOneReliever.password
          ))
        ) {
          if (
            manager.data.getOneManager === null ||
            email !== manager.data.getOneManager.email ||
            !(await bcrypt.compare(
              password,
              manager.data.getOneManager.password
            ))
          ) {
            throw new Error('invalid password or email')
          }
          return {
            id: manager.data.getOneManager.id,
            name: manager.data.getOneManager.first_name,
            email: manager.data.getOneManager.email,
            image: 'somephotourl',
          }
        }

        //if everything is fine

        return {
          id: reliever.data.getOneReliever.id,
          name: reliever.data.getOneReliever.first_name,
          email: reliever.data.getOneReliever.email,
          image: 'somephotourl',
        }
      },
    }),
  ],
  // callbacks: {
  //   session({ token, session }) {
  //     console.log(token)
  // if (token) {
  //        session.user.id=token.id
  //        session.user.name=token.name
  //        session.user.email=token.email
  //       //  session.user.image=token.picture
  //     }
  //     return session
  //   },
  //   async jwt({token,user}) {
  //     // const dbUser = await db.user.findFirst({
  //     //   where: {
  //     //     email:token.email
  //     //   }
  //     // })
  //     // if (!dbUser) {
  //     //   token.id = user!.id
  //     //   return token
  //     // }
  //     return {
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       // picture:dbUser.image

  //     }
  //   },

  // }
}