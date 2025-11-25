import { FormFieldState } from './form-field-state.interface';

// L'objet complet qui combine config + état
export interface FormField {
  // Config
  name: string;
  label: string;
  type: 'email' | 'text' | 'password';
  
  // État
  state: FormFieldState;
}