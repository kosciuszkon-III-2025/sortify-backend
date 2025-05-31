import Config from "./config";
import type { Product } from "./product";

const conf = Config.getInstance();

const API_URL = "https://world.openfoodfacts.net/api/v2";

enum ProductFields {
	ECOSCORE_DATA = "ecoscore_data",
}

function parseProductId(productId: string): number | null {
	const serializedId = productId.trim().replace(" ", "");
	if (serializedId.length === 0) {
		return null;
	}

	if (
		serializedId.length !== 8 && // GTIN-8
		serializedId.length !== 12 && // GTIN-12
		serializedId.length !== 13 && // GTIN-13
		serializedId.length !== 14 // GTIN-14
	) {
		return null;
	}

	const parsedId = Number(productId);
	if (
		!parsedId ||
		isNaN(parsedId) ||
		!Number.isFinite(parsedId) ||
		!Number.isInteger(parsedId)
	) {
		return null;
	}

	return parsedId;
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

export { parseProductId, ProductFields, getProduct };
