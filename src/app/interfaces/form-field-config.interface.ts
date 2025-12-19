import { ValidatorFn } from '@angular/forms';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  autocomplete?: string;
  validators?: ValidatorFn | ValidatorFn[] | null;
  asyncValidators?: ValidatorFn | ValidatorFn[] | null;
  updateOn?: 'change' | 'blur' | 'submit';
}