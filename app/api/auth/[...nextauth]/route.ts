import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            active: true
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
    async redirect({ url, baseUrl }: any) {
      // Se já está na URL base ou em uma sub-rota válida, permite
      if (url.startsWith(baseUrl)) {
        return url
      }
      // Se é uma URL relativa, anexa à base
      if (url.startsWith('/')) {
        return baseUrl + url
      }
      // Por padrão, redireciona para o dashboard
      return baseUrl + '/admin/dashboard'
    }
  },
  pages: {
    signIn: '/admin/login'
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }