import dotenv from "dotenv";
dotenv.config();

import { TwitchBot } from "./lib/twitch";
import Mongo from "./lib/mongo";
import { ErrorsQuery } from "./types";

const twitchBot = new TwitchBot();
twitchBot.initialize();
const mongo = Mongo.getInstance();

process.on("uncaughtException", async (err) => {
	const db = await mongo.db;
	db.collection<ErrorsQuery>("errors")
		.insertOne({
			message: err.message,
			name: err.name,
			stack: err.stack,
			createdAt: new Date(),
		})
		.catch(() => {})
		.then(() => console.log(err));
});

process.on("SIGTERM", () => {
	console.log("Received SIGTERM");
	Promise.all([
		// twitch.exit(),
		// dota.exit(),
		mongo.exit(),
	]).then(() => process.exit(0));
});
