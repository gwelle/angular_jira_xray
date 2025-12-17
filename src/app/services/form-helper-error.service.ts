
import { AbstractControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { FormHelperErrorInterface } from '../interfaces/form-helper-error.interface';
import { FormFieldState } from '../interfaces/form-field-state.interface';
import { distinctUntilChanged, map, merge, Observable, shareReplay, startWith, defer, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormHelperErrorService implements FormHelperErrorInterface {

  /**
   * Create an observable for form field error state
   * @param control The form control
   * @returns Observable<FormFieldState>
   */
  createFormFieldErrorState$(control: AbstractControl): Observable<FormFieldState> {

    if (!(control instanceof AbstractControl)) {
      throw new Error('Invalid argument: expected AbstractControl');
    }
    return defer (() => {
      return merge(
        control.statusChanges.pipe(
          startWith(control.status),
          tap(status => console.log('[STATUS CHANGE]', status))
        ), 
        control.valueChanges.pipe(
          startWith(control.value),
          tap(value => console.log('[VALUE CHANGE]', value))
        ),
        control.valueChanges.pipe(map(() => control.errors)), // ← capte erreurs backend
        defer(() => [control.errors]) // ← émet l’erreur initiale dès que l’Observable est souscrit
      ).pipe(
          startWith(null), // Pour émettre la valeur initiale dès le chargement
          map(() => { 
            const error = control.errors?.['backend'] ?? '';
            // Faut-il affficher une erreur ? invalid
            // Quand faut -il afficher une erreur ? Dirty, touched
            // Qu'est ce qu'il faut afficher ? control.errors['backend']
            return {     
              invalid: control.invalid,
              showError: !!error && (control.touched || control.dirty || !!control.errors?.['backend']),
              errorMessage: error    
            };     
          }),
          
          // Évite les recalculs inutiles
          distinctUntilChanged((prev, curr) =>
            prev.invalid === curr.invalid &&
            prev.showError === curr.showError &&
            prev.errorMessage === curr.errorMessage
          ),
          tap(state => console.log('STATE EMIT:', state, 'ERRORS:', control.errors, 
            'touched:', control.touched, 'dirty:', control.dirty, 'pristine:', control.pristine)),

          // 🛡 évite les doubles souscriptions dans tes templates
          shareReplay({ bufferSize: 1, refCount: true })
      );
    });
  }
}
