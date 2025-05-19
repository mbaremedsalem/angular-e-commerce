// // translation.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// // Définir le type pour les clés de traduction
// type TranslationKeys = 'searchPlaceholder' | 'account' | 'login' | 'signup' | 'profile' | 'logout' | 'cart';

// // Interface pour les traductions
// interface TranslationDictionary {
//   [key: string]: string; // Permet d'indexer avec n'importe quelle chaîne
// }

// interface LanguageTranslations {
//   fr: TranslationDictionary;
//   ar: TranslationDictionary;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TranslationService {
//   private currentLanguage = new BehaviorSubject<'fr' | 'ar'>('fr');
//   currentLanguage$ = this.currentLanguage.asObservable();

//   private translations: LanguageTranslations = {
//     fr: {
//       searchPlaceholder: 'Rechercher des produits...',
//       account: 'Mon Compte',
//       login: 'Connexion',
//       signup: 'S\'inscrire',
//       profile: 'Profil',
//       logout: 'Déconnexion',
//       cart: 'Panier'
//     },
//     ar: {
//       searchPlaceholder: 'ابحث عن المنتجات...',
//       account: 'حسابي',
//       login: 'تسجيل الدخول',
//       signup: 'تسجيل',
//       profile: 'الملف الشخصي',
//       logout: 'تسجيل الخروج',
//       cart: 'عربة التسوق'
//     }
//   };

//   setLanguage(lang: 'fr' | 'ar'): void {
//     this.currentLanguage.next(lang);
//     localStorage.setItem('preferredLanguage', lang);
//   }

//   getTranslation(key: TranslationKeys): string {
//     const lang = this.currentLanguage.value;
//     return this.translations[lang][key] || key;
//   }

//   getCurrentLanguage(): 'fr' | 'ar' {
//     return this.currentLanguage.value;
//   }

//   constructor() {
//     const savedLang = localStorage.getItem('preferredLanguage');
//     if (savedLang === 'fr' || savedLang === 'ar') {
//       this.currentLanguage.next(savedLang);
//     }
//   }
// }


// translation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage: 'fr' | 'ar' = 'fr';

  constructor(private http: HttpClient) {}

  getCurrentLanguage(): 'fr' | 'ar' {
    return this.currentLanguage;
  }

  setCurrentLanguage(lang: 'fr' | 'ar'): void {
    this.currentLanguage = lang;
  }

  async translate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    // Implémentation de base - à remplacer par un vrai service de traduction
    if (sourceLang === 'fr' && targetLang === 'ar') {
      // Simuler une traduction française-arabe
      return `[AR: ${text}]`; // Remplacer par un appel API réel
    } else if (sourceLang === 'ar' && targetLang === 'fr') {
      // Simuler une traduction arabe-française
      return `[FR: ${text}]`; // Remplacer par un appel API réel
    }
    return text;
  }
}