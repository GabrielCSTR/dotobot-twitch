import { MetaHeroes } from "@/types";

export const PREFIX = "!";

export const categoryAliases: { [key: string]: keyof MetaHeroes } = {
	hc: "Carry",
	mid: "Mid",
	off: "Off",
};

export type MetaHeroesAliases = {
	hc: "Carry";
	mid: "Mid";
	off: "Off";
	sup4: "Pos 4";
	sup5: "Pos 5";
	pos4: "Pos 4";
	pos5: "Pos 5";
};

type MetaHeroesKeys = keyof MetaHeroes;
type MetaHeroesAliasesKeys = keyof MetaHeroesAliases;
export type metaHeroesType = MetaHeroesKeys | MetaHeroesAliasesKeys;
