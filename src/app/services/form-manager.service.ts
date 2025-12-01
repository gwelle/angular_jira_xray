import { computed, inject, Injectable, Injector, runInInjectionContext, Signal } from "@angular/core";
import { FormManagerInterface } from "../interfaces/form-manager.interface";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, ValidatorFn } from "@angular/forms";
import { FormFieldConfig } from "../interfaces/form-field-config.interface";
import { FormHelperErrorProviderInterface } from "../tokens/global.token";
import { FormFieldState } from "../interfaces/form-field-state.interface";
import { FormField } from "../interfaces/form-field.interface";


@Injectable({
  providedIn: 'root'
})
export class FormManagerService implements FormManagerInterface {

    formBuilder = inject(FormBuilder);
    injector = inject(Injector);
    readonly formHelperErrorProvider = inject(FormHelperErrorProviderInterface);

    /** 
     * Build the form group based on form fields configuration
     * @param formFieldsConfig The configuration of form fields
     * @returns FormGroup
     */
    buildForm(formFieldsConfig: FormFieldConfig[]): FormGroup {
      
      // Build form group dynamically based on form fields
      const formConfig = formFieldsConfig.reduce((acc, field) => {
        acc[field.name] = ['', [] as ValidatorFn[]];
        return acc;
      }, {} as Record<string, [string, ValidatorFn[]]>);
  
      // Create the form group 
      return this.formBuilder.group(formConfig);
    }
  
    /** 
     * Initialize field states as signals
     * @param form The FormGroup
     * @param formFieldsConfig The configuration of form fields
     * @returns Signal<FormFieldState>[]
     */
    initializeFieldStates(form: FormGroup, formFieldsConfig: FormFieldConfig[]): Signal<FormFieldState>[] {
  
      // ✅ Créer les signals dans un contexte d'injection
      return formFieldsConfig.map(f =>
        runInInjectionContext(this.injector, () =>
          toSignal(
            this.formHelperErrorProvider.createFormFieldErrorState$(form.get(f.name)!,form),
            {
              initialValue: {
                invalid: false,
                showError: false,
                errorMessage: ''
              }
            }
          )
        )
      );
    }
  
    /** 
     * Combine form fields configuration with their states into a single signal
     * @param formFieldsConfig The configuration of form fields
     * @param states The array of field state signals
     * @returns Signal<FormField[]>
     */
    combineFormFieldsAndStates(formFieldsConfig: FormFieldConfig[], states: Signal<FormFieldState>[]): Signal<FormField[]> {
  
      // ✅ Créer le signal combiné des champs avec leurs états
      return computed(() =>
        formFieldsConfig.map((f, i) => ({...f,state: states[i]()}))
      );
    }
}
