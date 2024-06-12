import { get } from "https";
import * as querystring from "querystring";

interface TwitchAPIOptions {
	path: string;
	qs?: querystring.ParsedUrlQueryInput;
	baseUrl?: string;
}

export default class TwitchAPI {
	private static baseUrl = "https://api.twitch.tv";

	public static async api(options: TwitchAPIOptions): Promise<any> {
		const { path, qs, baseUrl = TwitchAPI.baseUrl } = options;
		const urlPath = `/helix/${path}?${querystring.stringify(qs)}`;

		return new Promise((resolve, reject) => {
			const req = get(
				`${baseUrl}${urlPath}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.TWITCH_AUTH}`,
						"Client-ID": process.env.TWITCH_CLIENT_ID,
					},
				},
				(result) => {
					let data = "";
					result.on("data", (chunk) => {
						data += chunk;
					});
					result.on("end", () => {
						try {
							const parsedData = JSON.parse(data);
							resolve(parsedData);
						} catch (err: any) {
							reject(new Error(`Failed to parse response: ${err.message}`));
						}
					});
				}
			);

			req.on("error", (err) => {
				reject(new Error(`Request error: ${err.message}`));
			});
		});
	}
}
