import { Db, MongoClient } from "mongodb";

export default class Mongo {
	private static instance: Mongo;

	public db: Promise<Db>;
	private client: Promise<MongoClient>;

	private constructor() {
		this.client = MongoClient.connect(process.env.MONGO_URL as string);
		this.db = this.connect();
	}

	private async connect(): Promise<Db> {
		try {
			const client = await this.client;
			return client.db();
		} catch (error) {
			console.error("Failed to connect to MongoDB, retrying...", error);
			return this.connect();
		}
	}

	public static getInstance(): Mongo {
		if (!Mongo.instance) {
			Mongo.instance = new Mongo();
		}
		return Mongo.instance;
	}

	public async exit(): Promise<boolean> {
		try {
			const client = await this.client;
			await new Promise<void>((resolve) => setTimeout(resolve, 3000));
			await client.close();
			console.log("Manually disconnected from MongoDB");
			return true;
		} catch (error) {
			console.error("Failed to close MongoDB connection", error);
			return false;
		}
	}
}
