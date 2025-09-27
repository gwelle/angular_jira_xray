
import { FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormHelperService {

  /**
   * Get error message for a form control
   * @param form FormGroup instance
   * @param controlName Name of the form control
   * @returns Error message string
   */
  getErrorMessage(form: FormGroup, controlName: string) {
    const control = form.get(controlName);
    if (!control?.errors) return '';

    if (control.errors['passwordMismatch']) {
      return 'Les mots de passe ne correspondent pas';
    }

    if (control.errors['alreadyExists']) {
      return "Cette adresse email existe déjà";
    }

    // Map des messages selon le type d'erreur et le champ
    const messages: Record<string, Record<string, string>> = {
      required: {
        email: "L'email est obligatoire",
        firstName: 'Le prénom est obligatoire',
        lastName: 'Le nom est obligatoire',
        plainPassword: 'Le mot de passe est obligatoire',
        confirmPassword: 'Le mot de passe de confirmation est obligatoire',
      },
      minlength: {
        plainPassword: `Le mot de passe doit contenir au moins ${control.errors['minlength']?.requiredLength} caractères`,
        confirmPassword: `La confirmation du mot de passe doit contenir au moins ${control.errors['minlength']?.requiredLength} caractères`,
      },
      maxlength: {
        plainPassword: `Le mot de passe ne peut pas dépasser ${control.errors['maxlength']?.requiredLength} caractères`,
        confirmPassword: `La confirmation du mot de passe ne peut pas dépasser ${control.errors['maxlength']?.requiredLength} caractères`,
      },
      pattern: {
        email: 'L\'adresse Email est invalide',
        plainPassword: 'Le mot de passe doit contenir au moins une lettre majuscule, une minuscule, un chiffre et un caractère spécial.',
        confirmPassword: 'Le mot de passe de confirmation doit contenir au moins une lettre majuscule, une minuscule, un chiffre et un caractère spécial.',
        firstName: 'Le prénom doit contenir uniquement des lettres, espaces, tirets ou apostrophes correctement placés.',
        lastName: 'Le nom doit contenir uniquement des lettres, espaces, tirets ou apostrophes correctement placés.',
      }
    };

    // Cherche le premier type d'erreur présent dans control.errors
    for (const errorType of Object.keys(messages)) {
      if (control.errors[errorType]) {
        return messages[errorType][controlName] || '';
      }
    }

    return '';
  }

  /**
   * Custom validator to check if the password and confirm password fields match
   * @param formGroup FormGroup instance
   * @returns ValidationErrors if the passwords do not match, otherwise null  
   */
  PasswordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('plainPassword')?.value;
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (!confirmPasswordControl) {
      return null;
    }

    // Récupère les erreurs existantes (ex: required)
    const errors = confirmPasswordControl.errors || {};

    if (password && confirmPasswordControl.value && password !== confirmPasswordControl.value) {
      errors['passwordMismatch'] = true;
      confirmPasswordControl.setErrors(errors);
      return { passwordMismatch: true };
    } 
    else {
      // Supprime uniquement passwordMismatch sans effacer les autres erreurs
      if ('passwordMismatch' in errors) {
        delete errors['passwordMismatch'];
        confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  };

  /**
   * Check if a form control is invalid
   * @param form FormGroup instance
   * @param submitted Boolean indicating if the form has been submitted
   * @param controlName Name of the form control
   * @returns True if the control is invalid after submission, otherwise false
   */
  isInvalid(form: FormGroup, submitted: boolean, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(submitted && control?.errors);
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
    return submitted && !!control?.errors;
  }
}
