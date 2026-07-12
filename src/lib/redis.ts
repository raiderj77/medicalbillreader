export class StoreUnavailableError extends Error { constructor() { super("Security store unavailable"); } }
export async function redisCommand<T>(command: Array<string | number>): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new StoreUnavailableError();
  const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(command), cache: "no-store" });
  if (!response.ok) throw new StoreUnavailableError();
  const payload = (await response.json()) as { result?: T; error?: string };
  if (payload.error || payload.result === undefined) throw new StoreUnavailableError();
  return payload.result;
}
