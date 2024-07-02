import Mongo from "./lib/mongo";
import { ErrorsQuery } from "./types";
import TwitchBot from "./lib/twitch";
import updateHeroesMetaWithDelay from "./utils/updateMeta";

const mongo = Mongo.getInstance();
const twitchBot = TwitchBot.getInstance();
twitchBot.initialize();

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

// Update Hero meta every 12 hours
const interval = 12 * 60 * 60 * 1000;
const delay = 5 * 60 * 1000; // Start delay (exemplo: 5 minutos)

setInterval(updateHeroesMetaWithDelay, interval);
setTimeout(updateHeroesMetaWithDelay, delay);
