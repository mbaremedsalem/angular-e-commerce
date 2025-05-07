import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { CoreModule } from '../../core/core.module'; // Importez CoreModule
import { SharedModule } from '../../shared/shared.module'; // Importez SharedModule
import { HomeRoutingModule } from './home-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule, // Ajoutez CoreModule
    SharedModule, // Ajoutez SharedModule
    HomeRoutingModule,
    MatSnackBarModule,
    
  ]
})
export class HomeModule { }


