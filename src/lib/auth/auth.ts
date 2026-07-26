import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import type { RoleName, IslandName } from '@prisma/client';

export interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  islandId: string | null;
  island: IslandName | null;
}

declare module 'next-auth' {
  interface User extends ExtendedUser {}
  interface Session { user: ExtendedUser }
}

declare module '@auth/core/jwt' {
  interface JWT extends ExtendedUser {}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { role: true, island: true },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password as string, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name as RoleName,
          islandId: user.islandId,
          island: (user.island?.name as IslandName) || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
        token.role = user.role;
        token.islandId = user.islandId;
        token.island = user.island;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any) = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as RoleName,
        islandId: token.islandId as string | null,
        island: token.island as IslandName | null,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
});
