import { HeroNames } from "../types";
import Command from "../lib/command";
import { D2PtScraper } from "d2pt.js";
import RedisManager from "../utils/redis-manager";

const d2pt = new D2PtScraper();
const redisManager = new RedisManager();

function isHeroName(name: string) {
	return Object.values(HeroNames)
		.map((hero) => hero.toLowerCase())
		.includes(name as HeroNames);
}

export default new Command(
	"hero",
	async ({ rawArgs, client, channel, tags }) => {
		const args = rawArgs.split(" ");
		const heroName: HeroNames = args[0].toLocaleLowerCase() as HeroNames;
		let response = "";
		let heroinfo = null;

		if (isHeroName(heroName)) {
			const getHeroInfoCache = await redisManager.get(heroName);

			if (!getHeroInfoCache) {
				const heroInfoData = await d2pt.getHeroInfo(heroName);
				heroinfo = heroInfoData
					?.filter((hero) => hero.role?.includes("Most Played"))
					.map((hero) => ({
						role: hero.role,
						matches: hero.matches,
						winRate: hero.winRate,
					}))[0];
				if (!heroinfo) {
					client.say(
						channel,
						`@${
							tags.username
						}, No data found for ${heroName.toUpperCase()}, please try again later`
					);
					return;
				}
				await redisManager.set(heroName, JSON.stringify(heroinfo));
			} else {
				heroinfo = JSON.parse(getHeroInfoCache);
			}

			response = ``;
			response += `⭐ ${heroName.toUpperCase()} - ${
				heroinfo?.role
			} | Win Rate: ${heroinfo?.winRate} | Matches: ${heroinfo?.matches}`;
		} else {
			response = "Hero name not found!";
		}

		client.say(channel, `@${tags.username}, ${response}`);
	}
);
