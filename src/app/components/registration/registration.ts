import { Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, map, merge, Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormInterface } from '../../interfaces/form-interface';
import { FieldState } from '../../interfaces/field-state.interface'; 
import { UserMapperProviderInterface } from '../../tokens/registration-token';
import { RegistrationProviderInterface } from '../../tokens/registration-token';
import { FormHelperProviderInterface } from '../../tokens/global.token';
import { RegistrationService } from '../../services/registration.service';
import { UserMapper } from '../../mappers/user-mapper';
import { HandlerProviderInterface } from '../../tokens/registration-token';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly formHelperProvider = inject(FormHelperProviderInterface);
  private readonly handlerProvider = inject(HandlerProviderInterface);
  readonly formBuilder = inject(FormBuilder);
  emailState$!: Observable<FieldState>;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [''],
      plainPassword: ['Test1234$$'],
      confirmationPassword: ['Test1234$$'],
      firstName: ['Guillaume'],
      lastName: [''],
    });
    const control = this.form.get('email')!;

    this.emailState$ = merge(
      control.valueChanges.pipe(debounceTime(300)), // On attend 300 ms pour ne pas recalculer trop souvent
      control.statusChanges
    )
      .pipe(
          startWith(null), // Émet la valeur initiale dès le chargement
            map(() => { 
              const error = this.formHelperProvider.getErrorMessage(this.form, 'email');
              return {
                invalid: control.invalid,
                showError: !!error && 
                  (control.dirty || 
                    control.touched || 
                    this.submitted || 
                    !!control.errors?.['backend']
                  ),
                errorMessage: error ?? ''
              };
            })
      );
}

  /**
   * Handle form submission
   * @returns void
   */
  onSubmit() {
    // Mark the form as submitted
    this.submitted = true;

    if (this.form.valid) {
      const payload = this.userMapperProvider.fromForm(this.form).toPayload();

      this.registrationProvider.register(payload).subscribe({
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
