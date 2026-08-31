export type SizeOption = { id: string; label: string; priceDelta: number };
export type PotOption = { id: string; label: string; priceDelta: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  mrp: number;
  sizes: SizeOption[];
  pots: PotOption[];
  care: { light: string; water: string; temperature: string; humidity: string; difficulty: string };
  stock: number;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
};

export type Address = {
  id?: string;
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};