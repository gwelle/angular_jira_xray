
import { AbstractControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { FormHelperErrorInterface } from '../interfaces/fom-helper-error.interface';
import { FormFieldState } from '../interfaces/form-field-state.interface';
import { debounceTime, distinctUntilChanged, map, merge, Observable, shareReplay, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHelperErrorService implements FormHelperErrorInterface {

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
    return merge(
      control.statusChanges.pipe(startWith(control.status)), // Émet l'état initial
      control.valueChanges.pipe(startWith(control.value), debounceTime(300)), // Débounce pour éviter les émissions trop fréquentes
      ).pipe(
        startWith(null), // Pour émettre la valeur initiale dès le chargement
          map(() => { 
            const controlName = Object.keys(form.controls).find(key => form.get(key) === control);
            const error = controlName ? this.getErrorMessage(form, controlName) : '';
            return {     
              invalid: control.invalid,
              showError: !!error && (control.dirty || control.touched || !!control.errors?.['backend']),
              errorMessage: error ?? ''     
            };     
          }),
          // Évite les recalculs inutiles
          distinctUntilChanged((a, b) =>
            a.invalid === b.invalid &&
            a.showError === b.showError &&
            a.errorMessage === b.errorMessage   
          ),
          // Cache le dernier état (performance + évite double subscription)
          shareReplay({ bufferSize: 1, refCount: true })
      );
  }
}
