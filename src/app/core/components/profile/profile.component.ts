
import { Component, OnInit } from '@angular/core';
import { UserService, UserProfile } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup | null = null;
  userProfile: UserProfile | null = null;
  isEditing = false;
  isLoading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  createForm(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: [''],
      address: ['']
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe(
      (profile) => {
        this.userProfile = profile;
        this.profileForm?.patchValue(profile);
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Erreur lors du chargement du profil';
        this.isLoading = false;
      }
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.profileForm?.enable();
    } else {
      this.profileForm?.disable();
      this.profileForm?.patchValue(this.userProfile!);
    }
  }

  onSubmit(): void {
    if (this.profileForm?.invalid) {
      return;
    }

    this.isLoading = true;
    this.userService.updateProfile(this.profileForm?.value).subscribe(
      (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.isEditing = false;
        this.profileForm?.disable();
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Erreur lors de la mise à jour du profil';
        this.isLoading = false;
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}