import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProfileComponent } from './core/components/profile/profile.component';
import { CheckoutComponent } from './core/components/checkout/checkout.component';
import { OrderConfirmationComponent } from './core/components/order-confirmation/order-confirmation.component';
import { OrderComponent } from './core/components/order/order.component';
import { OrderDetailsComponent } from './core/components/order-details/order-details.component';
import { CategoryProductsComponent } from './core/components/category-products/category-products.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'products', component: ProductListComponent },
  
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
  { path: 'orders', component: OrderComponent },
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: 'category/:id', component: CategoryProductsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
  
  { 
    path: 'products', 
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule) 
  },
  { 
    path: 'cart', 
    loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule) ,
    canActivate: [AuthGuard]
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }