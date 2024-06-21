import { Long } from "mongodb";
import TwitchBot from "../lib/twitch";
import { ChatUserstate } from "tmi.js";

export interface ChannelsQuery {
	id: number;
	count?: number;
	accounts: number[];
	delay?: {
		enabled: boolean;
		seconds?: number;
	};
	mods?: number[];
	name: string;
	globalMod?: boolean;
	self?: boolean;
	hc?: { hero_id: string }[];
	emotes?: boolean;
}
export interface PlayersQuery {
	account_id: number;
	hero_id: number;
}
export interface GamesQuery {
	average_mmr: number;
	activate_time: number;
	deactivate_time: number;
	game_mode: number;
	league_id: number;
	match_id: Long;
	lobby_id: Long;
	lobby_type: number;
	players: PlayersQuery[];
	server_steam_id: Long;
	weekend_tourney_bracket_round: number | null;
	weekend_tourney_skill_level: number | null;
	createdAt: Date;
}
export interface GameHistoryQuery {
	average_mmr: number;
	game_mode: number;
	league_id: number;
	match_id: Long;
	lobby_id: Long;
	lobby_type: number;
	players: PlayersQuery[];
	server_steam_id: Long;
	weekend_tourney_bracket_round: number | null;
	weekend_tourney_skill_level: number | null;
	createdAt: Date;
	radiant_win?: boolean;
}
export interface RpsQuery {
	status: string;
	WatchableGameID: Long | null;
	watching_server: Long | null;
	steam_id: Long;
	createdAt: Date;
	param0: string | null;
}
export interface CommandsQuery {
	triggers: string[];
	filename: string;
	command: string;
	channels: number[];
	cooldown: number;
}
export interface HeroesQuery {
	id: number;
	localized_name: string;
	custom?: boolean;
	emotes?: number[];
	emotesets: string[];
}
export interface NotablePlayersQuery {
	id: number;
	channel: number | null;
	name: string;
	enabled: boolean;
	lastChangedBy: number | null;
	lastChanged?: Date;
}
export interface GameModesQuery {
	id: number;
	name: string;
}
export interface CardsQuery {
	id: number;
	lobby_id: Long;
	createdAt: Date;
	leaderboard_rank: number;
	rank_tier: number;
	lifetime_games: number;
}
export interface ErrorsQuery {
	message: string;
	name: string;
	stack: string | undefined;
	createdAt: Date;
}
export interface MedalsQuery {
	rank_tier: number;
	name: string;
}
export interface StreamsQuery {
	user_id: number;
	startTime: Date;
	createdAt: Date;
}
export interface RealTimeStatsPlayersQuery {
	accountid: number;
	playerid: number;
	team: number;
	heroid: number;
}
export interface RealTimeStatsTeamsQuery {
	team_number: number;
	players: RealTimeStatsPlayersQuery[];
}
export interface RealTimeStatsQuery {
	server_steam_id: Long;
	buildings: [];
	createdAt: Date;
	graph_data: {};
	match: {};
	teams: RealTimeStatsTeamsQuery[];
}

export type RunParams = {
	client: TwitchBot;
	commandName: string;
	args: string[];
	rawArgs: string;

	channel: string;
	tags: ChatUserstate;
	message: string;
	self: boolean;
};

export type Hero = {
	role?: string;
	name?: string;
	matches?: string;
	winRate?: string;
	winRate9500?: string;
	contestRate?: string;
	rating?: string;
	radiantWinRate?: string;
	direWinRate?: string;
	expertWinRate?: string;
	phase1WinRate?: string;
	phase2WinRate?: string;
	phase3WinRate?: string;
	networth?: string;
};

export type MetaHeroes = {
	All: Hero[];
	Carry: Hero[];
	Mid: Hero[];
	Off: Hero[];
	"Pos 4": Hero[];
	"Pos 5": Hero[];
};
