// https://next-auth.js.org/getting-started/client#sessionprovider
"use client";
import { SessionProvider } from "next-auth/react";

export function Providers({ session, children }: any) {
  // 把上一層用 unstable_getServerSession 拿到的 session 傳給 SessionProvider
  // 並把 session 提供給底下的所有子組件(children)使用
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
