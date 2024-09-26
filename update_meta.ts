import { metaHeroesType } from "./src/constants/index";
import { D2PtScraper } from "d2pt.js";

import * as dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const ROLES = ["HC", "MID", "TOP", "SUP4", "SUP5"];
const d2pt = new D2PtScraper();

const redisData = {
  host: "127.0.0.1",
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
};
const redisUrl = `redis://default:${redisData.password}@${redisData.host}:${redisData.port}`;
const redisClient = createClient({
  url: redisUrl,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

async function getHeroesMetaWithDelay() {
  for (let index = 0; index < ROLES.length; index++) {
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

    // Delay of 2 minutes between each role processing
    await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));
  }
}

getHeroesMetaWithDelay();
