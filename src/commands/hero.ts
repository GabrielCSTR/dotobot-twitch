import { HeroNames } from "@/types";
import Command from "../lib/command";
import { D2PtScraper } from "d2pt.js";

const d2pt = new D2PtScraper();

function formatPercentage(value?: string): string {
	if (!value) {
		return "0.00%";
	}
	const percentage = (parseFloat(value) * 100).toFixed(2);
	return `${percentage}%`;
}

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
		if (isHeroName(heroName)) {
			const heroInfoData = await d2pt.getHeroInfo(heroName);
			const heroinfo = heroInfoData
				?.filter((hero) => hero.role?.includes("Most Played"))
				.map((hero) => ({
					role: hero.role,
					matches: hero.matches,
					winRate: hero.winRate,
				}))[0];
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
