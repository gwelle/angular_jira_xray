import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator to check if the password and confirm password fields match
 */
export const PasswordMatchValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
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
