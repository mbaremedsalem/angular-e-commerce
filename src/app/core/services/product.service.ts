import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ProductResponse, Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private api: ApiService) { }
  

  getProductsByCategory(category: string): Observable<ProductResponse> {
    return this.api.get('/api/products/', { category }).pipe(
      map((response: any) => response as ProductResponse)
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.api.get(`/api/products/${id}/`).pipe(
      map((response: any) => response as Product)
    );
  }

  getProduct(id: number): Observable<any> {
    return this.api.get(`/api/product/${id}/`);
  }

  submitReview(productId: number, rating: number, comment: string): Observable<any> {
    return this.api.post(`/api/${productId}/reviews/`, {
      rating,
      comment
    });
  }

}