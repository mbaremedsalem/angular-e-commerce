// import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'ecommerce-app';

//   constructor(private translate: TranslateService) {
//     translate.setDefaultLang('ar'); // ✅ Langue par défaut = arabe

//     const savedLang = localStorage.getItem('userLanguage');
//     const browserLang = translate.getBrowserLang();
//     const fallbackLang = 'ar'; // ✅ on force fallback = arabe

//     // ✅ si langue enregistrée → on l'utilise ; sinon, on prend navigateur si supporté, sinon arabe
//     const finalLang = savedLang || (['fr', 'en', 'ar'].includes(browserLang || '') ? browserLang! : fallbackLang);

//     translate.use(finalLang);

//     // ✅ définir la direction selon la langue
//     document.documentElement.dir = finalLang === 'ar' ? 'rtl' : 'ltr';
//   }
// }


import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ecommerce-app';
  translationsReady = false;

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('userLanguage');
    const browserLang = translate.getBrowserLang();
    const fallbackLang = 'ar';

    const langToUse =
      savedLang || (['fr', 'en', 'ar'].includes(browserLang || '') ? browserLang! : fallbackLang);

    translate.setDefaultLang('ar');

    translate.use(langToUse).subscribe(() => {
      document.documentElement.dir = langToUse === 'ar' ? 'rtl' : 'ltr';
      this.translationsReady = true; // ✅ on affiche l'app seulement après chargement
    });
  }
}

