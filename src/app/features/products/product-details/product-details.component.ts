// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ProductService } from 'src/app/core/services/product.service';
// import { CartService } from 'src/app/core/services/cart.service';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { TranslateService } from '@ngx-translate/core';
// import { Observable } from 'rxjs';

// interface Product {
//   id: number;
//   name: string;
//   name_fr?: string;
//   name_ar?: string;
//   description: string;
//   description_fr?: string;
//   description_ar?: string;
//   price: string;
//   old_price: string | null;
//   brand: string;
//   category: number;
//   ratings: string;
//   stock: number;
//   sizes: { id: number, code: string }[];
//   colors: { id: number, name: string, hex_code: string }[];
//   images: { id: number, image: string, product: number }[];
//   reviews: {
//     id: number;
//     rating: number;
//     comment: string;
//     createedAt: string;
//     product: number;
//     user: number;
//     user_name?: string;
//   }[];
// }

// @Component({
//   selector: 'app-product-details',
//   templateUrl: './product-details.component.html',
//   styleUrls: ['./product-details.component.scss']
// })
// export class ProductDetailsComponent implements OnInit {
//   product: Product | null = null;
//   isLoading = true;
//   error: string | null = null;
//   activeImageIndex = 0;
//   selectedSize: string | null = null;
//   selectedColor: string | null = null;
//   quantity = 1;
//   isLoggedIn$: Observable<boolean>;
//   currentLang: string;
  
//   reviewForm: FormGroup;
//   isSubmittingReview = false;
//   reviewError: string | null = null;
//   reviewSuccess = false;

//   constructor(
//     private route: ActivatedRoute,
//     private productService: ProductService,
//     private cartService: CartService,
//     private authService: AuthService,
//     private fb: FormBuilder,
//     private translate: TranslateService
//   ) {
    
//     this.isLoggedIn$ = this.authService.isLoggedIn$;
//     this.currentLang = this.translate.currentLang || 'fr';


//     this.reviewForm = this.fb.group({
//       rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
//       comment: ['', [Validators.required, Validators.minLength(10)]]
//     });
//   }

//   ngOnInit(): void {
//     this.currentLang = this.translate.currentLang;
//     const productId = this.route.snapshot.paramMap.get('id');
//     if (productId) {
//       this.loadProduct(+productId);
//     }
//   }

//   loadProduct(id: number): void {
//     this.isLoading = true;
//     this.error = null;

//     this.productService.getProduct(id).subscribe({
//       next: (response) => {
//         this.product = response.product;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.error = this.translate.instant('PRODUCT.ERROR_LOADING');
//         this.isLoading = false;
//         console.error('Error loading product:', err);
//       }
//     });
//   }

//   getTranslatedText(key: 'name' | 'description'): string {
//     if (!this.product) return '';
    
//     const translatedKey = `${key}_${this.currentLang}` as keyof Product;
//     return (this.product[translatedKey] as string) || this.product[key];
//   }

//   getTranslatedStockMessage(): string {
//     if (!this.product) return '';
    
//     if (this.product.stock > 0) {
//       return this.currentLang === 'ar' 
//         ? `متوفر (${this.product.stock} متبقي)` 
//         : `En stock (${this.product.stock} disponibles)`;
//     } else {
//       return this.currentLang === 'ar' ? 'نفذ من المخزون' : 'Rupture de stock';
//     }
//   }


//   addToCart(): void {
//     if (this.product) {
//       const productName = this.currentLang === 'ar' 
//         ? this.product.name_ar || this.product.name
//         : this.product.name_fr || this.product.name;
      
//       const cartItem = {
//         product: this.product.id,
//         quantity: this.quantity,
//         name: productName,
//         price: parseFloat(this.product.price),
//         image: this.product.images?.[0]?.image || ''
//       };
  
//       this.cartService.addToCart(cartItem);
//     }
//   }




//   setActiveImage(index: number): void {
//     this.activeImageIndex = index;
//   }

//   selectSize(size: string): void {
//     this.selectedSize = size;
//   }

//   selectColor(color: string): void {
//     this.selectedColor = color;
//   }

//   submitReview(): void {
//     if (this.reviewForm.invalid || !this.product) return;

//     this.isSubmittingReview = true;
//     this.reviewError = null;
//     this.reviewSuccess = false;

//     const { rating, comment } = this.reviewForm.value;

//     this.productService.submitReview(this.product.id, rating, comment).subscribe({
//       next: () => {
//         this.reviewSuccess = true;
//         this.reviewForm.reset();
//         this.loadProduct(this.product!.id);
//       },
//       error: (err) => {
//         this.reviewError = err.error?.detail || 'Failed to submit review';
//         this.isSubmittingReview = false;
//       }
//     });
//   }

//   get isAuthenticated(): any {
//     return this.authService.isLoggedIn$;
//   }
//   get numericRating(): number {
//     return this.product ? parseFloat(this.product.ratings) : 0;
//   }

//   incrementQuantity(): void {
//     if (this.product && this.quantity < this.product.stock) {
//       this.quantity++;
//     }
//   }

//   decrementQuantity(): void {
//     if (this.quantity > 1) {
//       this.quantity--;
//     }
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Product {
  id: number;
  name: string;
  name_fr?: string;
  name_ar?: string;
  description: string;
  description_fr?: string;
  description_ar?: string;
  price: string;
  old_price: string | null;
  brand: string;
  category: number;
  ratings: string;
  stock: number;
  sizes: { id: number, code: string }[];
  colors: { id: number, name: string, hex_code: string }[];
  images: { id: number, image: string, product: number }[];
  reviews: {
    id: number;
    rating: number;
    comment: string;
    createedAt: string;
    product: number;
    user: number;
    user_name?: string;
  }[];
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;
  activeImageIndex = 0;
  selectedSize: string | null = null;
  selectedColor: string | null = null;
  quantity = 1;
  isLoggedIn$: Observable<boolean>;
  currentLang: string;
  
  reviewForm: FormGroup;
  isSubmittingReview = false;
  reviewError: string | null = null;
  reviewSuccess = false;

  private langChangeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentLang = this.translate.currentLang;

    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(lang => {
      this.currentLang = lang.lang;
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(+productId);
    }
  }

  ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
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
        this.error = this.translate.instant('PRODUCT.ERROR_LOADING');
        this.isLoading = false;
        console.error('Error loading product:', err);
      }
    });
  }

  getTranslatedText(key: 'name' | 'description'): string {
    if (!this.product) return '';
    
    const translatedKey = `${key}_${this.currentLang}` as keyof Product;
    return (this.product[translatedKey] as string) || this.product[key];
  }

  getTranslatedStockMessage(): string {
    if (!this.product) return '';
    
    if (this.product.stock > 0) {
      return this.translate.instant('PRODUCT.IN_STOCK', { count: this.product.stock });
    }
    return this.translate.instant('PRODUCT.OUT_OF_STOCK');
  }

  addToCart(): void {
    if (!this.product) return;

    const cartItem = {
      product: this.product.id,
      quantity: this.quantity,
      name: this.getTranslatedText('name'),
      price: parseFloat(this.product.price),
      image: this.product.images?.[0]?.image || '',
      size: this.selectedSize,
      color: this.selectedColor
    };

    this.cartService.addToCart(cartItem);

    this.translate.get(['PRODUCT.ADDED_TO_CART', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(
        `${translations['PRODUCT.ADDED_TO_CART']}: ${cartItem.name}`,
        translations['COMMON.CLOSE'],
        { duration: 3000 }
      );
    });
  }

  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
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
        this.loadProduct(this.product!.id);
      },
      error: (err) => {
        this.reviewError = err.error?.detail || this.translate.instant('PRODUCT.REVIEW_ERROR');
      },
      complete: () => {
        this.isSubmittingReview = false;
      }
    });
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  get isAuthenticated(): any {
    return this.authService.isLoggedIn$;
  }

  get numericRating(): number {
    return this.product ? parseFloat(this.product.ratings) : 0;
  }
}