import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  categories: Category[] = [];
  isMenuOpen = false;
  isMobileMenuOpen = false;
  cartItemCount = 0;
  searchQuery = '';
  isLoggedIn$: Observable<boolean>;
  currentLang: string= 'ar';
  supportedLangs = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router,
    private translate: TranslateService
  ) {

    this.isLoggedIn$ = this.authService.isLoggedIn$;
    // Définit la langue par défaut à 'ar' si aucune n'est définie
    this.currentLang = this.translate.currentLang || 'ar';
    this.translate.setDefaultLang('ar'); // Ajoutez cette ligne
  }

  ngOnInit(): void {
  
    const savedLang = localStorage.getItem('userLanguage') || 'ar';
    this.translate.use(savedLang);
    this.currentLang = savedLang;
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

    this.loadCategories();
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }
  
  forceReload(id: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/category', id]);
    });
  }


  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories: Category[]) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  getCategoryName(category: Category): string {
    return this.currentLang === 'ar' ? category.name_ar : category.name_fr;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  search(): void {
    if (this.searchQuery.trim()) {
      // Implémentez la logique de recherche ici
      console.log('Searching for:', this.searchQuery);
    }
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('userLanguage', lang);
  
    // ✅ Mettre à jour la direction
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
  
}