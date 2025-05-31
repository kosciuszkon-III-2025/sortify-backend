export default class Config {
	private static instance: Config;
	public readonly user: string;
	public readonly pass: string;

	private constructor() {
		const user = Bun.env.OPF_USER;
		const pass = Bun.env.OPF_PASS;

		if (!user) {
			console.error("Missing environment variable: OPF_USER");
			process.exit(1);
		}

		if (!pass) {
			console.error("Missing environment variable: OPF_PASS");
			process.exit(1);
		}

		this.user = user;
		this.pass = pass;
	}

	public static getInstance(): Config {
		if (!Config.instance) {
			Config.instance = new Config();
		}
		return Config.instance;
	}
}
