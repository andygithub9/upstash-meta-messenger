import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
// https://next-auth.js.org/getting-started/example#backend---api-route

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  // https://next-auth.js.org/configuration/options#secret
  // secret: A random string is used to hash tokens
  // Not providing any secret or NEXTAUTH_SECRET will throw an error in production.
  // secret 的值是拿來加密 token 的字符串
  // 如果沒有 secret 這個 key value 在生產環境會報錯
  // 可以用 https://generate-secret.vercel.app/32 這個網址亂數產生一個長度 32 的字串作為 secret 的值
  secret: process.env.NEXTAUTH_SECRET!,
  // custom login page
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
