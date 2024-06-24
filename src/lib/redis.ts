import { createClient, RedisClientType } from "redis";

export default class Redis {
	private static instance: Redis;
	private client: RedisClientType;

	private constructor() {
		this.client = createClient({
			url: "redis://redis:6379",
		});

		this.client.on("error", (err) => console.log("Redis Client Error", err));
		this.client.connect();
	}

	public static getInstance(): Redis {
		if (!Redis.instance) {
			Redis.instance = new Redis();
		}
		return Redis.instance;
	}

	public getClient(): RedisClientType {
		return this.client;
	}
}
