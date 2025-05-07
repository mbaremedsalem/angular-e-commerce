// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { catchError, Observable, of } from 'rxjs';
// import { Category } from '../models/category.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class CategoryService {
//   private apiUrl = 'api/categories'; // Adaptez à votre endpoint API

//   constructor(private http: HttpClient) {}

//   getCategories(): Observable<Category[]> {
//     return this.http.get<Category[]>(this.apiUrl);
//   }

//     /**
//    * Récupère les catégories en vedette
//    * @param limit - Nombre maximum de catégories à retourner (par défaut 6)
//    */
//     getFeaturedCategories(limit: number = 6): Observable<Category[]> {
//       return this.http.get<Category[]>(`${this.apiUrl}/featured`, {
//         params: { limit: limit.toString() }
//       }).pipe(
//         catchError(() => {
//           // Fallback si l'API n'est pas disponible
//           return of(this.getMockFeaturedCategories(limit));
//         })
//       );
//     }
  
//     /**
//      * Données mock pour le développement
//      */
//     private getMockFeaturedCategories(limit: number): Category[] {
//       const mockCategories: Category[] = [
//         { id: 1, name: 'Électronique', slug: 'electronique', image: 'assets/images/electronics.jpg' },
//         { id: 2, name: 'Vêtements', slug: 'vetements', image: 'assets/images/clothing.jpg' },
//         { id: 3, name: 'Maison', slug: 'maison', image: 'assets/images/home.jpg' },
//         { id: 4, name: 'Sports', slug: 'sports', image: 'assets/images/sports.jpg' },
//         { id: 5, name: 'Jouets', slug: 'jouets', image: 'assets/images/toys.jpg' },
//         { id: 6, name: 'Beauté', slug: 'beaute', image: 'assets/images/beauty.jpg' }
//       ];
      
//       return mockCategories.slice(0, limit);
//     }
// }


// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { Cart, CartItem } from '../models/cart.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private cartSubject = new BehaviorSubject<Cart>(this.getEmptyCart());

//   // Observable public
//   cart$ = this.cartSubject.asObservable();

//   private getEmptyCart(): Cart {
//     return {
//       items: [],
//       total: 0
//     };
//   }

//   addToCart(item: CartItem): void {
//     const currentCart = this.cartSubject.value;
//     const existingItem = currentCart.items.find(i => i.productId === item.productId);

//     if (existingItem) {
//       existingItem.quantity += item.quantity;
//     } else {
//       currentCart.items.push(item);
//     }

//     currentCart.total = this.calculateTotal(currentCart.items);
//     this.cartSubject.next(currentCart);
//   }

//   removeFromCart(productId: number): void {
//     const currentCart = this.cartSubject.value;
//     currentCart.items = currentCart.items.filter(item => item.productId !== productId);
//     currentCart.total = this.calculateTotal(currentCart.items);
//     this.cartSubject.next(currentCart);
//   }

//   clearCart(): void {
//     this.cartSubject.next(this.getEmptyCart());
//   }

//   private calculateTotal(items: CartItem[]): number {
//     return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   }

//   getCurrentCart(): Cart {
//     return this.cartSubject.value;
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.domain}/api/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map(categories => this.transformCategories(categories)),
      catchError(() => of([]))
    );
  }

  getFeaturedCategories(limit: number = 6): Observable<Category[]> {
    return this.getCategories().pipe(
      map(categories => categories.slice(0, limit))
    );
  }

  private transformCategories(categories: any[]): Category[] {
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: this.createSlug(category.name),
      image: this.fixImageUrl(category.image) // Correction des URLs d'images
    }));
  }

  private createSlug(name: string): string {
    return name.toLowerCase()
      .replace(/é|è|ê/g, 'e')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  private fixImageUrl(imageUrl: string): string {
    // Corrige les URLs mal formatées si nécessaire
    if (imageUrl.includes('http://172.20.10.5:8000')) {
      return imageUrl.replace('http://172.20.10.5:8000', environment.domain);
    }
    return imageUrl;
  }
}