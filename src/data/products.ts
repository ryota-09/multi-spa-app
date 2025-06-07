export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "ドギーマン",
    price: 100,
    description: "めっちゃ美味しい",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "ドギーマン2",
    price: 200,
    description: "めっちゃ美味しいし栄養ある",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "ドギーマン3",
    price: 300,
    description: "プレミアム品質",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  },
];
