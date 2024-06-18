import { Client } from "tmi.js";
import TwitchAPI from "../utils/twitchApi";
import Mongo from "./mongo";
import { joinCommand, partCommand } from "../commands/joinPart";

export default class TwitchBot {
	private static instance: TwitchBot;

	private client: Client;

	constructor() {
		this.client = new Client({
			options: { debug: false, joinInterval: 300 },
			connection: {
				reconnect: true,
				secure: true,
			},
			identity: {
				username: "dotobot_",
				password: process.env.TWITCH_AUTH,
			},
		});

		this.initialize();
		this.setupMessageListener();
	}

	public async initialize(): Promise<void> {
		try {
			const [channelsQuery] = await Promise.all([this.getChannelsQuery()]);

			const channels = this.getChannels(channelsQuery);

			channelsQuery.unshift("dotobot_");
			console.log("CHANNELS CONNECTED", channels);

			this.client.getOptions().channels = channels;
			this.client.connect();
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

	private getChannels(channelsQuery: any[]): string[] {
		const channelsSet = new Set<string>();
		channelsQuery.forEach((channel) => channelsSet.add(channel.name));
		return Array.from(channelsSet.values());
	}

	private setupMessageListener(): void {
		this.client.on(
			"message",
			async (
				channel: string,
				userstate: any,
				message: string,
				self: boolean
			) => {
				if (self) return;
				const args = message.slice(1).split(" ");
				const commandName = args.shift()?.toLowerCase();
				console.log(
					`Received message from ${userstate.username} in ${channel}: ${message}`
				);

				if (message.startsWith("!join")) {
					const joinChannel = await joinCommand(this, userstate);
					this.sendMessage(channel, joinChannel);
				}

				if (message.startsWith("!part")) {
					const partChannel = await partCommand(this, userstate);
					this.sendMessage(channel, partChannel);
				}
			}
		);
	}

	public static getInstance(): TwitchBot {
		if (!TwitchBot.instance) {
			TwitchBot.instance = new TwitchBot();
		}
		return TwitchBot.instance;
	}

	public join(channel: string) {
		return this.client.join(channel);
	}

	public part(channel: string) {
		return this.client.part(channel);
	}

	public sendMessage(channel: string, message: string) {
		this.client.say(channel, message).catch((error) => {
			console.error("Erro ao enviar mensagem:", error);
		});
	}

	public exit(): Promise<boolean> {
		return new Promise((resolve) => {
			this.client
				.disconnect()
				.then(() => console.log("Manually disconnected from twitch"))
				.then(() => {
					this.client.removeAllListeners();
					console.log("Removed all listeners from twitch");
					resolve(true);
				});
		});
	}
}
