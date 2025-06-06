// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from 'src/app/core/services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   loginForm: FormGroup;
//   isLoading = false;
//   errorMessage: string | null = null;
//   returnUrl: string;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {
//     this.loginForm = this.fb.group({
//       username: ['', [Validators.required, Validators.email]],
//       password: ['', Validators.required],
//       rememberMe: [false]
//     });

//     // Récupère l'URL de redirection ou utilise '/home' par défaut
//     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
//   }

//   onSubmit(): void {
//     if (this.loginForm.invalid) {
//       this.markFormGroupTouched(this.loginForm);
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = null;

//     const { username, password, rememberMe } = this.loginForm.value;

//     this.authService.login(username, password, rememberMe).subscribe({
//       next: () => {
//         this.router.navigateByUrl(this.returnUrl);
//       },
//       error: (err) => {
//         this.errorMessage = err.error?.detail || 'Identifiants incorrects';
//         this.isLoading = false;
//       }
//     });
//   }

//   private markFormGroupTouched(formGroup: FormGroup): void {
//     Object.values(formGroup.controls).forEach(control => {
//       control.markAsTouched();

//       if (control instanceof FormGroup) {
//         this.markFormGroupTouched(control);
//       }
//     });
//   }
// }


import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  currentLang: string;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang;
    
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { username, password, rememberMe } = this.loginForm.value;

    this.authService.login(username, password, rememberMe).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.translate.get('LOGIN.ERROR').subscribe(translatedError => {
          this.errorMessage = translatedError;
        });
        this.isLoading = false;
      }
    });
  }

  // get dir(): string {
  //   return this.translate.currentLang === 'ar' ? 'rtl' : 'ltr';
  // }

  get dir(): 'ltr' | 'rtl' | 'auto' {
  return this.translate.currentLang === 'ar' ? 'rtl' : 'ltr';
}

}