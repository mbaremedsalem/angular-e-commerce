import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { CoreModule } from '../../core/core.module'; // Importez CoreModule
import { SharedModule } from '../../shared/shared.module'; // Importez SharedModule
import { HomeRoutingModule } from './home-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule, // Ajoutez CoreModule
    SharedModule, // Ajoutez SharedModule
    HomeRoutingModule,
    MatSnackBarModule,
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
export class HomeModule { }


