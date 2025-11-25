import { AbstractControl, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { FormFieldState } from "./form-field-state.interface";

export  interface FormHelperErrorInterface {
  getErrorMessage(form: FormGroup, controlName: string): string;
  isInvalid(form: FormGroup, submitted: boolean, controlName: string): boolean;
  hasError(cform: FormGroup, submitted: boolean, controlName: string): boolean;
  createFormFieldErrorState(control: AbstractControl, form: FormGroup): Observable<FormFieldState>;
}
