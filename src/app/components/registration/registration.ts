import { Component, inject, OnInit} from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FormInterface } from '../../interfaces/form-interface';
import { UserMapperProviderInterface } from '../../tokens/registration-token';
import { RegistrationProviderInterface } from '../../tokens/registration-token';
import { FormHelperProviderInterface } from '../../tokens/global.token';
import { FormHelperService } from '../../services/form-helper.service';
import { RegistrationService } from '../../services/registration.service';
import { UserMapper } from '../../mappers/user-mapper';
import { HandlerProviderInterface } from '../../tokens/registration-token';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [
    { provide: RegistrationProviderInterface, useClass: RegistrationService },
    { provide: UserMapperProviderInterface, useClass: UserMapper },
  ],
  templateUrl: './registration.html'
})
export class Registration implements OnInit, FormInterface {

  // Define any properties or methods needed for registration
  form!: FormGroup;
  submitted = false;
  private readonly registrationProvider = inject(RegistrationProviderInterface);
  private readonly userMapperProvider = inject(UserMapperProviderInterface);
  private readonly formHelperProvider = inject(FormHelperProviderInterface);
  private readonly handlerProvider = inject(HandlerProviderInterface);
  private readonly formHelperService = inject(FormHelperService);
  readonly formBuilder = inject(FormBuilder);

  constructor() {
    this.ngOnInit();
  }  

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/)]],
      plainPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15),
         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,15}$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/)]]
    },{ validators: this.formHelperService.PasswordMatchValidator });
  }

  /**
   * Handle form submission
   * @returns void
   */
  onSubmit() {
    // Mark the form as submitted
    this.submitted = true;

    if (this.form.valid) {
      
      const user = this.userMapperProvider.fromForm(this.form);

      this.registrationProvider.register(user).subscribe({
        next: () => this.handlerProvider.handleResponse(),
        error: (err) => this.handlerProvider.handleError(err, this.form)
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
