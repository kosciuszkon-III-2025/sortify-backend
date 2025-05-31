interface Product {
	id: number;
}

const product = {
	"/api/product/:id": (req: Request): Response => {
		const url = new URL(req.url);
		const id = parseInt(url.pathname.split("/").pop() || "");

		if (isNaN(id)) {
			return new Response("Invalid product ID", { status: 400 });
		}

		const product: Product = {
			id: id,
		};

		return new Response(JSON.stringify(product), {
			headers: { "Content-Type": "application/json" },
		});
	},
};

export default product;
