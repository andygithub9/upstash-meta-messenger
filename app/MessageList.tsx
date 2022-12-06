"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { clientPusher } from "../pusher";
import { Message } from "../typings";
import fetcher from "../utils/fetchMessages";
import MessageComponent from "./MessageComponent";

type Props = {
  initialMessages: Message[];
};

function MessageList({ initialMessages }: Props) {
  const {
    data: messages,
    error,
    mutate,
  } = useSWR<Message[]>("/api/getMessages", fetcher);

  useEffect(() => {
    // 訂閱 messages 頻道
    // https://github.com/pusher/pusher-js#subscribing-to-channels
    const channel = clientPusher.subscribe("messages");

    // 綁定訂閱頻道的事件
    // https://github.com/pusher/pusher-js#binding-to-events
    channel.bind("new-message", async (data: Message) => {
      // 如果自己是發送訊息的人就直接 return 不需要 mutate 更新快取，因為在 ChatInput.tsx sumbit 新訊息的時候就已經 mutate 更新快取了，如果這裡再 mutate 更新一次快取會造成重複更新快取，並看到重複的訊息
      if (messages?.find((message) => message.id === data.id)) return;

      console.log("-- New Message from Pusher: ", data.message, "--");

      // 如果自己是收到訊息的人需要在綁定訂閱頻道的事件收到新訊息的時候 mutate 更新快取
      if (!messages) {
        // 如果 messages 是 undefined 執行下面語句
        mutate(fetcher);
      } else {
        // 如果 messages 不是 undefined 才執行下面語句
        // 否則 [...messages] 相當於解構 undefined 會報錯
        mutate(fetcher, {
          optimisticData: [data, ...messages!],
          rollbackOnError: true,
        });
      }
    });

    // 每次連線完應該要清除連線否則會一直佔用資源
    return () => {
      // 解除綁定事件
      // https://github.com/pusher/pusher-js#bind-and-unbind
      channel.unbind_all();

      // 取消訂閱頻道
      // https://github.com/pusher/pusher-js#unsubscribing-from-channels
      channel.unsubscribe();
    };
  }, [messages, mutate, clientPusher]);

  // 用來驗證 server side 是不是真的比 client side 快
  // console.log('from server side: ',initialMessages)
  // console.log("from client side: ", messages);

  return (
    <div className="space-y-5 px-5 pt-8 pb-32 max-w-2xl xl:max-w-4xl mx-auto">
      {/* 
        messages 是從這個 client component 調用 useSWR fetch 回來的資料
        initialMessages 是從上一層 /app/page.tsx server component 拿到的資料
        如果客戶端還沒 fetch 資料回來就先用 page.tsx 從 server side 傳遞下來的資料，會使網頁看起來更快
      */}
      {(messages || initialMessages).map((message) => (
        <MessageComponent key={message.id} message={message} />
      ))}
    </div>
  );
}

export default MessageList;
