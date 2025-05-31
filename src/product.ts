import { getProduct, parseProductId } from "./openfoodfacts_api";

type Product = {
	id: number;
};

const product = {
	"/api/product/:id": async (req: Request): Promise<Response> => {
		const url = new URL(req.url);
		const rawId = url.pathname.split("/").pop() || "";
		const id = parseProductId(rawId);

		if (id === null) {
			return new Response("Invalid product ID", { status: 400 });
		}

		const product = await getProduct(id);

		return Response.json(product);
	},
};

export default product;
export type { Product };
