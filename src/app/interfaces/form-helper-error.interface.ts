import { AbstractControl } from "@angular/forms";
import { Observable } from "rxjs";
import { FormFieldState } from "./form-field-state.interface";

export interface FormHelperErrorInterface {
  createFormFieldErrorState$(control: AbstractControl): Observable<FormFieldState>;
}
