import { metaHeroesType } from "./constants/index";
import { D2PtScraper } from "d2pt.js";
import * as dotenv from "dotenv";
import { createClient } from "redis";
import cron from "node-cron";

dotenv.config(); // Certifique-se de carregar as variáveis de ambiente

cron.schedule(`0 0 * * *`, async () => {
  console.log("Running cron job update meta heroes...");

  const ROLES = ["HC", "MID", "TOP", "SUP4", "SUP5"];
  const d2pt = new D2PtScraper();

  // Use a variável de ambiente para o Redis no Railway
  const redisUrl = process.env.REDIS_HOST; // Railway vai injetar REDIS_URL
  const redisClient = createClient({
    url: redisUrl,
  });

  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect(); // Aguarde a conexão

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

      // Delay de 2 minutos entre cada role
      await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 1000));
    }
  }

  await getHeroesMetaWithDelay();
});
