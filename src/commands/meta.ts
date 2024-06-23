import { Hero, MetaHeroes } from "@/types";
import Command from "../lib/command";
import Mongo from "../lib/mongo";
import { categoryAliases, metaHeroesType } from "@/constants";
import { D2PtScraper } from "d2pt.js";

const d2pt = new D2PtScraper();

function formatPercentage(value?: string): string {
	if (!value) {
		return "0.00%";
	}
	const percentage = (parseFloat(value) * 100).toFixed(2);
	return `${percentage}%`;
}

export default new Command(
	"meta",
	async ({ rawArgs, client, channel, tags }) => {
		const args = rawArgs.split(" ");

		const command: metaHeroesType =
			args[0].toLocaleLowerCase() as metaHeroesType;

		let response = "";

		if (
			Object.keys(categoryAliases).includes(command)
		) {
			const category = (categoryAliases[command] || command) as metaHeroesType;
			const heroesMeta = await d2pt.getHeroesMeta(category);
			response = ``;
      const metaHeroesTyped: Hero[] = heroesMeta;
			metaHeroesTyped.forEach((hero, index) => {
				response += `⭐ ${index + 1}-${hero.name} - M: ${
					hero.matches
				} - AVG: ${formatPercentage(hero?.winRate ?? "0.0")} | `;
			});
		} else {
			response = "Category not found!";
		}

		client.say(channel, `@${tags.username}, ${response.slice(0, -2)}`);
	}
);
