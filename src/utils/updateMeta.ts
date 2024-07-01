import { metaHeroesType } from "@/constants";
import { D2PtScraper } from "d2pt.js";
import RedisManager from "./redis-manager";

const ROLES = ["HC", "MID", "OFF", "SUP4", "SUP5"];

const d2pt = new D2PtScraper();
const redisClient = new RedisManager();

const updateHeroesMetaWithDelay = async (index: number) => {
	if (index < ROLES.length) {
		try {
			const ROLE = ROLES[index].toLocaleLowerCase() as metaHeroesType;
			const getHeroesMetaCache = await redisClient.get(ROLE);
			if (!getHeroesMetaCache) {
				const heroesMeta = await d2pt.getHeroesMeta(ROLE);
				console.log(`Fetched data for ${ROLES[index]}`);
				console.log(heroesMeta);
				await redisClient.set(ROLES[index], JSON.stringify(heroesMeta));
			}
		} catch (error) {
			console.error(`Error fetching heroes meta for ${ROLES[index]}:`, error);
		}

		setTimeout(() => updateHeroesMetaWithDelay(index + 1), 1 * 60 * 1000); // 2 minutos em milissegundos
	}
};

export default updateHeroesMetaWithDelay;
