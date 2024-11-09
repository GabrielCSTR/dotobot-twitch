import { Hero } from "../types";
import Command from "../lib/command";
import { categoryAliases, metaHeroesType } from "../constants";
import { D2PtScraper } from "d2pt.js";
import RedisManager from "../utils/redis-manager";

const d2pt = new D2PtScraper();
const redisManager = new RedisManager();

function formatPercentage(value?: string): string {
  if (!value) {
    return "0.00%";
  }
  const percentage = (parseFloat(value) * 100).toFixed(2);
  return `${percentage}%`;
}

function isRole(role: string): string | null {
  for (const [key, aliases] of Object.entries(categoryAliases)) {
    if (aliases.includes(role)) {
      return key ?? null;
    }
  }
  return null;
}

export default new Command(
  "meta",
  async ({ rawArgs, client, channel, tags }) => {
    const args = rawArgs.split(" ");
    let response = "";

    const command: metaHeroesType =
      args[0].toLocaleLowerCase() as metaHeroesType;
    if (command.length === 0) {
      response = "Category not found!  ";
      client.say(channel, `@${tags.username}, ${response.slice(0, -2)}`);
      return;
    }
    if (isRole(command)) {
      const category = (categoryAliases[command] || command) as metaHeroesType;
      const getHeroesMetaCache = await redisManager.get(category);
      let heroesMeta: Hero[] = [];
      if (!getHeroesMetaCache) {
        heroesMeta = await d2pt.getHeroesMeta(category, 5);
        if (!heroesMeta) {
          client.say(
            channel,
            `@${
              tags.username
            }, No data found for ${category.toUpperCase()}, please try again later`
          );
          return;
        }
        await redisManager.set(category, JSON.stringify(heroesMeta));
      } else {
        heroesMeta = JSON.parse(getHeroesMetaCache) as Hero[];
      }

      response = ``;
      const metaHeroesTyped: Hero[] = heroesMeta;
      metaHeroesTyped.forEach((hero, index) => {
        response += `⭐ ${index + 1}-${hero.name} - M: ${hero.matches} - AVG: ${
          hero?.winRate
        } | `;
      });
    } else {
      response = "Category not found!  ";
    }

    client.say(channel, `@${tags.username}, ${response.slice(0, -2)}`);
  }
);
