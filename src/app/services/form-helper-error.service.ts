
import { AbstractControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { FormHelperErrorInterface } from '../interfaces/fom-helper-error.interface';
import { FormFieldState } from '../interfaces/form-field-state.interface';
import { combineLatest, debounceTime, map, Observable, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHelperErrorService implements FormHelperErrorInterface {


  /**
   * Check if a form control is invalid
   * @param form FormGroup instance
   * @param submitted Boolean indicating if the form has been submitted
   * @param controlName Name of the form control
   * @returns True if the control is invalid after submission, otherwise false
   */
  isInvalid(form: FormGroup, submitted: boolean, controlName: string): boolean {
    const control = form.get(controlName);
    if (!control) return false;

    // Affiche les erreurs uniquement après la soumission du formulaire
    return submitted && !!control.errors;
  }

  /**
   * Show error message for a form control
   * @param form FormGroup instance
   * @param submitted Boolean indicating if the form has been submitted
   * @param controlName Name of the form control
   * @returns True if the error message should be shown, otherwise false
   */
  hasError(form: FormGroup, submitted: boolean, controlName: string): boolean {
    const control = form.get(controlName);
    if (!control) return false;

    // Affiche les erreurs uniquement après la soumission du formulaire
    return submitted && !!control.errors;
  }

  /**
   * Display backend error message for a form control
   * @param form FormGroup instance
   * @param controlName Name of the form control
   * @returns Error message string
   */
  getErrorMessage(form: FormGroup, controlName: string) : string {
    const control = form.get(controlName);
    if (!control?.errors) return '';
    return control.errors['backend'] ?? '';
  }

  /**
   * Create an observable for field error state
   * @param control AbstractControl instance
   * @param form FormGroup instance
   * @returns Observable emitting FieldState objects
   */
  createFormFieldErrorState(control: AbstractControl, form: FormGroup): Observable<FormFieldState> {
    
    return combineLatest([
      control.statusChanges.pipe(startWith(control.status)), // Émet la valeur initiale dès le chargement
      control.valueChanges.pipe(startWith(control.value), debounceTime(300)), // On attend 300 ms pour ne pas recalculer trop souvent
    ]).pipe(
      map(() => { 
        const controlName = Object.keys(form.controls).find(key => form.get(key) === control);
        const error = controlName ? this.getErrorMessage(form, controlName) : '';
        return {     
          invalid: control.invalid,
          // ShowError s’active si :
          // - il y a un message d’erreur
          // - le champ a été modifié ou touché
          // - ou qu’il y a une erreur backend
          showError: !!error && (control.dirty || control.touched || !!control.errors?.['backend']),
          errorMessage: error ?? ''     
        };     
      })   
    );
  }
}
