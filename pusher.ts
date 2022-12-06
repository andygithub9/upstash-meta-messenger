import Pusher from "pusher";
import ClientPusher from "pusher-js";

export const serverPusher = new Pusher({
  appId: "1513655",
  key: "9c351fed67a952c5aebb",
  secret: "142d4bc68eefb64a93e5",
  cluster: "ap2",
  useTLS: true,
});

export const clientPusher = new ClientPusher("9c351fed67a952c5aebb", {
  cluster: "ap2",
  forceTLS: true,
});
