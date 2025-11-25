import { ValidatorFn } from '@angular/forms';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  validators?: ValidatorFn | ValidatorFn[] | null;
}