import Config from "../config";
const conf = Config.getInstance();

interface Contribution {
	productId: number;
}

const contribute = {
	"/api/contribute/:productId": (req: Request): Response => {
		const url = new URL(req.url);
		const productId = parseInt(url.pathname.split("/").pop() || "");

		if (isNaN(productId)) {
			return new Response("Invalid product ID", { status: 400 });
		}

		const contribution: Contribution = {
			productId,
		};

		return new Response(JSON.stringify(contribution), {
			headers: { "Content-Type": "application/json" },
		});
	},
};

export default contribute;
