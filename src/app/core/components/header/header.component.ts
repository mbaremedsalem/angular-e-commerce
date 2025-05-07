// header.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';

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

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private categoryService: CategoryService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
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
}