
import { FormGroup } from '@angular/forms';

/**
 * Get error message for a form control
 * @param form FormGroup instance
 * @param controlName Name of the form control
 * @returns Error message string
 */
export function getErrorMessage(form: FormGroup, controlName: string) {
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



