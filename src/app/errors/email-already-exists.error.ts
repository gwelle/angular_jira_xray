export class EmailAlreadyExistsError extends Error {
  constructor(message = 'This email address is already exists.') {
    super(message);
    this.name = 'EmailAlreadyExistsError';
  }
}
