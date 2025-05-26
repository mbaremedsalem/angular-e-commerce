// // footer.component.ts
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-footer',
//   templateUrl: './footer.component.html',
//   styleUrls: ['./footer.component.scss'],
// })
// export class FooterComponent {
//   currentYear = new Date().getFullYear();

// subscribe() {
//   // logique de soumission ou appel API
//   alert("Merci pour votre inscription !");
// }

// }

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(public translate: TranslateService) {}

  subscribe() {
    // Logique d'abonnement
  }

  get dir(): string {
    return this.translate.currentLang === 'ar' ? 'rtl' : 'ltr';
  }
} 