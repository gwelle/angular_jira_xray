import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormInterface } from '../../interfaces/form-interface';
import { FormHelperProviderInterface } from '../../tokens/global.token';
import { ResendConfirmationEmailService } from '../../services/resend-confirmation-email.service';
import { ResendConfirmationEmailProviderInterface } from '../../tokens/resend-confirmation-email.token';
import { HandlerProviderInterface } from '../../tokens/resend-confirmation-email.token';
import { ResendConfirmationEmailHandler } from '../../handlers/resend-confirmation-email.handler';

@Component({
  selector: 'app-resend-confirmation-email',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [
    { provide: ResendConfirmationEmailProviderInterface, useClass: ResendConfirmationEmailService },
    { provide: HandlerProviderInterface, useClass: ResendConfirmationEmailHandler }
  ],
  templateUrl: './resend-confirmation-email.html'
})
export class ResendConfirmationEmail implements OnInit, FormInterface {

  form!: FormGroup;
  submitted = false;
  private readonly formHelperProvider = inject(FormHelperProviderInterface);
  private readonly resendConfirmationEmailProvider = inject(ResendConfirmationEmailProviderInterface);
  private readonly handlerProvider = inject(HandlerProviderInterface);
  readonly formBuilder = inject(FormBuilder);
  readonly router = inject(Router);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/)]]
    });
  }

  /** 
   * constructor
   */
  constructor() {
    this.ngOnInit();
  }

  onSubmit() {
    // Mark the form as submitted
    this.submitted = true;

    if (this.form.valid) {

      const email = this.form.get('email')?.value;

      this.resendConfirmationEmailProvider.resendConfirmationEmail(email).subscribe({
        next: (res) => this.handlerProvider.handleResponse(res),
        error: (err) => this.handlerProvider.handleError(err)
      });
    }
  }

  /**
   * Get error message for a form control
   * @param controlName Name of the form control
   * @returns Error message string
   */
  getErrorMessage(controlName: string) {
    return this.formHelperProvider.getErrorMessage(this.form, controlName);
  }

  /**
   * Check if a form control is invalid
   * @param controlName Name of the form control
   * @returns boolean indicating if the control is invalid
   */
  isInvalid(controlName: string): boolean {
    return this.formHelperProvider.isInvalid(this.form, this.submitted, controlName);
  }

  /**
   * Show error message for a form control
   * @param controlName Name of the form control
   * @returns boolean indicating if the error message should be shown
   */
  hasError(controlName: string): boolean {
    return this.formHelperProvider.hasError(this.form, this.submitted, controlName);
  }

}
