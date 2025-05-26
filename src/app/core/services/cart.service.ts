// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { environment } from '../../environments/environment';
// import { Product } from '../models/product.model';

// interface CartItem {
//   product: Product;
//   quantity: number;
// }

// interface Order {
//   id: number;
//   orderItems: any[];
//   total_amount: string;
//   status: string;
//   created_at: string;
//   // autres champs selon votre API
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private apiUrl = `${environment.domain}/api`;
//   private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
//   private ordersSubject = new BehaviorSubject<Order[]>([]);
  
//   cartItems$ = this.cartItemsSubject.asObservable();
//   orders$ = this.ordersSubject.asObservable();

//   constructor(private http: HttpClient) {
//     this.loadCartFromStorage();
//   }

//   // Méthodes existantes pour le panier
//   addToCart(product: Product, quantity: number = 1): void {
//     const currentItems = this.cartItemsSubject.value;
//     const existingItem = currentItems.find(item => item.product.id === product.id);

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       currentItems.push({ product, quantity });
//     }

//     this.updateCart(currentItems);
//   }

//   // ... autres méthodes du panier (removeFromCart, updateQuantity, clearCart)

//   // Nouvelles méthodes pour les commandes
//   getOrders(): void {
//     this.http.get<{results: Order[]}>(`${this.apiUrl}/orders/`).subscribe({
//       next: (response) => {
//         this.ordersSubject.next(response.results);
//       },
//       error: (err) => {
//         console.error('Error fetching orders:', err);
//       }
//     });
//   }

//   checkout(shippingInfo: any): Observable<any> {
//     const cartItems = this.cartItemsSubject.value;
//     const orderData = {
//       items: cartItems.map(item => ({
//         product: item.product.id,
//         quantity: item.quantity,
//         price: item.product.price
//       })),
//       ...shippingInfo
//     };

//     return this.http.post(`${this.apiUrl}/orders/`, orderData).pipe(
//       tap(() => {
//         // this.clearCart(); // Vider le panier après commande
//         this.getOrders(); // Rafraîchir la liste des commandes
//       })
//     );
//   }

//   private loadCartFromStorage(): void {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       this.cartItemsSubject.next(JSON.parse(savedCart));
//     }
//   }

//   private updateCart(items: CartItem[]): void {
//     this.cartItemsSubject.next(items);
//     localStorage.setItem('cart', JSON.stringify(items));
//   }
// }


// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderService } from './order.service';
import { AuthService } from './auth.service';


interface CartItem {
  product: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => i.product === item.product);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    this.updateCart(currentItems);
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartItems.value.filter(item => item.product !== productId);
    this.updateCart(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const updatedItems = this.cartItems.value.map(item => {
      if (item.product === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.updateCart(updatedItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItems.next(items);
    localStorage.setItem('cart', JSON.stringify(items));
  }

  getTotalItems(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.price || 0) * item.quantity;
    }, 0);
  }

  placeOrder(shippingInfo: any): Observable<any> {
    const orderData = {
      orderItems: this.cartItems.value.map(item => ({
        product: item.product,
        quantity: item.quantity
      })),
      ...shippingInfo
    };

    return this.orderService.createOrder(orderData);
  }

  

  getOrderHistory(): Observable<any> {
    return this.orderService.getOrders();
  }

  getOrderDetails(orderId: number): Observable<any> {
    return this.orderService.getOrderById(orderId);
  }
}