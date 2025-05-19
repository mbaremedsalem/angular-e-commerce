// import { Injectable } from '@angular/core';
// import { ApiService } from './api.service';
// import { ProductResponse, Product } from '../models/product.model';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {
//   constructor(private api: ApiService) { }
  

  // getProductsByCategory(category: string): Observable<ProductResponse> {
  //   return this.api.get('/api/products/', { category }).pipe(
  //     map((response: any) => response as ProductResponse)
  //   );
  // }

  // getProductById(id: number): Observable<Product> {
  //   return this.api.get(`/api/products/${id}/`).pipe(
  //     map((response: any) => response as Product)
  //   );
  // }

  // getProduct(id: number): Observable<any> {
  //   return this.api.get(`/api/product/${id}/`);
  // }

  // submitReview(productId: number, rating: number, comment: string): Observable<any> {
  //   return this.api.post(`/api/${productId}/reviews/`, {
  //     rating,
  //     comment
  //   });
  // }

// }




// import { Injectable } from '@angular/core';
// import { ApiService } from './api.service';
// import { ProductResponse, Product } from '../models/product.model';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { TranslateService } from '@ngx-translate/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {
//   constructor(
//     private api: ApiService,
//     private translate: TranslateService
//   ) { }

//   getProductsByCategory(category: string): Observable<ProductResponse> {
//     return this.api.get('/api/products/', { category }).pipe(
//       map((response: any) => this.mapProductsToCurrentLang(response))
//     );
//   }

//   private mapProductsToCurrentLang(response: ProductResponse): ProductResponse {
//     const lang = this.translate.currentLang;
//     return {
//       ...response,
//       results: response.results.map(product => ({
//         ...product,
//         // Utilisez les champs spécifiques si disponibles (name_fr, name_ar)
//         name: this.getTranslatedField(product, 'name', lang),
//         description: this.getTranslatedField(product, 'description', lang)
//       }))
//     };
//   }

//   private getTranslatedField(product: any, field: string, lang: string): string {
//     // Si des champs spécifiques existent (name_fr, name_ar)
//     if (product[`${field}_${lang}`]) {
//       return product[`${field}_${lang}`];
//     }
//     // Si l'API renvoie directement les traductions dans le même champ
//     return product[field];
//   }

//   // ... autres méthodes inchangées ...
//   getProductById(id: number): Observable<Product> {
//     return this.api.get(`/api/products/${id}/`).pipe(
//       map((response: any) => response as Product)
//     );
//   }

//   getProduct(id: number): Observable<any> {
//     return this.api.get(`/api/product/${id}/`);
//   }

//   submitReview(productId: number, rating: number, comment: string): Observable<any> {
//     return this.api.post(`/api/${productId}/reviews/`, {
//       rating,
//       comment
//     });
//   }
// }




import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ProductResponse, Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private api: ApiService,
    private translate: TranslateService
  ) { }


  getProductsByCategory(category: string): Observable<ProductResponse> {
    return this.api.get<ProductResponse>('/api/products/', { category }).pipe(
      map(response => this.mapProductsToLang(response))
    );
  }

  private mapProductsToLang(response: ProductResponse): ProductResponse {
    const lang = this.translate.currentLang;
    return {
      ...response,
      results: response.results.map(product => ({
        ...product,
        // Ne pas écraser les champs originaux
        displayName: lang === 'ar' ? product.name_ar || product.name : product.name_fr || product.name,
        displayDescription: lang === 'ar' ? product.description_ar || product.description : product.description_fr || product.description
      }))
    };
  }


    getProductById(id: number): Observable<Product> {
    return this.api.get(`/api/products/${id}/`).pipe(
      map((response: any) => response as Product)
    );
  }

  // getProduct(id: number): Observable<any> {
  //   return this.api.get(`/api/product/${id}/`);
  // }
  getProduct(id: number): Observable<any> {
    return this.api.get(`/api/product/${id}/`).pipe(
      map((response: any) => {
        const lang = this.translate.currentLang;
        const product = response.product;
        
        return {
          product: {
            ...product,
            name: product[`name_${lang}`] || product.name,
            description: product[`description_${lang}`] || product.description
          }
        };
      })
    );
  }
  submitReview(productId: number, rating: number, comment: string): Observable<any> {
    return this.api.post(`/api/${productId}/reviews/`, {
      rating,
      comment
    });
  }
}