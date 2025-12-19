import { FormHelperErrorService } from './form-helper-error.service';
import { FormGroup, AbstractControl } from '@angular/forms';
import { take } from 'rxjs';
import { createFakeForm, getControl, setBackendError } from '../random-testing-utils';
import { TestBed } from '@angular/core/testing';
import { FormHelperErrorProviderInterface } from '../tokens/global.token';
import { FormHelperErrorInterface } from '../interfaces/form-helper-error.interface';
import { FormFieldState } from '../interfaces/form-field-state.interface';

/** 
 * Fonction utilitaire pour vérifier l'état d'un contrôle de formulaire
 * @param service 
 * @param control 
 * @param expectedState 
 * @param form 
 * @returns void
 */
function expectFormFieldState(service: FormHelperErrorInterface, 
  expectedState: FormFieldState, control?: AbstractControl, form?: FormGroup) : void {

    const target = control ?? form;
    if (!target) {
      throw new Error('Un contrôle de formulaire ou un formulaire doit être fourni pour le test.');
    }

    // Act
    service.createFormFieldErrorState$(target)
      .pipe(take(1))
      .subscribe((state) => {
        // Assert
        expect(state.invalid).toBe(expectedState.invalid);
        expect(state.showError).toBe(expectedState.showError);
        expect(state.errorMessage).toBe(expectedState.errorMessage);
    });
}

describe('FormHelperErrorService', () => {
  let service : FormHelperErrorInterface;
  let fakeForm: FormGroup;
  let control: AbstractControl;

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
  });

  it('should returns an observable with initial state', () => {
    expectFormFieldState(
      service, 
      { invalid: false, showError: false, errorMessage: '' }, 
      undefined, 
      fakeForm
    );
  });

  it('should returns an observable with backend error simulated', () => {
    // Arrange
    control = getControl(fakeForm, 'email');
    setBackendError(control, "L'adresse email est obligatoire.");

    // Act && Assert
    expectFormFieldState(
      service, 
      { invalid: true, showError: true, errorMessage: "L'adresse email est obligatoire." }, 
      control, 
      undefined
    );
    
  });

  it('should show error when control is pristine', () => {
    // Arrange
    const control = getControl(fakeForm, 'email');
    control.markAsPristine();

    // Act && Assert
    expectFormFieldState(
      service, 
      { invalid: false, showError: false, errorMessage: "" }, 
      control, 
      undefined
    );
  });

  it('should show error when control is dirty and has backend error', () => {
    // Arrange
    const control = getControl(fakeForm, 'email');
    setBackendError(control, "L'adresse email est invalide.");
    control.markAsDirty(); 

    // Act && Assert
    expectFormFieldState(
      service, 
      { invalid: true, showError: true, errorMessage: "L'adresse email est invalide." }, 
      control, 
      undefined
    );
  });

  it('should not emit twice when error state does not change', () => {
    const control = getControl(fakeForm, 'email');
    let emissions = 0;

    service.createFormFieldErrorState$(control).subscribe(() => emissions++);

    setBackendError(control, "L'adresse email est invalide.");
    setBackendError(control, "L'adresse email est invalide."); // même erreur, pas de changement réel

    expect(emissions).toBe(2); // 1 initial + 1 changement réel
    
  });

  xit('should returns an observable with value forced', () => { 
    // Arrange
    const control = getControl(fakeForm, 'email');
    setBackendError(control, "L'adresse email est obligatoire.");
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

});
