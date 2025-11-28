
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormFieldState } from './form-field-state.interface';
import { FormFieldConfig } from './form-field-config.interface';
import { Injector, Signal } from '@angular/core';
import { FormField } from './form-field.interface';

export interface FormCustomInterface {

  form: FormGroup;
  submitted$?: BehaviorSubject<boolean>;
  formBuilder: FormBuilder;
  // ✅ Tableau de Signals individuels
  fieldsState: Signal<FormFieldState>[]
  // ✅ Signal combiné contenant tous les champs avec leurs états
  formFieldsState: Signal<FormField[]>;
  // ✅ Configuration des champs du formulaire
  formFieldsConfig: FormFieldConfig[];
  injector?: Injector;

  onSubmit(): void;
  createFormFieldErrorStateFor(controlName: string): Observable<FormFieldState>
}