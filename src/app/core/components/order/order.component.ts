import { Component, OnInit } from '@angular/core';
import { Order, OrderResponse, OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  nextPage: string | null = null;
  previousPage: string | null = null;
  currentPage = 1;
  public apiUrl = `${environment.domain}`;
  
  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(url?: string): void {
    this.loading = true;
    this.error = null;

    this.orderService.getOrders(url).subscribe({
      next: (response: OrderResponse) => {
        this.orders = response.results;
        this.nextPage = response.next;
        this.previousPage = response.previous;
        
        // Mettre à jour currentPage en fonction de l'URL
        if (url) {
          const pageMatch = url.match(/page=(\d+)/);
          this.currentPage = pageMatch ? parseInt(pageMatch[1], 10) : 1;
        } else {
          this.currentPage = 1;
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  loadNextPage(): void {
    if (this.nextPage) {
      this.loadOrders(this.nextPage);
    }
  }

  loadPreviousPage(): void {
    if (this.previousPage) {
      this.loadOrders(this.previousPage);
    }
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'status-processing';
      case 'delivered':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder-product.png';
    event.target.onerror = null;
  }
}
