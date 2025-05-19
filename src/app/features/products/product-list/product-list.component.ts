import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CartService } from 'src/app/core/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() products: Product[] = [];
  @Input() isLoading = false;
  @Input() title = 'Nos Produits';
  @Input() showViewAll = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadProducts('Laptops');
    this.translate.onLangChange.subscribe(() => {
      this.loadProducts('Laptops');
    });
  }

  loadProducts(category: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProductsByCategory(category).subscribe({
      next: (response) => {
        this.products = response.results;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = this.translate.instant('PRODUCT.ERROR_LOADING');
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onAddToCart(product: Product): void {
    const productName = this.translate.currentLang === 'ar' 
      ? (product.name_ar || product.name)
      : (product.name_fr || product.name);
    
    const cartItem = {
      product: product.id,
      quantity: 1,
      name: productName,
      price: parseFloat(product.price),
      image: product.images?.[0]?.image || ''
    };
  
    this.cartService.addToCart(cartItem);
  
    this.snackBar.open(
      this.translate.instant('PRODUCT.ADDED_TO_CART', { name: productName }),
      this.translate.instant('PRODUCT.CLOSE'),
      {
        duration: 3000,
        panelClass: ['success-snackbar']
      }
    );
  }

  // ... autres méthodes ...
    onViewDetails(productId: number) {
    this.router.navigate(['/products', productId]);
  }
}