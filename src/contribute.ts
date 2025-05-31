import Config from "./config";
const conf = Config.getInstance();

import { z } from "zod";
const ContributionSchema = z.object({
	lang: z.string().length(2),
	productName: z.string().min(1),
	productDescription: z.string().optional(),
	packaging: z.array(z.object({
		bin: z.enum(['glass', 'paper', 'plastic-metal', 'organic', 'non-recyclable', 'return']),
	}))
});

const contribute = {
	"/api/contribute/:productId": {
		POST: async (req: Request): Promise<Response> => {
			const url = new URL(req.url);
			const productId = parseInt(url.pathname.split("/").pop() || "");

			if (isNaN(productId)) {
				return new Response("Invalid product ID", { status: 400 });
			}

			let contribution
			try {
				contribution = ContributionSchema.parse(await req.json());
			} catch {
				return new Response("Bad request", { status: 400 })
			}

			let body, res
			body = new FormData();
			body.set("code", productId.toString())
			body.set("user_id", conf.user)
			body.set("password", conf.pass)
			body.set("packaging", contribution.packaging.join(','))

			res = await fetch('https://world.openproductsfacts.org/cgi/product_jqm2.pl', {
				method: 'POST',
				headers: { 'Content-Type': 'multipart/form-data' },
				body: body
			})

			return new Response(null, { status: 201 });
		}
	},
};

export default contribute;
