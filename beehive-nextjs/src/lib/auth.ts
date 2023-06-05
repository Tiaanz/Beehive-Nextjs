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
        const GET_USER = `
          query GetOneUser($email: String!) {
            getOneUser(email: $email) {
              id
              first_name
              email
              password
              role
            }
          }
        `

        async function getOneUser() {
          const response = await fetch('http://localhost:4000', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: GET_USER, variables: { email } }),
          })

          const data = await response.json()
          return data
        }
        const user = await getOneUser()

console.log(user);

        if (
          user.data.getOneUser === null ||
          email !== user.data.getOneUser.email ||
         !await bcrypt.compare(password,user.data.getOneUser.password)
        ) {
          
          throw new Error('invalid password or email')
        }

        //if everything is fine
 
        return {
          id: user.data.getOneUser.id,
          name: user.data.getOneUser.first_name,
          email: user.data.getOneUser.email,
          image:"somephotourl"
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
