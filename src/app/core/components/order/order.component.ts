// // orders.component.ts
// import { Component, OnInit } from '@angular/core';
// import { OrderService } from '../../services/order.service';


// @Component({
//   selector: 'app-orders',
//   templateUrl: './order.component.html',
//   styleUrls: ['./order.component.scss']
// })
// export class OrderComponent implements OnInit {
//   orders: any[] = [];
//   loading = true;

//   constructor(private orderService: OrderService) {}

//   ngOnInit() {
//     this.orderService.getOrders().subscribe(
//       (orders) => {
//         // this.orders = orders!;
//         this.loading = false;
//       },
//       (error) => {
//         this.loading = false;
//         console.error('Error fetching orders:', error);
//       }
//     );
//   }
// }


// orders.component.ts
import { Component, OnInit } from '@angular/core';
import { Order, OrderResponse, OrderService} from '../../services/order.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-orders',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit  {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(page = 1): void {
    this.loading = true;
    this.error = null;
    this.currentPage = page;

    this.orderService.getOrders().subscribe({
      next: (response: OrderResponse) => {
        this.orders = response.results;
        // Calculate total pages based on count (assuming 10 items per page)
        this.totalPages = Math.ceil(response.count / 10);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        console.error('Error loading orders:', err);
      }
    });
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
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder-product.png';
    event.target.onerror = null; // Prevent infinite loop if placeholder also fails
  }
}