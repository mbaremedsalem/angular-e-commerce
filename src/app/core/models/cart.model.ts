// src/app/core/models/cart.model.ts
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// export interface Cart {
//   items: CartItem[];
//   total: number;
// }
  export interface Cart {
    id?: string; // Optionnel pour le stockage backend
    items: CartItem[];
    total: number;
    userId?: string; // Optionnel pour l'authentification
    createdAt?: Date;
  }