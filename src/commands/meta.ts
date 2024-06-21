import Command from "../lib/command";
import Mongo from "../lib/mongo";
import { MetaHeroes } from "../types";
import metaHeroes from "../../heroes_data.json";
import { categoryAliases } from "@/constants";

const metaHeroesTyped: MetaHeroes = metaHeroes;

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

		const command = args[0].toLocaleLowerCase();

		const categories = Object.keys(metaHeroesTyped) as (keyof MetaHeroes)[];

		let response = "";

		if (
			categories.includes(command as keyof MetaHeroes) ||
			Object.keys(categoryAliases).includes(command)
		) {
			const category = (categoryAliases[command] ||
				command) as keyof MetaHeroes;
			response = ``;
			metaHeroesTyped[category].forEach((hero, index) => {
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
