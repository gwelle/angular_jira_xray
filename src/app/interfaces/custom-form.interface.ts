
import { Signal } from '@angular/core';
import { FormFieldConfig } from './form-field-config.interface';
import { FormGroup} from '@angular/forms';
import { FormFieldState } from './form-field-state.interface';
import { FormField } from './form-field.interface';


export interface CustomFormInterface {

  form: FormGroup;
  // ✅ Tableau de Signals individuels
  fieldsState?: Signal<FormFieldState>[]
  // ✅ Signal combiné contenant tous les champs avec leurs états
  formFieldsState?: Signal<FormField[]>;
  // ✅ Configuration des champs du formulaire
  formFieldsConfig?: FormFieldConfig[];

  initializeFormFieldsConfig?(): void;
  onSubmit(): void;
}