import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; 

const users = [
  { id: "1", username: "admin", password: bcrypt.hashSync("password", 10) },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find((u) => u.username === credentials.username);
        if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
          throw new Error("Invalid credentials");  
        }
        return { id: user.id, name: user.username };
      },
    }),
  ],
  session: {
    strategy: "jwt", 
  },
  secret: process.env.NEXTAUTH_SECRET,  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; 
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
