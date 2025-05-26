import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

export interface OrderItem {
  id: number;
  product: number;
  quantity: number;
  name: string;
  name_fr: string;
  name_ar: string;
  price: string;
  image: string;
}

export interface Order {
  id: number;
  orderItems: OrderItem[];
  street_fr: string;
  street_ar: string;
  city_fr: string;
  city_ar: string;
  state_fr: string;
  state_ar: string;
  zip_code: string;
  phone: string;
  country: string;
  total_amount: string;
  payment_status: string;
  status: string;
  payment_mode: string;
  created_at: string;
  user: number;
}

export interface OrderResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

export interface SingleOrderResponse {
  order: Order;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.domain}/api/orders`;

  constructor(private http: HttpClient) { }

  // getOrders(): Observable<OrderResponse> {
  //   return this.http.get<OrderResponse>(`${this.apiUrl}/`);
  // }

getOrders(url?: string): Observable<OrderResponse> {
  if (url) {
    // Utiliser l'URL complète fournie par l'API
    return this.http.get<OrderResponse>(url);
  } else {
    // Première requête
    return this.http.get<OrderResponse>(`${this.apiUrl}`);
  }
}

  getOrderById(id: number): Observable<SingleOrderResponse> {
    return this.http.get<SingleOrderResponse>(`${this.apiUrl}/${id}/`);
  }

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/new/`, orderData);
  }

  updateOrder(id: number, updateData: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/`, updateData);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}