import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginService } from './service/auth.service';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const user = await loginService(credentials);
          if (!user || user.status === 401 || user.detail) {
            return null;
          }
          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {

        token.user = {
          ...user,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});