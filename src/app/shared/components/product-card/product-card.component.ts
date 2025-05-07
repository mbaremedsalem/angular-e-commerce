// // product-card.component.ts
// import { Component, Input } from '@angular/core';
// import { Product } from '../../../core/models/product.model';

// @Component({
//   selector: 'app-product-card',
//   templateUrl: './product-card.component.html',
//   styleUrls: ['./product-card.component.scss']
// })
// export class ProductCardComponent {
//   @Input() product!: Product;
// }

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() viewDetails = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<Product>();
  
  showActions = false;
}