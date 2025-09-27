import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormHelperService } from '../../services/form-helper.service';

@Component({
  selector: 'app-resend-confirmation-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './resend-confirmation-email.html'
})
export class ResendConfirmationEmail {

  resendForm: FormGroup;
  submitted = false;

  /** constructor
   * @param userService
   * @param FormHelperService
   * @param fb
   * @param router
   */
  constructor(private readonly userService: UserService, 
    private readonly formHelperService : FormHelperService,
    private readonly fb: FormBuilder, 
    private readonly router: Router) {
    this.resendForm = this.fb.group({
      email: ['', [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/)]]
    });
  }

  /**
   * Get error message for a form control
   * @param controlName Name of the form control
   * @returns Error message string
   */
  getErrorMessage(controlName: string) {
    return this.formHelperService.getErrorMessage(this.resendForm, controlName);
  }

  /**
   * Check if a form control is invalid
   * @param controlName Name of the form control
   * @returns boolean indicating if the control is invalid
   */
  isInvalid(controlName: string): boolean {
    return this.formHelperService.isInvalid(this.resendForm, this.submitted, controlName);
  }

  /**
   * Show error message for a form control
   * @param controlName Name of the form control
   * @returns boolean indicating if the error message should be shown
   */
  hasError(controlName: string): boolean {
    return this.formHelperService.hasError(this.resendForm, this.submitted, controlName);
  }

  onSubmit() {
    // Mark the form as submitted
    this.submitted = true;

    if (this.resendForm.valid) {

      const email = this.resendForm.get('email')?.value;

      // Call the userService to resend the confirmation email
      this.userService.resendConfirmationEmail(email).subscribe({
        next: (res) => {
          if (res.error === 'max_resend_reached') {
            this.router.navigate(['/login'], { queryParams: { activated: 0, error: 'max_resend_reached' } });
          } 
          else {
            this.router.navigate(['/login'], { queryParams: { activated: 0, info: 'check_resend_email' } });
          }
        },
        error: (err) => this.router.navigate(['/registration'])
      });
    }
  }

}
