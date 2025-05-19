// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { ProductsRoutingModule } from './products-routing.module';
// import { ProductsComponent } from './products.component';
// import { ProductListComponent } from './product-list/product-list.component';
// import { ProductDetailsComponent } from './product-details/product-details.component';


// @NgModule({
//   declarations: [
//     ProductsComponent,
//     ProductListComponent,
//     ProductDetailsComponent
//   ],
//   imports: [
//     CommonModule,
//     ProductsRoutingModule
//   ]
// })
// export class ProductsModule { }



import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CoreModule } from 'src/app/core/core.module';
import { ProductsComponent } from './products.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';

@NgModule({
  declarations: [
    ProductDetailsComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterModule,
    CoreModule, // Ajoutez CoreModule
    SharedModule, // Ajoutez SharedModule
    HttpClientModule,
    TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
  ]
})
export class ProductsModule { }
