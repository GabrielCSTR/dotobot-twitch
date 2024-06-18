import { RunParams } from "../types";

class Command {
	constructor(
		public commandName: string,
		public execute: (params: RunParams) => unknown
	) {}
}

export default Command;
