import { FormGroup } from "@angular/forms";

export  interface FormHelperInterface {
  getErrorMessage(form: FormGroup, controlName: string): string;
  isInvalid(form: FormGroup, submitted: boolean, controlName: string): boolean;
  hasError(cform: FormGroup, submitted: boolean, controlName: string): boolean;
}