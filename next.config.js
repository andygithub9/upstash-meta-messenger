/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "links.papareact.com",
      "platform-lookaside.fbsbx.com",
      "scontent.ftpe8-2.fna.fbcdn.net",
    ],
  },
  experimental: {
    appDir: true,
  },
};
