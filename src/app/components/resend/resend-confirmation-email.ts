import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormHelperProviderInterface } from '../../tokens/global.token';
import { ResendConfirmationEmailService } from '../../services/resend-confirmation-email.service';
import { ResendConfirmationEmailProviderInterface } from '../../tokens/resend-confirmation-email.token';
import { HandlerProviderInterface } from '../../tokens/resend-confirmation-email.token';
import { ResendConfirmationEmailHandler } from '../../handlers/resend-confirmation-email.handler';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormCustomInterface } from '../../interfaces/form-custom.interface';
import { FormFieldState } from '../../interfaces/form-field-state.interface';
import { FormFieldConfig } from '../../interfaces/form-field-config.interface';

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
export class ResendConfirmationEmail implements OnInit, FormCustomInterface {

  form!: FormGroup;
  submitted = false;
  private readonly formHelperProvider = inject(FormHelperProviderInterface);
  private readonly resendConfirmationEmailProvider = inject(ResendConfirmationEmailProviderInterface);
  private readonly handlerProvider = inject(HandlerProviderInterface);
  readonly formBuilder = inject(FormBuilder);
  readonly router = inject(Router);
  submitted$ = new BehaviorSubject<boolean>(false);
  formFieldsConfig!: FormFieldConfig[];

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
   * Create form field error state observable
   * @param controlName Name of the form control
   * @returns Observable of FormFieldState
   */
  createFormFieldErrorStateFor(controlName: string): Observable<FormFieldState>{
    return this.formHelperProvider.createFormFieldErrorState(this.form.get(controlName)!, this.form);
  }
  
}
