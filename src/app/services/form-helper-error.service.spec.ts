import { FormHelperErrorService } from './form-helper-error.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { take } from 'rxjs';
import { createFakeForm, randomEmail } from '../random-testing-utils';
import { TestBed } from '@angular/core/testing';
import { FormHelperErrorProviderInterface } from '../tokens/global.token';
import { FormHelperErrorInterface } from '../interfaces/form-helper-error.interface';
import { FormFieldState } from '../interfaces/form-field-state.interface';

describe('FormHelperErrorService', () => {
  let service : FormHelperErrorInterface;
  let fakeForm: FormGroup;
  let controls: AbstractControl[];

  // Before each test, initialize the service and create a fake form and control
  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [{
            provide: FormHelperErrorProviderInterface, 
            useClass: FormHelperErrorService
        }]
    });
    service = TestBed.inject(FormHelperErrorProviderInterface);
    fakeForm = createFakeForm();
    controls = Object.values(fakeForm.controls);
  });

  it('should returns an observable with initial state', () => {
    // Act
    service.createFormFieldErrorState$(fakeForm)
        .pipe(take(1))
        .subscribe((state) => {
            expect(state).toBeDefined();
            
            // Assert
            expect(state.invalid).toBeFalse();
            expect(state.showError).toBeFalse();
            expect(state.errorMessage).toBe('');
    });

    controls.forEach(control => {
      expect(control.status).toBe('VALID');
      expect(control.errors).toBeNull();
    });
  });

  it('should returns an observable with backend error simulated', () => {
    // Arrange
    const control = fakeForm.get('email') as AbstractControl;
    controls.forEach(control => control.setErrors({ backend: "L'adresse email est obligatoire." }));
    
    // Act
    service.createFormFieldErrorState$(control)
        .pipe(take(1))
        .subscribe((state) => {

            // Assert
            expect(state.invalid).toBeTrue();
            expect(state.showError).toBeTrue();
            expect(state.errorMessage).toBe("L'adresse email est obligatoire.");
    });

    expect(control.status).toBe('INVALID');
    expect(control.errors).toEqual(jasmine.objectContaining({backend: "L'adresse email est obligatoire."}));
  });

 it('should returns an observable with value forced', () => { 
    // Arrange
    const control = fakeForm.get('email') as AbstractControl;
    control.setErrors({ backend: "L'adresse email est obligatoire." });
    const states: FormFieldState[] = [];

    // Act
    service.createFormFieldErrorState$(control)
        .pipe(take(3))
        .subscribe((state) => states.push(state));
    
    // Assert
    expect(states[0].invalid).toBeTrue();
    expect(states[0].showError).toBeTrue();
    expect(states[0].errorMessage).toBe("L'adresse email est obligatoire.");

    expect(control.status).toBe('INVALID');
    expect(control.errors).toEqual(jasmine.objectContaining({backend: "L'adresse email est obligatoire."}));

    control.setValue("");
    control.setErrors(null);

    expect(states[1].invalid).toBeFalse();
    expect(states[1].showError).toBeFalse();
    expect(states[1].errorMessage).toBe("");

    expect(control.status).toBe('VALID');
    expect(control.value).toBe("");
    expect(control.errors).toBeNull();

    control.setValue("nouvelle valeur");
    control.setErrors({ backend: "L'adresse email est invalide." });

    expect(states[2].invalid).toBeTrue();
    expect(states[2].showError).toBeTrue();
    expect(states[2].errorMessage).toBe("L'adresse email est invalide.");
    
    expect(control.status).toBe('INVALID');
    expect(control.value).toBe("nouvelle valeur");
    expect(control.errors).toEqual(jasmine.objectContaining({backend: "L'adresse email est invalide."}));
 });

  it('should returns an pristine state egal to false', () => {
    // Arrange
    const control = fakeForm.get('email') as AbstractControl;
    control.setValue(randomEmail); 
    control.markAsDirty(); 

    // Act 
    service.createFormFieldErrorState$(control).pipe(take(1)) 
      .subscribe((state) => { 
        // Assert 
        expect(state.invalid).toBeFalse();
        expect(state.showError).toBeFalse(); 
        expect(state.errorMessage).toBe(''); 
    });
    expect(control.pristine).toBeFalse();
  });

  it('should returns an dirty state egal to true', () => {
    // Arrange
    const control = fakeForm.get('email') as AbstractControl;
    control.setValue(randomEmail); 
    control.markAsDirty(); 
    control.setErrors({backend: 'email is invalid' });

    // Act 
    service.createFormFieldErrorState$(control).pipe(take(1)) 
      .subscribe((state) => { 
        // Assert 
        expect(state.invalid).toBeTrue();
        expect(state.showError).toBeTrue(); 
        expect(state.errorMessage).toBe('email is invalid'); 
    });
    expect(control.dirty).toBeTrue();
  });

  it('should not emit twice when error state does not change', () => {
    const control = fakeForm.get('email') as AbstractControl;
    let emissions = 0;

    service.createFormFieldErrorState$(control).subscribe(() => emissions++);

    control.setErrors({ backend: 'Erreur' });
    control.setErrors({ backend: 'Erreur' });

    expect(emissions).toBe(2); // 1 initial + 1 changement réel
    
  });

});
  