import { serverPusher } from "./../../pusher";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../redis";
import { Message } from "../../typings";

type Data = {
  message: Message;
};

type ErrorData = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }

  const { message } = req.body;

  const newMessage = {
    ...message, // 複製一份 message 的鍵值對
    created_at: Date.now(), // 原來客戶端傳來的 message 對象的 created_at key 是客戶端的時間戳，這邊替換成伺服器上的時間戳
  };

  // push message 到 upstash
  // redis.hset 方法: redis.hset(hash table name, key, vulue): push to upstash redis db 的 messages hash table, key 是 message.id, 值是 JSON.stringify(newMessage)
  await redis.hset("messages", message.id, JSON.stringify(newMessage));

  // 發布事件
  // https://github.com/pusher/pusher-http-node#publishing-events
  // 成功將 message push 到 upstash 之後應該要發布事件告訴訂閱者你推送了一則消息
  // Pusher.trigger(channel: string | string[], event: string, data: any): Promise<Response>
  serverPusher.trigger("messages", "new-message", newMessage); // 發布頻道: "messages", 發布事件: "new-message", 發送數據: newMessage

  res.status(200).json({ message: newMessage });
}
