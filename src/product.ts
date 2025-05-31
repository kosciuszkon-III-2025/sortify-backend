import handle from "./product_service";

const product = {
	"/api/product/:id": async (req: Request): Promise<Response> => {
		const url = new URL(req.url);
		const rawId = url.pathname.split("/").pop() || "";

		const product = await handle(rawId);

		return Response.json(product);
	},
};

export default product;
