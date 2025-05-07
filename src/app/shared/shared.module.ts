// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ProductCardComponent } from './components/product-card/product-card.component';
// import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
// import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';



// @NgModule({
//   declarations: [
//     ProductCardComponent,
//     RatingStarsComponent,
//     LoadingSpinnerComponent
//   ],
//   imports: [
//     CommonModule
//   ]
// })
// export class SharedModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ProductListComponent } from '../features/products/product-list/product-list.component';
import { HeaderComponent } from '../core/components/header/header.component';
import { FooterComponent } from '../core/components/footer/footer.component';

@NgModule({
  declarations: [
    ProductCardComponent,
    RatingStarsComponent,
    LoadingSpinnerComponent,
    ProductListComponent,

  ],
  imports: [
    CommonModule,
    
  ],
  exports: [
    ProductCardComponent,
    RatingStarsComponent,
    LoadingSpinnerComponent,
    ProductListComponent,
  
  ]
})
export class SharedModule { }