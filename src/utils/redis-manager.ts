import { RedisClientType } from "redis";
import RedisClient from "../lib/redis";

export default class RedisManager {
	private clientRedis: RedisClientType;

	constructor() {
		this.clientRedis = RedisClient.getInstance().getClient();
	}
	public async get(key: string): Promise<string | null> {
		const value = await this.clientRedis.get(key);
		return value;
	}

	public async set(key: string, value: string) {
    // expire key 12hrs
		await this.clientRedis.set(key, value, { EX: 43200 });
	}
}
