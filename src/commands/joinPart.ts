import { ChatUserstate } from "tmi.js";
import Mongo from "../lib/mongo";
import TwitchBot from "../lib/twitch";
import { ChannelsQuery } from "../types";

const mongo = Mongo.getInstance();

export async function joinCommand(twitchBot: TwitchBot, tags: ChatUserstate) {
	const db = await mongo.db;
	twitchBot.join(tags.username as string).catch((err) => {});
	db.collection<ChannelsQuery>("channels").updateOne(
		{ id: Number(tags["user-id"]) },
		{ $set: { name: tags.username } },
		{ upsert: true }
	);
	return `Joining ${tags.username}`;
}

export async function partCommand(twitchBot: TwitchBot, tags: ChatUserstate) {
	const db = await mongo.db;
	twitchBot.part(tags.username as string).catch((err) => {});
	db.collection<ChannelsQuery>("channels").deleteOne({
		id: Number(tags["user-id"]),
	});
	return `Leaving ${tags.username}`;
}
