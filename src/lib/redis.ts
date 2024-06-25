import { createClient, RedisClientType } from "redis";
import env from "../env";

export default class Redis {
	private static instance: Redis;
	private client: RedisClientType;

	private constructor() {
		const url =
			env.NODE_ENV !== "production"
				? "redis://localhost:6379"
				: "redis://redis:6379";
		this.client = createClient({
			url,
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
