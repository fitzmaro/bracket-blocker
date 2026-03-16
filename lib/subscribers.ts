import { kv } from '@vercel/kv';

const SUBSCRIBERS_KEY = 'bracket-blocker:subscribers';

export type Subscriber = {
  email: string;
  subscribedAt: string;
};

export async function addSubscriber(email: string): Promise<{ success: boolean; alreadyExists?: boolean }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if already subscribed
  const exists = await kv.sismember(SUBSCRIBERS_KEY, normalizedEmail);
  if (exists) {
    return { success: true, alreadyExists: true };
  }

  // Add to set
  await kv.sadd(SUBSCRIBERS_KEY, normalizedEmail);

  // Store metadata
  await kv.hset(`bracket-blocker:subscriber:${normalizedEmail}`, {
    email: normalizedEmail,
    subscribedAt: new Date().toISOString(),
  });

  return { success: true, alreadyExists: false };
}

export async function removeSubscriber(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();

  await kv.srem(SUBSCRIBERS_KEY, normalizedEmail);
  await kv.del(`bracket-blocker:subscriber:${normalizedEmail}`);

  return true;
}

export async function getAllSubscribers(): Promise<string[]> {
  const subscribers = await kv.smembers(SUBSCRIBERS_KEY);
  return subscribers as string[];
}

export async function getSubscriberCount(): Promise<number> {
  const count = await kv.scard(SUBSCRIBERS_KEY);
  return count;
}

export async function isSubscribed(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  const exists = await kv.sismember(SUBSCRIBERS_KEY, normalizedEmail);
  return Boolean(exists);
}
