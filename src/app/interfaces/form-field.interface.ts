import { FormFieldConfig } from './form-field-config.interface';
import { FormFieldState } from './form-field-state.interface';

// L'objet complet qui combine config + état
export interface FormField extends FormFieldConfig {
  state: FormFieldState;
}