
import { Form, FormGroup, Validators } from "@angular/forms";
import { FormFieldConfig } from "../interfaces/form-field-config.interface";
import { FormManagerService } from "./form-manager.service";
import { FormManagerProviderInterface } from "../tokens/global.token";
import { TestBed } from "@angular/core/testing";
import { FormManagerInterface } from "../interfaces/form-manager.interface";

describe('FormManagerService', () => {
  let service : FormManagerInterface;
  let formFieldsConfig: FormFieldConfig[];
  let results: FormGroup;

  // Before each test, initialize the service and create a fake form and control
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [{
            provide: FormManagerProviderInterface, 
            useClass: FormManagerService
        }]
    });
    service = TestBed.inject(FormManagerProviderInterface);
    formFieldsConfig = [
        { name: 'email', label: 'Email', type: 'email', autocomplete: 'username', 
            validators: [Validators.required, Validators.email], asyncValidators: [], updateOn: 'submit' },

        { name: 'plainPassword', label: 'Plain Password', type: 'password', autocomplete: 'password', 
            validators: [Validators.required, Validators.minLength(8)], asyncValidators: [], updateOn: 'change' },

        { name: 'confirmationPassword', label: 'Confirm Password', type: 'password', autocomplete: 'new-password',
            validators: [Validators.required, Validators.maxLength(15)], asyncValidators: [], updateOn: 'change' },

        { name: 'firstName', label: 'First Name', type: 'text', autocomplete: 'first-name', 
            validators: [Validators.required], asyncValidators: [], updateOn: 'blur' },

        { name: 'lastName', label: 'Last Name', type: 'text', autocomplete: 'last-name', 
            validators: [Validators.required], asyncValidators: [], updateOn: 'blur' }
    ];

  });

  it('should initialize FormGroup with correct controls and empty values', () => {
    // Act
    results = service.buildForm(formFieldsConfig);
    const controlNames = Object.keys(results.controls);

    //Assert
    expect(results).toBeInstanceOf(FormGroup);
    expect(controlNames).toEqual([
        'email', 
        'plainPassword',
        'confirmationPassword',
        'firstName',
        'lastName'
    ]); 

    Object.values(results.controls).forEach(control => {

        // valeurs initiales
        expect(control.value).toBe('');

        // présence des clés techniques
        expect(control.validator).toBeDefined();
        expect(control.asyncValidator).toBeDefined();
        expect(control.updateOn).toBeDefined();
    });
  });

  it('should throw error if formFieldsConfig is empty or invalid', () => {
        
        expect(() => service.buildForm([]))
            .toThrowError('Form fields configuration is required to build the form.');
        
        expect(() => service.buildForm(undefined as any))
            .toThrowError('Form fields configuration is required to build the form.');
 });
});