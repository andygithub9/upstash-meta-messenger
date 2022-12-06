"use client";

import { FormEvent, useState } from "react";
import { v4 as uuid } from "uuid";
import { Message } from "../typings";
import useSWR from "swr";
import fetcher from "../utils/fetchMessages";
import { unstable_getServerSession } from "next-auth";

type Props = {
  session: Awaited<ReturnType<typeof unstable_getServerSession>>;
};

function ChatInput({ session }: Props) {
  const [input, setInput] = useState("");

  // useSWR 語法: useSWR(自定義的 key , fetcher)
  // useSWR(一個自定義的 string 作為 key 要用 abc 也可以, fetcher)
  // 從 useSWR("/api/getMessages", fetcher) 解構出來的 mutate 會綁定 "/api/getMessages" 這個 key
  const { data: messages, error, mutate } = useSWR("/api/getMessages", fetcher);

  // console.log("ChatInput.tsx messages", messages);

  const addMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input || !session) return;

    // copy 一份 input 的值
    const messageToSend = input;
    //然後把 input 清空
    setInput("");

    const id = uuid();

    const message: Message = {
      id,
      message: messageToSend,
      created_at: Date.now(),
      username: session.user?.name!,
      profilePic: session?.user?.image!,
      email: session?.user?.email!,
    };

    const uploadMessageToUpstash = async () => {
      const data = await fetch("/api/addMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }).then((res) => res.json());

      return [data.message, ...messages!];
    };

    // https://swr.vercel.app/docs/mutation#mutate-based-on-current-data
    // mutate 是從 useSWR 解構出來的，用來更新快取， mutate 會執行 function 參數， mutate 的返回值會更新這個 swr 的 key 的值
    // 從 useSWR("/api/getMessages", fetcher) 解構出來的 mutate 會綁定 "/api/getMessages" 這個 key , 所以 uploadMessageToUpstash 的返回值會更新 "/api/getMessages" 這個 key 的值
    await mutate(uploadMessageToUpstash, {
      // https://swr.vercel.app/docs/mutation#optimistic-updates
      // optimisticData 樂觀更新
      // 大部分(樂觀)的情況下，從本地推送到遠端的數據在連線正常的時候會成功。
      // 可以使用 mutate，先更新本地數據，讓 user 感覺畫面已經更新，之後在背景發送請求再驗證回應。
      // rollbackOnError：fetch error 的時候要不要 rollback
      optimisticData: [message, ...messages!],
      rollbackOnError: true,
    });
  };

  return (
    <form
      onSubmit={addMessage}
      className="fixed bottom-0 z-50 w-full flex px-10 py-5 space-x-2 border-t border-gray-100 bg-white"
    >
      <input
        type="text"
        value={input}
        disabled={!session}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter message here..."
        className="flex-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={!input}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;
