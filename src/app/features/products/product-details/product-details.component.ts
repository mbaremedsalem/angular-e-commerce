// import { Component } from '@angular/core';

// @Component({
  // selector: 'app-product-details',
  // templateUrl: './product-details.component.html',
  // styleUrls: ['./product-details.component.scss']
// })
// export class ProductDetailsComponent {

// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  isLoading = true;
  error: string | null = null;
  activeImageIndex = 0;
  reviewForm: FormGroup;
  isSubmittingReview = false;
  reviewError: string | null = null;
  reviewSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(+productId);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getProduct(id).subscribe({
      next: (response) => {
        this.product = response.product;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details';
        this.isLoading = false;
        console.error('Error loading product:', err);
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.product) return;

    this.isSubmittingReview = true;
    this.reviewError = null;
    this.reviewSuccess = false;

    const { rating, comment } = this.reviewForm.value;

    this.productService.submitReview(this.product.id, rating, comment).subscribe({
      next: () => {
        this.reviewSuccess = true;
        this.reviewForm.reset();
        this.loadProduct(this.product.id); // Recharger les données du produit
      },
      error: (err) => {
        this.reviewError = err.error?.detail || 'Failed to submit review';
      },
      complete: () => {
        this.isSubmittingReview = false;
      }
    });
  }

  get isAuthenticated(): any {
    return this.authService.isLoggedIn$;
  }
}