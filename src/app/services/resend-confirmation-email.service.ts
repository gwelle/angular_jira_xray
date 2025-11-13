import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResendResponse } from '../interfaces/resend-response.interface';
import { ResendConfirmationEmailInterface } from '../interfaces/resend-confirmation-email.interface';

@Injectable({
  providedIn: 'root'
})
export class ResendConfirmationEmailService implements ResendConfirmationEmailInterface {

  // Define any properties or methods needed for user management
  readonly apiUrl: string;
  readonly http = inject(HttpClient);

  constructor() {
    // Initialize the API URL from environment variables
    this.apiUrl = environment.API_URL;
  }

  /**
   * Resends the confirmation email to the specified email address.
   * @param email - The email address to resend the confirmation to.
   * @returns An Observable of void.
   */
  resendConfirmationEmail(email: string): Observable<ResendResponse> {
    return this.http.post<ResendResponse>(`${this.apiUrl}/resend_activation_account`, { email });
  }
}
