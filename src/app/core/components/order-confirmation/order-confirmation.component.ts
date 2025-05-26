// order-confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  order: any;
  isLoading = true;
  error: string | null = null;
  public apiUrl = `${environment.domain}`

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(+orderId).subscribe(
        (response) => {
          this.order = response.order;
          this.isLoading = false;
        },
        (error) => {
          this.error = 'Impossible de charger les détails de la commande';
          this.isLoading = false;
        }
      );
    }
  }
}