import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.scss']
})
export class CategoryProductsComponent implements OnInit {
  products: any[] = [];
  categoryId: string | null = null;
  isLoading = true;
  error: string | null = null;
  hoveredProductId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cartService:CartService,
    private snackBar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoryId = id;
        this.fetchCategoryProducts(id);
      }
    });
  }
  
  fetchCategoryProducts(categoryId: string): void {
    this.isLoading = true;
    this.error = null;
    
    const apiUrl = `${environment.domain}/api/categories/${categoryId}/products/`;
    
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        if (response.status) {
          this.products = response.data;
          
        } else {
          this.error = response.message || 'Erreur lors du chargement des produits';
        }
        this.isLoading = false;
        
      },
      (error) => {
        this.error = 'Erreur de connexion au serveur';
        this.isLoading = false;
        console.error('Error fetching products:', error);
      }
    );
  }

  setHover(productId: number, isHovered: boolean): void {
    this.hoveredProductId = isHovered ? productId : null;
  }

  ViewDetails(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  addToCart(product: Product): void {
    const cartItem = {
      product: product.id,
      quantity: 1,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0]?.image || ''
    };
  
    this.cartService.addToCart(cartItem);
  
    this.snackBar.open(`${product.name} ajouté au panier`, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}