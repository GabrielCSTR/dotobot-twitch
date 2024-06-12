import { Client } from "tmi.js";
import TwitchAPI from "../utils/twitchApi";
import Mongo from "./mongo";

export class TwitchBot {
	private client: Client;

	constructor(client: any) {
		this.client = new Client({
			options: { debug: false, joinInterval: 300 },
			logger: {
				error: (msg: string) => {},
				info: (msg: string) => {},
				warn: (msg: string) => {},
			},
			connection: {
				reconnect: true,
				secure: true,
			},
			identity: {
				username: "bot-name",
				password: process.env.TWITCH_AUTH,
			},
		});
	}

	public async initialize(): Promise<void> {
		try {
			const options = {
				path: "streams",
				qs: { game_id: 29595, first: 100 },
			};

			const [channelsQuery, streamIds] = await Promise.all([
				this.getChannelsQuery(),
				this.getStreamIds(options),
			]);

			console.log("STREAMIDS", streamIds);
			console.log("CHANNELQUERY", channelsQuery);

			const liveStreamsToJoin = this.getLiveStreamsToJoin(
				channelsQuery,
				streamIds
			);
			const channels = this.getChannels(liveStreamsToJoin, channelsQuery);

			channels.unshift("9kmmrbot");
			console.log("CHANNELS CONNECTED", channels);

			this.client.getOptions().channels = channels;
			this.client.connect();

			this.setupMessageListener();
		} catch (error) {
			console.error("Error initializing TwitchBot:", error);
		}
	}

	private async getChannelsQuery(): Promise<any[]> {
		const db = await Mongo.getInstance().db;
		return db
			.collection("channels")
			.find({ name: { $exists: true } })
			.sort({ count: -1 })
			.toArray();
	}

	private async getStreamIds(options: {
		path: string;
		qs: any;
	}): Promise<number[]> {
		const { data: streams } = await TwitchAPI.api(options);
		return (
			streams?.map((stream: { user_id: string }) => Number(stream.user_id)) ||
			[]
		);
	}

	private getLiveStreamsToJoin(
		channelsQuery: any[],
		streamIds: number[]
	): string[] {
		return channelsQuery
			.filter((channel) => streamIds.includes(channel.id))
			.map((channel) => channel.name);
	}

	private getChannels(
		liveStreamsToJoin: string[],
		channelsQuery: any[]
	): string[] {
		const channelsSet = new Set<string>(liveStreamsToJoin);
		channelsQuery.forEach((channel) => channelsSet.add(channel.name));
		return Array.from(channelsSet.values());
	}

	private setupMessageListener(): void {
		this.client.on(
			"message",
			(channel: string, userstate: any, message: string, self: boolean) => {
				if (self) return; // Ignore messages from the bot itself

				console.log(
					`Received message from ${userstate.username} in ${channel}: ${message}`
				);

				// Aqui você pode adicionar lógica adicional para lidar com as mensagens recebidas
			}
		);
	}
}
