import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { TranslateService } from '@ngx-translate/core';

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
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;
    this.translate.onLangChange.subscribe(lang => {
      this.currentLang = lang.lang;
    });
  }

  getProductName(): string {
    // Retourne name_ar si la langue est arabe, sinon name_fr ou name par défaut
    return this.currentLang === 'ar' 
      ? this.product.name_ar || this.product.name
      : this.product.name_fr || this.product.name;
  }

  getProductDescription(): string {
    // Même logique pour la description
    return this.currentLang === 'ar'
      ? this.product.description_ar || this.product.description
      : this.product.description_fr || this.product.description;
  }

  getButtonText(key: string): string {
    return this.translate.instant(`PRODUCT.${key}`);
  }
}