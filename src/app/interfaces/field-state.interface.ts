export interface FieldState {
  invalid: boolean; // Indicates if the form control is invalid
  showError: boolean; // Indicates if the error message should be shown
  errorMessage: string; // The error message to display
}