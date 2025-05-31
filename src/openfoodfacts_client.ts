import Config from "./config";

const conf = Config.getInstance();

const API_URL = "https://world.openfoodfacts.net/api/v2";

enum ProductResponseStatus {
	SUCCESS,
	NOT_FOUND,
}
type ProductResponse = {
	status: ProductResponseStatus;
	error: string | null;
	body: any | null;
};

function productUrl(productId: number, fields: string[] = []): string {
	const rawQuery = fields.length > 0 ? `?fields=${fields.join(",")}` : "";
	return `${API_URL}/product/${productId}${rawQuery}`;
}

async function getProduct(productId: number): Promise<ProductResponse> {
	const fields = [
		"code",
		"packagings_materials",
		"ecoscore_data",
		"generic_name_en",
		"product_name_en",
	];
	const url = productUrl(productId, fields);

	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${btoa(`${conf.user}:${conf.pass}`)}`,
		},
	});

	if (!response.ok) {
		console.warn(`Failed to fetch product: ${response.statusText}`);
		return {
			status: ProductResponseStatus.NOT_FOUND,
			error: response.statusText,
			body: null,
		};
	}

	const body = await response.json();

	console.info(`Product with id ${productId} fetched successfully`);
	return {
		status: ProductResponseStatus.SUCCESS,
		error: null,
		body,
	};
}

export { getProduct, ProductResponseStatus };
export type { ProductResponse };
