import dotenv from "dotenv";
dotenv.config();

import Mongo from "./lib/mongo";
import { ErrorsQuery } from "./types";
import TwitchBot from "./lib/twitch";

const mongo = Mongo.getInstance();
const twitchBot = TwitchBot.getInstance();

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
	Promise.all([twitchBot.exit(), mongo.exit()]).then(() => process.exit(0));
});
