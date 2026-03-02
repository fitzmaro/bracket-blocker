/**
 * Subscriber storage
 *
 * For local dev: uses a JSON file
 * For production: swap to Vercel KV with:
 *   import { kv } from '@vercel/kv';
 */

import { promises as fs } from 'fs';
import path from 'path';

export type Subscriber = {
  email: string;
  conferences: string[];
  subscribedAt: string;
};

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

/**
 * Ensure data directory and file exist
 */
async function ensureFile() {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  try {
    await fs.access(SUBSCRIBERS_FILE);
  } catch {
    await fs.writeFile(SUBSCRIBERS_FILE, '[]');
  }
}

/**
 * Get all subscribers
 */
export async function getSubscribers(): Promise<Subscriber[]> {
  await ensureFile();
  const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
  return JSON.parse(data);
}

/**
 * Add a subscriber
 */
export async function addSubscriber(email: string, conferences: string[] = []): Promise<{ success: boolean; isNew: boolean }> {
  await ensureFile();

  const subscribers = await getSubscribers();
  const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    // Update conferences if provided
    if (conferences.length > 0) {
      existing.conferences = [...new Set([...existing.conferences, ...conferences])];
      await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    }
    return { success: true, isNew: false };
  }

  subscribers.push({
    email: email.toLowerCase(),
    conferences,
    subscribedAt: new Date().toISOString(),
  });

  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
  return { success: true, isNew: true };
}

/**
 * Remove a subscriber
 */
export async function removeSubscriber(email: string): Promise<boolean> {
  await ensureFile();

  const subscribers = await getSubscribers();
  const filtered = subscribers.filter(s => s.email.toLowerCase() !== email.toLowerCase());

  if (filtered.length === subscribers.length) {
    return false; // Not found
  }

  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

/**
 * Get subscriber count
 */
export async function getSubscriberCount(): Promise<number> {
  const subscribers = await getSubscribers();
  return subscribers.length;
}
