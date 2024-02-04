import { Redis } from "ioredis";

const redisClient = new Redis();

redisClient.on("connect", () => {
  console.log("Redis bağlantısı başarılı");
});
redisClient.on("error", () => {
  console.error("Redis bağlantısı başarısız oldu.");
});

export default redisClient;
