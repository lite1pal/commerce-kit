import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

let client: ReturnType<typeof createClient> | null = null;

export function getRedisClient() {
  if (!client) {
    client = createClient({ url: redisUrl });

    client.on("error", (err) => {
      console.error("[redis] error:", err.message);
    });

    // Connect and just catch errors to prevent unhandled promise rejection
    client.connect().catch((err) => {
      console.error("[redis] connect failed:", err.message);
    });
  }
  return client;
}

export async function rateLimit({
  key,
  window = 60,
  max = 10,
}: {
  key: string;
  window?: number; // seconds
  max?: number;
}): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  try {
    const redis = getRedisClient();
    const now = Math.floor(Date.now() / 1000);
    const field = `${key}:${Math.floor(now / window)}`;
    const count = await redis.incr(field);
    if (count === 1) {
      await redis.expire(field, window);
    }
    const ttl = await redis.ttl(field);
    return {
      allowed: count <= max,
      remaining: Math.max(0, max - count),
      reset: ttl,
    };
  } catch (err: any) {
    console.error("[rateLimit] Redis error:", err.message);
    // fail open: allow request if Redis fails
    return { allowed: true, remaining: max, reset: window };
  }
}
