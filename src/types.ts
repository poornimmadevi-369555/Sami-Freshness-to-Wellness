export interface Product {
  id: string;
  name: string;
  category: 'fruits' | 'vegetables' | 'dairy' | 'bakery' | 'root-vegetables' | 'imported-fruits';
  price: number; // in INR (₹)
  unit: string; // e.g., "kg", "litre", "dozen", "pack"
  image: string; // high-quality visual description
  description: string;
  badge?: string; // e.g., "Organic", "Bestseller", "Sale 20% Off"
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}
