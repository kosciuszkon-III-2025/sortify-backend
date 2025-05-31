Bun.serve({
	port: 3000,
	routes: {
		"/api/hello": () => {
			return new Response("Hello, World!");
		},
	},
});
