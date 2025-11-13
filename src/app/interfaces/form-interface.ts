
import { FormBuilder, FormGroup } from '@angular/forms';

export interface FormInterface {

  form: FormGroup;
  submitted: boolean;
  formBuilder: FormBuilder;

  onSubmit(): void;
  getErrorMessage(controlName: string): string;
  isInvalid(controlName: string): boolean;
  hasError(controlName: string): boolean;
}