// https://next-auth.js.org/getting-started/example#backend---api-route
// https://next-auth.js.org/configuration/nextjs#in-app-directory
// 如果使用 next.js 13 不用把 unstable_getServerSession 放在 pages/api/ 底下
// 可以放在 app/ directory 底下的 server components
// 因為我們想要全局使用 unstable_getServerSession 提供的 session 所以我們可以放在 app/layout.tsx
import { unstable_getServerSession } from "next-auth";
import { Message } from "../typings";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { Providers } from "./providers";

async function HomePage() {
  // 因為我們在 server side 所以不能使用相對 URL , 要用絕對 URL ， 例如： http://localhost:3000/api/getMessage
  // 在 client side 才可以用相對 URL ， 例如： /api/getMessage
  // 先從 server side component 拿到 data 再傳遞給 client side component
  const data = await fetch(
    `${process.env.VERCEL_URL || "http://localhost:3000"}/api/getMessages`
  ).then((res) => res.json());
  const messages: Message[] = data.messages;
  const session = await unstable_getServerSession();

  return (
    // 把 unstable_getServerSession 拿到的 session 傳進 providers component 的 SessionProvider
    // 如果把 Providers 組件，放到 layout 去 wrap 整個 app 可能會出現此錯誤: Uncaught Error: This Suspense boundary received an update before it finished hydrating.
    // 因為 loading.tsx 有用到 react 的 React Suspense Component
    // 但我放在 layout.tsx 並沒有出現此錯誤，待觀察
    <Providers session={session}>
      <main>
        {/* 把 server side component 拿到的 data 傳遞給 client side component */}
        <MessageList initialMessages={messages} />
        <ChatInput session={session} />
      </main>
    </Providers>
  );
}

export default HomePage;
