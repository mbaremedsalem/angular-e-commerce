// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class LanguageService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLang = 'ar'; // ou 'ar'

  setLanguage(lang: string) {
    this.currentLang = lang;
  }

  getLanguage(): string {
    return this.currentLang;
  }
}
