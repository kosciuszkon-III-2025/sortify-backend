enum Trashcan {
	GeneralWaste = "general_waste",
	Paper = "paper",
	Plastic = "plastic",
	Glass = "glass",
	Metal = "metal",
	Organic = "organic",
}

enum MaterialType {
	Unknown = "unknown",
	Paper = "paper",
	Plastic = "plastic",
	Glass = "glass",
	Metal = "metal",
}

type Material = {
	type: MaterialType;
	percentage: number;
};

type Product = {
	id: number;
	name: string;
	isRecyclable: boolean;
	trashcan: Trashcan;
	materials: Material[];
	eco_score?: number;

	phoneNumber?: string;
	address?: string;
};

export { Trashcan, MaterialType };
export type { Material, Product };
