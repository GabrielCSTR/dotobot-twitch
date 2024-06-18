import Command from "../lib/command";
import Mongo from "../lib/mongo";
import { ChannelsQuery } from "../types";

const mongo = Mongo.getInstance();

export default new Command(
	"join",
	async ({ rawArgs, client, channel, tags }) => {
		const db = await mongo.db;
		client.say(channel, `Joining @${tags.username}`);
		client.join(tags.username as string).catch((err) => {});
		db.collection<ChannelsQuery>("channels").updateOne(
			{ id: Number(tags["user-id"]) },
			{ $set: { name: tags.username } },
			{ upsert: true }
		);
	}
);
