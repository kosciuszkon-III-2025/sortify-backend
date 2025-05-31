import product from "./src/product.ts";
import contribute from "./src/contribute.ts";

Bun.serve({
	port: 3000,
	routes: {
		...product,
		...contribute,
		"/*": (): Response => new Response("Not Found", { status: 404 }),
	},
});
