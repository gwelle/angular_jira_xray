import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { getErrorMessage } from '../../utils/form-errors';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './registration.html'
})
export class Registration {

  // Define any properties or methods needed for registration
  registrationForm: FormGroup;
  submitted = false;


  /**
   * constructor
   * @param userService
   * @param fb
   * @param router
   */
  constructor(private readonly userService: UserService, private readonly fb: FormBuilder, 
    private readonly router: Router) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/)]],
      plainPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
    });
  }

  /**
   * Handle form submission
   * @returns void
   */
  onSubmit() {
    // Mark the form as submitted
    this.submitted = true;

    if (this.registrationForm.valid) {
      // Form is valid, proceed with registration
      const user = {
        email: this.registrationForm.get('email')?.value,
        plainPassword: this.registrationForm.get('plainPassword')?.value,
        confirmPassword: this.registrationForm.get('confirmPassword')?.value,
        firstName: (() => {
          // Capitalize the first letter of the first name
          const value = this.registrationForm.get('firstName')?.value || '';
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        })(),
        lastName: this.registrationForm.get('lastName')?.value.toUpperCase()
      };

      // Call the user service to register the user
      this.userService.register(user).subscribe({
        next: (response) => {
          // Navigate to the login page
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse | any) => {
          if (err.status === 422 && err.error.violations) {
            const emailViolation = err.error.violations.find((v: any) => v.propertyPath === 'email');
            if (emailViolation) {
              // ici tu peux mettre à jour un FormControl pour montrer l'erreur
              this.registrationForm.get('email')?.setErrors({ alreadyExists: true });
              return;
            }
          }
        }
      })
    } 
    else {
      return;
    }
  }

  /**
   * Get error message for a form control
   * @param controlName Name of the form control
   * @returns Error message string
   */
  getErrorMessage(controlName: string) {
    return getErrorMessage(this.registrationForm, controlName);
  }

  /**
   * Check if a form control is invalid
   * @param controlName Name of the form control
   * @returns boolean indicating if the control is invalid
   */
  isInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return this.submitted && control?.errors ? true : false;
  }

  /**
   * Show error message for a form control
   * @param controlName Name of the form control
   * @returns boolean indicating if the error message should be shown
   */
  hasError(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return this.submitted && !!control?.errors;
  }
}
