import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<any[]>;
  totalPrice = 0;
  totalItems = 0;
  isCheckingOut = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    this.cartItems$.subscribe(items => {
      this.totalItems = this.cartService.getTotalItems();
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, event: any): void {
    const quantity = parseInt(event.target.value, 10);
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn$) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}