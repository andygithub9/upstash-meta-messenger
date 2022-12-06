// https://next-auth.js.org/configuration/nextjs#basic-usage
export { default } from "next-auth/middleware";

// Secure the matching routes...
// If you only want to secure certain pages, export a config object with a matcher
// 我想要保護首頁所以會是 matcher: ["/"]
// 試圖訪問首頁的人我們會把它導向到 /auth/signin 因為我們在 pages/api/auth/[...nextauth].ts 有設定我們的登入頁
// pages: {
//   signIn: "/auth/signin",
// },
export const config = { matcher: ["/"] };
