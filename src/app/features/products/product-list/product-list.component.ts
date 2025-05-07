import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductResponse } from '../../../core/models/product.model';
import { CartService } from 'src/app/core/services/cart.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  // products: any[] = []; // Use proper type here
  // isLoading = true;
  error: string | null = null;
// start----

@Input() products: Product[] = [];
@Input() isLoading = false;
@Input() title = 'Nos Produits';
@Input() showViewAll = false;

// end -----
  constructor(private productService: ProductService,private cartService:CartService,private router: Router,private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadProducts('Laptops');
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
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onViewDetails(productId: number) {
    this.router.navigate(['/products', productId]);
  }
  
  // onAddToCart(product: Product) {
  //   this.cartService.addToCart(product);
  //   this.snackBar.open(`${product.name} ajouté au panier`, 'Fermer', {
  //     duration: 3000,
  //     panelClass: ['success-snackbar']
  //   });
  // }

  onAddToCart(product: Product): void {
    const cartItem = {
      product: product.id,
      quantity: 1,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0]?.image || ''
    };
  
    this.cartService.addToCart(cartItem);
  
    this.snackBar.open(`${product.name} ajouté au panier`, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  

  
}