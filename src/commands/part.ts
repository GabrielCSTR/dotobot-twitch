import Command from "../lib/command";
import Mongo from "../lib/mongo";
import { ChannelsQuery } from "../types";

const mongo = Mongo.getInstance();

export default new Command(
	"part",
	async ({ rawArgs, client, channel, tags }) => {
		const db = await mongo.db;
		client.say(channel, `Leaving @${tags.username}`);
		client.part(tags.username as string).catch((err) => {});
		db.collection<ChannelsQuery>("channels").deleteOne({
			id: Number(tags["user-id"]),
		});
	}
);
