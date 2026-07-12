import { redisCommand } from "./redis";
import { opaqueHash } from "./security";
const RATE_SCRIPT = `local count=redis.call('INCR',KEYS[1]) if count==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end if count>tonumber(ARGV[2]) then return 0 end return 1`;
export async function enforceRateLimit(scope: string, identifier: string, limit: number, seconds: number): Promise<boolean> { const key = `mbr:rate:${scope}:${opaqueHash(identifier)}`; return (await redisCommand<number>(["EVAL", RATE_SCRIPT, 1, key, seconds, limit])) === 1; }
