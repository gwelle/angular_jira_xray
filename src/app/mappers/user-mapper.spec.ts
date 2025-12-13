import { UserMapper } from './user-mapper';
import { FormBuilder, FormGroup } from "@angular/forms";
import { randomEmail, randomString, randomPasswordPair } from '../random-testing-utils';
import { UserPayload } from '../interfaces/user-payload.interface';

describe('UserMapper', () => {

  let mapper: UserMapper;
  let formBuilder: FormBuilder;
  let fakeForm: FormGroup;
  let payload: UserPayload;

  // Helper function to create a fake form with random data
  const createFakeForm = () => { 
  const { plainPassword, confirmationPassword } = randomPasswordPair();
    return formBuilder.group({
    email: randomEmail(),
    plainPassword: plainPassword,
    confirmationPassword: confirmationPassword,
    firstName: randomString(),
    lastName: randomString(),
    });
  };

  /**
   * Map form to user payload
   * @param form 
   * @returns 
   */
  function mapFormToPayload(form: FormGroup): UserPayload {
    return mapper.fromForm(form).toPayload();
  }


  /**
   * Format first name with first letter uppercase and the rest lowercase
   * @param name 
   * @returns 
   */
  function formatFirstName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  /**
   * Format last name with all letters uppercase
   * @param name 
   * @returns 
   */
  function formatLastName(name: string) {
    return name.toUpperCase();
  }

  // Before each test, initialize the mapper and create a fake form
  beforeEach(() => {
    // Arrange
    mapper = new UserMapper();
    formBuilder = new FormBuilder();
    fakeForm = createFakeForm();

    // Act
    payload = mapFormToPayload(fakeForm);
  });

  it('should return user mapper values into a correct payload', () => {
    // Assert
    expect(Object.keys(payload)).not.toContain('id');
    
    expect(payload).toEqual(jasmine.objectContaining({
      email: jasmine.any(String),
      plainPassword: jasmine.any(String),
      confirmationPassword: jasmine.any(String),
      firstName: jasmine.any(String),
      lastName: jasmine.any(String),
    }));

    expect(payload.email).toEqual(fakeForm.get('email')?.value);
    expect(payload.plainPassword).toEqual(fakeForm.get('plainPassword')?.value);
    expect(payload.confirmationPassword).toEqual(fakeForm.get('confirmationPassword')?.value);
  });

  it('should format firstName and lastName correctly', () => {
    expect(payload.firstName).toBe(formatFirstName(fakeForm.get('firstName')?.value));
    expect(payload.lastName).toBe(formatLastName(fakeForm.get('lastName')?.value));
    
  });

  it('should return user with empty values when form controls are empty', () => {
    // Arrange
    fakeForm.reset();

    // Act
    payload = mapFormToPayload(fakeForm);

    // Assert
    expect(payload).toEqual({
      email: '',
      plainPassword: '',
      confirmationPassword: '',
      firstName: '',
      lastName: '',
    });
  });

  it('should throw an error if form is not a FormGroup instance', () => {
    // Arrange
    const invalidForm: any = {
      get: (controlName: string) => ({ value: 'test' })
    };

    // Act & Assert
    expect(() => mapper.fromForm(invalidForm)).toThrowError('Invalid form: expected FormGroup instance');
  });

});

