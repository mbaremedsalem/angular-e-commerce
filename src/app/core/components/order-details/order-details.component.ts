import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService, Order, SingleOrderResponse, OrderItem } from '../../services/order.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error: string | null = null;
  activeLanguage: 'fr' | 'ar' = 'fr';
  public apiUrl = `${environment.domain}`;
  
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(+orderId);
    } else {
      this.error = 'Numéro de commande invalide';
      this.loading = false;
    }
  }

  loadOrderDetails(orderId: number): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrderById(orderId).subscribe({
      next: (response: SingleOrderResponse) => {
        this.order = response.order;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Échec du chargement des détails de la commande';
        this.loading = false;
        console.error('Error loading order details:', err);
      }
    });
  }

  switchLanguage(lang: 'fr' | 'ar'): void {
    this.activeLanguage = lang;
  }

  // Type-safe method for address fields
  getTranslated(field: 'street' | 'city' | 'state', lang: 'fr' | 'ar' = this.activeLanguage): string {
    if (!this.order) return '';
    const translatedField = `${field}_${lang}` as const;
    return this.order[translatedField] || '';
  }


  // Safe method to get translated name
  getItemName(item: OrderItem): string {
    switch (this.activeLanguage) {
      case 'fr': return item.name_fr || item.name;
      case 'ar': return item.name_ar || item.name;
      default: return item.name;
    }
  }

// ------


  // Convert price string to number for calculations
  getItemTotal(item: OrderItem): number {
    const price = parseFloat(item.price);
    return isNaN(price) ? 0 : price * item.quantity;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'processing': return 'status-processing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder-product.png';
    event.target.onerror = null;
  }
}