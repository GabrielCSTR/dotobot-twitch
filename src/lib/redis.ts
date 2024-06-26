import { createClient, RedisClientType } from "redis";

export default class Redis {
	private static instance: Redis;
	private client: RedisClientType;

	private constructor() {
		const redisUrl = process.env.NODE_ENV === "production" ? `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` : `redis://localhost:${process.env.REDIS_PORT}`;
		this.client = createClient({
			url: redisUrl,
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
