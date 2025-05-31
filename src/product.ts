import ErrorRes from "./error";
import handle from "./product_service";

const product = {
	"/api/product/:id": async (req: Request): Promise<Response> => {
		const url = new URL(req.url);
		const rawId = url.pathname.split("/").pop() || "";

		let product;
		try {
			product = await handle(rawId);
		} catch (e) {
			if (e instanceof ErrorRes) {
				return e.response()
			} else {
				return new Response("Internal Server Error", { status: 500 })
			}
		}

		return Response.json(product);
	},
};

export default product;
