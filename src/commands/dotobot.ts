import Command from "../lib/command";

export default new Command(
	"dotobot",
	async ({ rawArgs, client, channel, tags }) => {
		client.say(channel, `@${tags.username}, I'm not a bot, I'm a human. Developed by @xstrdoto. contact me discord at #xstrdev`);
	}
);