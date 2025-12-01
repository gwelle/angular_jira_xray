import { Component, inject, OnInit, ChangeDetectionStrategy, Signal} from '@angular/core';
import { UserMapperProviderInterface } from '../../tokens/registration-token';
import { RegistrationProviderInterface } from '../../tokens/registration-token';
import { RegistrationService } from '../../services/registration.service';
import { UserMapper } from '../../mappers/user-mapper';
import { HandlerProviderInterface } from '../../tokens/registration-token';
import { FormFieldConfig } from '../../interfaces/form-field-config.interface';
import { CustomFormInterface } from '../../interfaces/custom-form.interface';
import { DynamicForm } from '../dynamic-form/dynamic-form';
import {FormGroup} from '@angular/forms';
import { FormFieldState } from '../../interfaces/form-field-state.interface';
import { FormField } from '../../interfaces/form-field.interface';
import { FormManagerProviderInterface } from '../../tokens/global.token';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [DynamicForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: RegistrationProviderInterface, useClass: RegistrationService },
    { provide: UserMapperProviderInterface, useClass: UserMapper },
  ],
  templateUrl: './registration.html'
})
export class Registration implements OnInit, CustomFormInterface {

  private readonly registrationProvider = inject(RegistrationProviderInterface);
  private readonly formManagerProvider = inject(FormManagerProviderInterface);
  private readonly userMapperProvider = inject(UserMapperProviderInterface);
  private readonly handlerProvider = inject(HandlerProviderInterface);
  
  form!: FormGroup;
  // ✅ Configuration des champs du formulaire
  formFieldsConfig!: FormFieldConfig[];
  // ✅ Tableau de Signals individuels
  fieldsState!: Signal<FormFieldState>[];
  // ✅ Signal combiné contenant tous les champs avec leurs états
  formFieldsState!: Signal<FormField[]>;

  /**
   * OnInit lifecycle hook
   * @returns void
   */
  ngOnInit(): void {
    this.initializeFormFieldsConfig();
    this.form = this.formManagerProvider.buildForm(this.formFieldsConfig);
    this.fieldsState = this.formManagerProvider.initializeFieldStates(this.form, this.formFieldsConfig);
    this.formFieldsState = this.formManagerProvider.combineFormFieldsAndStates(this.formFieldsConfig, this.fieldsState);
  }

  /**   
   * Initialize form fields configuration
   * @returns void
   */
   initializeFormFieldsConfig(): void {
    // Define form fields configuration
    this.formFieldsConfig = [
      { name: 'email', label: 'Email', type: 'email', autocomplete: 'username'  },
      { name: 'plainPassword', label: 'Plain Password', type: 'password', autocomplete: 'new-password'  },
      { name: 'confirmationPassword', label: 'Confirm Password', type: 'password', autocomplete: 'new-password'  },
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' }
    ];
  }

  /** 
   * Handle form ready event to get the FormGroup
   * @param form The FormGroup emitted by DynamicForm
   * @returns void
   */
  /*onFormReady(form: FormGroup) {
    this.form = form; // Registration possède maintenant le FormGroup
  }*/
  
  /**
   * Handle form submission
   * @returns void
   */
  onSubmit() {
    
    const payload = this.userMapperProvider.fromForm(this.form).toPayload();

    this.registrationProvider.register(payload).subscribe({
      next: () => this.handlerProvider.handleResponse(),
      error: (err) => this.handlerProvider.handleError(err, this.form)
    });
  }
}


