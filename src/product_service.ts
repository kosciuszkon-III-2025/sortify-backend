import { getProduct, ProductResponseStatus } from "./openfoodfacts_client";
import {
	MaterialType,
	Trashcan,
	type Material,
	type Product,
} from "./product_model";

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

function parseMaterialType(name: string): MaterialType {
	switch (name.toLowerCase().split(":").pop() || "") {
		case "paper":
			return MaterialType.Paper;
		case "plastic":
			return MaterialType.Plastic;
		case "glass":
			return MaterialType.Glass;
		case "metal":
			return MaterialType.Metal;
		default:
			return MaterialType.Unknown;
	}
}

function parseMaterial(name: string, data: any): Material {
	return {
		type: parseMaterialType(name),
		percentage: data.weight_percent || 100,
	};
}

function calculateTrashcan(materials: Material[]): Trashcan {
	let hasPaper = false;
	let hasPlastic = false;
	let hasGlass = false;
	let hasMetal = false;
	for (const material of materials) {
		switch (material.type) {
			case MaterialType.Paper:
				hasPaper = true;
				break;
			case MaterialType.Plastic:
				hasPlastic = true;
				break;
			case MaterialType.Glass:
				hasGlass = true;
				break;
			case MaterialType.Metal:
				hasMetal = true;
				break;
			default:
				break;
		}
	}
	if (hasPaper && !hasPlastic && !hasGlass && !hasMetal) {
		return Trashcan.Paper;
	} else if (hasPlastic && !hasPaper && !hasGlass && !hasMetal) {
		return Trashcan.Plastic;
	} else if (hasGlass && !hasPaper && !hasPlastic && !hasMetal) {
		return Trashcan.Glass;
	} else if (hasMetal && !hasPaper && !hasPlastic && !hasGlass) {
		return Trashcan.Metal;
	} else {
		return Trashcan.GeneralWaste;
	}
}

function parseProduct(response: any): Product | null {
	const recyclable =
		response.product.environmental_score_data.adjustments.packaging
			.non_recyclable_and_non_biodegradable_materials;
	const isRecyclable = recyclable === undefined || recyclable === 0;

	const materials = Object.entries(
		response.product.packagings_materials,
	).reduce((acc: Material[], [key, value]: any[]) => {
		if (key === "all") {
			return acc;
		}
		acc.push(parseMaterial(key, value));
		return acc;
	}, []);

	const episcore =
		response.product.environmental_score_data.adjustments.origins_of_ingredients
			.epi_score || 0;
	const packagingScore =
		response.product.environmental_score_data.adjustments.packaging.score || 0;

	return {
		id: response.code,
		name: response.product.product_name_en,
		isRecyclable,
		trashcan: calculateTrashcan(materials),
		materials,
		eco_score: (episcore + packagingScore) / 2,
		phoneNumber: "+1234567890", // Placeholder, replace with actual data if available
		address: "123 Recycling St, Recycle City", // Placeholder, replace with actual data if available
	};
}

async function handle(productId: string): Promise<Product> {
	const id = parseProductId(productId);
	if (id === null) {
		console.error("Invalid product ID:", productId);
		throw new Error("Invalid product ID");
	}

	const response = await getProduct(id);
	if (response.status !== ProductResponseStatus.SUCCESS) {
		throw new Error("Failed to fetch product");
	}

	const product = parseProduct(response.body);
	if (!product) {
		throw new Error("Failed to parse product");
	}

	return product;
}

export default handle;
