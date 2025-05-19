// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CartService } from '../../services/cart.service';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.scss']
// })
// export class CheckoutComponent implements OnInit {
//   checkoutForm: FormGroup;
//   isLoading = false;
//   error: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private cartService: CartService,
    
//     public router: Router, 
//     private authService: AuthService
//   ) {
//     this.checkoutForm = this.fb.group({
//       street_fr: ['', Validators.required],
//       street_ar: ['', Validators.required],
//       city_fr: ['', Validators.required],
//       city_ar: ['', Validators.required],
//       state_fr: ['', Validators.required],
//       state_ar: ['', Validators.required],
//       zip_code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
//       phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
//       country: ['', Validators.required]
//     });
//   }

//   ngOnInit(): void {
//     if (!this.authService.isLoggedIn$) {
//       this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
//       return;
//     }

//     if (this.cartService.getTotalItems() === 0) {
//       this.router.navigate(['/cart']);
//     }
//   }

//   onSubmit(): void {
//     if (this.checkoutForm.invalid) {
//       return;
//     }

//     this.isLoading = true;
//     this.error = null;

//     this.cartService.placeOrder(this.checkoutForm.value).subscribe(
//       (order) => {
//         this.cartService.clearCart();
//         this.router.navigate(['/order-confirmation', order.id]);
//       },
//       (error) => {
//         this.error = 'Une erreur est survenue lors de la commande. Veuillez réessayer.';
//         this.isLoading = false;
//       }
//     );
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  isLoggedIn$: Observable<boolean>;
  currentLang: string;
  
  private langChangeSub: Subscription;
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    public router: Router,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentLang = this.translate.currentLang;
    this.checkoutForm = this.fb.group({
      street_fr: ['', Validators.required],
      street_ar: [''],
      city_fr: ['', Validators.required],
      city_ar: [''],
      state_fr: ['', Validators.required],
      state_ar: [''],
      zip_code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      // phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      phone: ['', [Validators.required,Validators.pattern(/^\d{8,9}$/) ]],
      country: ['', Validators.required]
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(lang => {
      this.currentLang = lang.lang;
    });
    // Activer la traduction automatique
    this.setupAutoTranslation();
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

  private setupAutoTranslation(): void {
    // Traduction automatique fr -> ar
    this.checkoutForm.get('street_fr')?.valueChanges.subscribe(value => {
      if (this.translate.currentLang === 'fr' && value) {
        this.translate.get(value).subscribe(translated => {
          this.checkoutForm.get('street_ar')?.setValue(translated, { emitEvent: false });
        });
      }
    });

    this.checkoutForm.get('city_fr')?.valueChanges.subscribe(value => {
      if (this.translate.currentLang === 'fr' && value) {
        this.translate.get(value).subscribe(translated => {
          this.checkoutForm.get('city_ar')?.setValue(translated, { emitEvent: false });
        });
      }
    });

    this.checkoutForm.get('state_fr')?.valueChanges.subscribe(value => {
      if (this.translate.currentLang === 'fr' && value) {
        this.translate.get(value).subscribe(translated => {
          this.checkoutForm.get('state_ar')?.setValue(translated, { emitEvent: false });
        });
      }
    });

    // Traduction automatique ar -> fr
    this.checkoutForm.get('street_ar')?.valueChanges.subscribe(value => {
      if (this.translate.currentLang === 'ar' && value) {
        this.translate.get(value).subscribe(translated => {
          this.checkoutForm.get('street_fr')?.setValue(translated, { emitEvent: false });
        });
      }
    });

    this.checkoutForm.get('city_ar')?.valueChanges.subscribe(value => {
      if (this.translate.currentLang === 'ar' && value) {
        this.translate.get(value).subscribe(translated => {
          this.checkoutForm.get('city_fr')?.setValue(translated, { emitEvent: false });
        });
      }
    });

    this.checkoutForm.get('state_ar')?.valueChanges.subscribe(value => {
      if (this.translate.currentLang === 'ar' && value) {
        this.translate.get(value).subscribe(translated => {
          this.checkoutForm.get('state_fr')?.setValue(translated, { emitEvent: false });
        });
      }
    });
  }

  // get currentLang(): string {
  //   return this.translate.currentLang;
  // }

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
        this.translate.get('CHECKOUT.ERROR').subscribe(translatedError => {
          this.error = translatedError;
        });
        this.isLoading = false;
      }
    );
  }
}