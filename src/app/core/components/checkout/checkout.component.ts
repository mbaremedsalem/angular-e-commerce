import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService,
    public router: Router, 
    private authService: AuthService
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
      phone: ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]],
      country: ['', Validators.required]
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(lang => {
      this.currentLang = lang.lang;
    });
    // this.checkoutForm = this.fb.group({
    //   street_fr: ['', Validators.required],
    //   street_ar: ['', Validators.required],
    //   city_fr: ['', Validators.required],
    //   city_ar: ['', Validators.required],
    //   state_fr: ['', Validators.required],
    //   state_ar: ['', Validators.required],
    //   zip_code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    //   phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
    //   country: ['', Validators.required]
    // });
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









// =======

// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CartService } from '../../services/cart.service';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { TranslateService } from '@ngx-translate/core';
// import { Observable, Subscription } from 'rxjs';
// import { CartItem } from '../../models/cart.model';




// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.component.html',
//   styleUrls: ['./checkout.component.scss']
// })
// export class CheckoutComponent implements OnInit, OnDestroy {
//   checkoutForm: FormGroup;
//   isLoading = false;
//   error: string | null = null;
//   isLoggedIn$: Observable<boolean>;
//   currentLang: string;
//   cartItems: CartItem[] = [];
  
//   private langChangeSub: Subscription;

//   constructor(
//     private fb: FormBuilder,
//     private cartService: CartService,
//     public router: Router,
//     private authService: AuthService,
//     private translate: TranslateService
//   ) {
//     this.isLoggedIn$ = this.authService.isLoggedIn$;
//     this.currentLang = this.translate.currentLang;
    
//     this.checkoutForm = this.fb.group({
//       street_fr: ['', Validators.required],
//       street_ar: [''],
//       city_fr: ['', Validators.required],
//       city_ar: [''],
//       state_fr: ['', Validators.required],
//       state_ar: [''],
//       zip_code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
//       phone: ['', [Validators.required, Validators.pattern(/^\d{8,9}$/)]],
//       country: ['', Validators.required]
//     });

//     this.langChangeSub = this.translate.onLangChange.subscribe(lang => {
//       this.currentLang = lang.lang;
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

//     // this.cartItems = this.cartService.getCartItems();
//   }

//   ngOnDestroy(): void {
//     if (this.langChangeSub) {
//       this.langChangeSub.unsubscribe();
//     }
//   }

//   prepareOrderData() {
//     const formValue = this.checkoutForm.value;
//     const orderItems = this.cartItems.map(item => ({
//       product: item.productId,
//       quantity: item.quantity
//     }));

//     return {
//       orderItems,
//       street_fr: formValue.street_fr,
//       street_ar: formValue.street_ar,
//       city_fr: formValue.city_fr,
//       city_ar: formValue.city_ar,
//       state_fr: formValue.state_fr,
//       state_ar: formValue.state_ar,
//       zip_code: formValue.zip_code,
//       phone: `+222${formValue.phone}`, // Ajoute le préfixe +222
//       country: formValue.country
//     };
//   }
// onSubmit(): void {
//   if (this.checkoutForm.invalid) {
//     console.log('🛑 Formulaire invalide :', this.checkoutForm.errors);
//     return;
//   }

//   this.isLoading = true;
//   this.error = null;

//   const formValue = this.checkoutForm.value;
//   console.log('📋 Valeurs du formulaire :', formValue);

//   const orderData = this.prepareOrderData();
//   console.log('📦 Données complètes de la commande envoyée :', orderData);

//   this.cartService.placeOrder(orderData).subscribe(
//     (order) => {
//       console.log('✅ Commande passée avec succès :', order);
//       this.cartService.clearCart();
//       this.router.navigate(['/order-confirmation', order.id]);
//     },
//     (error) => {
//       console.error('❌ Erreur lors de la commande :', error);
//       this.translate.get('CHECKOUT.ERROR').subscribe(translatedError => {
//         this.error = translatedError;
//       });
//       this.isLoading = false;
//     }
//   );
// }


// }


