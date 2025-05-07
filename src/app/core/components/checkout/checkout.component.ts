import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    
    public router: Router, 
    private authService: AuthService
  ) {
    this.checkoutForm = this.fb.group({
      street_fr: ['', Validators.required],
      street_ar: ['', Validators.required],
      city_fr: ['', Validators.required],
      city_ar: ['', Validators.required],
      state_fr: ['', Validators.required],
      state_ar: ['', Validators.required],
      zip_code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      country: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn$) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    if (this.cartService.getTotalItems() === 0) {
      this.router.navigate(['/cart']);
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.cartService.placeOrder(this.checkoutForm.value).subscribe(
      (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation', order.id]);
      },
      (error) => {
        this.error = 'Une erreur est survenue lors de la commande. Veuillez réessayer.';
        this.isLoading = false;
      }
    );
  }
}