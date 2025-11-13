import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { RegistrationInterface } from '../interfaces/registration.interface';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RegistrationService implements RegistrationInterface {

  // Define any properties or methods needed for user management
  readonly apiUrl: string;
  readonly http = inject(HttpClient);

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
    return this.http.post<User>(this.apiUrl, user);
  }
}