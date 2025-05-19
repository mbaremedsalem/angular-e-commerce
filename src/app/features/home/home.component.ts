import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { Category } from 'src/app/core/models/category.model';
import { ProductService } from 'src/app/core/services/product.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { BannerService } from 'src/app/core/services/banner.service';
import { interval, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  featuredCategories: Category[] = [];
  banners: any[] = [];
  currentBannerIndex = 0;
  homeProductsLoading = true;
  bannersLoading = true;
  isLoggedIn$: Observable<boolean> | undefined;
  currentLang: string= 'fr';
  supportedLangs = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' }
  ];
  private bannerInterval!: Subscription;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private bannerService: BannerService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.currentLang = this.translate.currentLang || 'fr';
  }

  ngOnInit(): void {
    this.currentLang = this.translate.currentLang;
    this.loadFeaturedProducts();
    this.loadFeaturedCategories();
    this.loadBanners();
  }

  ngOnDestroy(): void {
    if (this.bannerInterval) {
      this.bannerInterval.unsubscribe();
    }
  }

  loadFeaturedProducts(): void {
    this.productService.getProductsByCategory('featured').subscribe({
      next: (response) => {
        this.featuredProducts = response.results.slice(0, 4);
        this.homeProductsLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.homeProductsLoading = false;
      }
    });
  }

  loadFeaturedCategories(): void {
    this.categoryService.getFeaturedCategories(4).subscribe({
      next: (categories) => {
        this.featuredCategories = categories;
      },
      error: (err) => {
        console.error('Erreur API catégories:', err);
      }
    });
  }

  loadBanners(): void {
    this.bannerService.getBanners().subscribe({
      next: (response) => {
        this.banners = response.data;
        this.bannersLoading = false;
        
        // Start banner rotation if we have multiple banners
        if (this.banners.length > 1) {
          this.startBannerRotation();
        }
      },
      error: (err) => {
        console.error('Failed to load banners', err);
        this.bannersLoading = false;
        // Fallback to default banner if API fails
        this.banners = [{
          image: '/assets/images/hero-bg.jpg',
          category: null,
          product: null
        }];
      }
    });
  }

  startBannerRotation(): void {
    this.bannerInterval = interval(5000).subscribe(() => {
      this.nextBanner();
    });
  }

  nextBanner(): void {
    this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
  }

  selectBanner(index: number): void {
    this.currentBannerIndex = index;
    // Reset the timer when user manually selects a banner
    if (this.bannerInterval) {
      this.bannerInterval.unsubscribe();
      this.startBannerRotation();
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