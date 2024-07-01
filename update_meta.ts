import { metaHeroesType } from "./src/constants/index";
import { D2PtScraper } from "d2pt.js";
import RedisManager from "./src/utils/redis-manager";

import * as dotenv from "dotenv";

dotenv.config();

const ROLES = ["HC", "MID", "TOP", "SUP4", "SUP5"];
const d2pt = new D2PtScraper();
const redisManager = new RedisManager();

async function getHeroesMetaWithDelay(index: number) {
	if (index < ROLES.length) {
		try {
			const ROLE = ROLES[index].toLocaleLowerCase() as metaHeroesType;
			const getHeroesMetaCache = await redisManager.get(ROLE);
			if (!getHeroesMetaCache) {
				const heroesMeta = await d2pt.getHeroesMeta(ROLE);
				console.log(`Fetched data for ${ROLES[index]}`);
				console.log(heroesMeta);
				await redisManager.set(ROLES[index], JSON.stringify(heroesMeta));
			}
		} catch (error) {
			console.error(`Error fetching heroes meta for ${ROLES[index]}:`, error);
		}

		setTimeout(() => getHeroesMetaWithDelay(index + 1), 2 * 60 * 1000); // 2 minutos em milissegundos
	}
}

getHeroesMetaWithDelay(0);
