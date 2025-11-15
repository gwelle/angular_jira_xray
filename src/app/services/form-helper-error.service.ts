
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { FormHelperErrorInterface } from '../interfaces/fom-helper-error.interface';

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
   * @returns Backend error message string or empty string
   */
  getErrorMessage(form: FormGroup, controlName: string) {
    const control = form.get(controlName);
    if (!control?.errors) return '';

    // priorité aux messages backend
    if (control.errors['backend']) {
      return control.errors['backend'];
    }

    return '';
  }
}
