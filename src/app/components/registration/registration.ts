import { Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormCustomInterface } from '../../interfaces/form-custom.interface';
import { FormFieldState } from '../../interfaces/form-field-state.interface';
import { UserMapperProviderInterface } from '../../tokens/registration-token';
import { RegistrationProviderInterface } from '../../tokens/registration-token';
import { FormHelperProviderInterface } from '../../tokens/global.token';
import { RegistrationService } from '../../services/registration.service';
import { UserMapper } from '../../mappers/user-mapper';
import { HandlerProviderInterface } from '../../tokens/registration-token';
import { FormFieldConfig } from '../../interfaces/form-field-config.interface';
import { FormField } from '../../interfaces/form-field.interface';

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
export class Registration implements OnInit, FormCustomInterface {

  // Define any properties or methods needed for registration
  
  private readonly registrationProvider = inject(RegistrationProviderInterface);
  private readonly userMapperProvider = inject(UserMapperProviderInterface);
  private readonly formHelperProvider = inject(FormHelperProviderInterface);
  private readonly handlerProvider = inject(HandlerProviderInterface);

  form!: FormGroup;
  readonly formBuilder = inject(FormBuilder);
  formFieldState$!: Observable<FormField[]>;
  formFieldsConfig!: FormFieldConfig[];

  ngOnInit(): void {

    // Define form fields configuration
    this.formFieldsConfig = [
      { name: 'email', label: 'Email', type: 'email', autocomplete: 'username'  },
      { name: 'plainPassword', label: 'Plain Password', type: 'password', autocomplete: 'new-password'  },
      { name: 'confirmationPassword', label: 'Confirm Password', type: 'password', autocomplete: 'new-password'  },
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' }
    ];

    // Build form group dynamically based on form fields
    const formConfig = this.formFieldsConfig.reduce((acc, field) => {
      acc[field.name] = ['', []];
      return acc;
    }, {} as Record<string, [string, ValidatorFn[]]>);

    // Create the form group 
    this.form = this.formBuilder.group(formConfig);

    // Combine field configs with their states
    this.formFieldState$ = combineLatest(
      this.formFieldsConfig.map(f => 
        this.createFormFieldErrorStateFor(f.name).pipe(
          map((state: FormFieldState) => ({ ...f, state }))
        )
      )
    );
  }

/**
 *  Create field state for a given control name
 * @param controlName - The name of the form control
 * @returns Observable<FormFieldState>
 */
createFormFieldErrorStateFor(controlName: string): Observable<FormFieldState> {
  return this.formHelperProvider.createFormFieldErrorState(this.form.get(controlName)!,this.form);
}

  /**
   * Handle form submission
   * @returns void
   */
  onSubmit() {
    
    this.form.markAllAsTouched(); // Mark all fields as touched to show validation errors

    if (this.form.invalid) {
      return;
    }

    const payload = this.userMapperProvider.fromForm(this.form).toPayload();

    this.registrationProvider.register(payload).subscribe({
      next: () => this.handlerProvider.handleResponse(),
      error: (err) => this.handlerProvider.handleError(err, this.form)
    });
  }
}


