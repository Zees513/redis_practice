import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (error) => {
  console.error("Redis Error:", error);
});

if (!redis.isOpen) {
  await redis.connect();
}

export default redis;