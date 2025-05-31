import { getProduct, isProductIdCorrect } from "./openfoodfacts_api";

type Product = {
	id: number;
};

const product = {
	"/api/product/:id": async (req: Request): Promise<Response> => {
		const url = new URL(req.url);
		const id = Number(url.pathname.split("/").pop() || "");
		console.log("Product ID:", id);

		if (!isProductIdCorrect(id)) {
			return new Response("Invalid product ID", { status: 400 });
		}

		const product = await getProduct(id);

		return Response.json(product);
	},
};

export default product;
export type { Product };
