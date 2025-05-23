// product.model.ts
export interface Image {
    id: number;
    image: string;
    product: number;
  }
  
  export interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    product: number;
    user: number;
  }
  
  // export interface Product {
  //   id: number;
  //   name: string;
  //   description: string;
  //   price: string;
  //   old_price: string;
  //   brand: string;
  //   category: number;
  //   ratings: string;
  //   stock: number;
  //   user: number;
  //   images: Image[];
  //   reviews: Review[];
  // }


  export interface Product {
  id: number;
  name: string;
  name_fr?: string;
  name_ar?: string;
  description: string;
  description_fr?: string;
  description_ar?: string;
  price: string;
  old_price: string;
  brand: string;
  category: number;
  ratings: string;
  stock: number;
  is_active: boolean;
  images: Image[];
  [key: string]: any;
}

  export interface ProductResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Product[];
  }