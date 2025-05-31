import Config from "./config";
import type { Product } from "./product";

const conf = Config.getInstance();

const API_URL = "https://world.openfoodfacts.net/api/v2";

enum ProductFields {
	ECOSCORE_DATA = "ecoscore_data",
}

function isProductIdCorrect(productId: number): boolean {
	return (
		Number.isInteger(productId) &&
		productId > 0 &&
		productId < 10000000000000 &&
		productId >= 1000000000000
	);
}

function productUrl(productId: number, fields: ProductFields[] = []): string {
	const rawQuery = fields.length > 0 ? `?fields=${fields.join(",")}` : "";
	return `${API_URL}/product/${productId}${rawQuery}`;
}

function parseProduct(response: unknown): Product {
	return { id: 0 };
}

async function getProduct(
	productId: number,
	fields: ProductFields[] = [],
): Promise<Product> {
	const url = productUrl(productId, fields);

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${btoa(`${conf.user}:${conf.pass}`)}`,
		},
	});
	const json = await response.json();
	console.log("Response from Open Food Facts API:", json);
	return parseProduct(json);
}

export { isProductIdCorrect, ProductFields, getProduct };
