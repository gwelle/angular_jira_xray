import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

interface ResendResponse {
    status: 'handled' | 'resend' | 'error';
    info?: string;
    error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Define any properties or methods needed for user management
  private readonly apiUrl: string;

  private readonly http = inject(HttpClient);

  constructor() {
    // Initialize the API URL from environment variables
    this.apiUrl = environment.API_URL;
  }

  /**
   * Registers a new user.
   * @param user - The user to register.
   * @returns An Observable of the registered User.
   */
  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError((err) => {
          return throwError(() => err);
      })
    );
  }

  /**
   * Resends the confirmation email to the specified email address.
   * @param email - The email address to resend the confirmation to.
   * @returns An Observable of void.
   */
  resendConfirmationEmail(email: string): Observable<ResendResponse> {
    return this.http.post<ResendResponse>(`${this.apiUrl}/resend_activation_account`, { email }).pipe(
      catchError((err) => {
          return throwError(() => err);
      })
    );
  }
}
