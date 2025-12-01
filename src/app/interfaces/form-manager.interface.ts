import { FormGroup } from "@angular/forms";
import { FormFieldConfig } from "./form-field-config.interface";
import { FormHelperErrorInterface } from "./fom-helper-error.interface";
import { Signal } from "@angular/core";
import { FormFieldState } from "./form-field-state.interface";
import { FormField } from "./form-field.interface";

export interface FormManagerInterface {
    
    readonly formHelperErrorProvider?: FormHelperErrorInterface;
    
    buildForm(formFieldsConfig: FormFieldConfig[]): FormGroup
    initializeFieldStates(form: FormGroup, formFieldsConfig: FormFieldConfig[]): Signal<FormFieldState>[]
    combineFormFieldsAndStates(formFieldsConfig: FormFieldConfig[], states: Signal<FormFieldState>[]): Signal<FormField[]>;
}