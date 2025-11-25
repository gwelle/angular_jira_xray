
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormFieldState } from './form-field-state.interface';
import { FormFieldConfig } from './form-field-config.interface';

export interface FormCustomInterface {

  form: FormGroup;
  submitted$?: BehaviorSubject<boolean>;
  formBuilder: FormBuilder;
  formFieldsConfig: FormFieldConfig[];

  onSubmit(): void;
  createFormFieldErrorStateFor(controlName: string): Observable<FormFieldState>
}