import { NextAuthOptions } from 'next-auth'
// import { db } from './db'
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        //perform authentication logic
        //find out user from db
        if (email !== 'tian@test.com' || password !== '123') {
          throw new Error('invalid password or email')
        }
        //if everything is fine
        return { id: '1234', name: 'Tian', email: 'tian@test.com' }
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
