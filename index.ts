import product from "./src/product.ts";
import contribute from "./src/contribute.ts";

Bun.serve({
	port: 3000,
	routes: {
		"/api/hello": () => {
			return new Response("Hello, World!");
		},
		...product,
		...contribute,
	},
});
