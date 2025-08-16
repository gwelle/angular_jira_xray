import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Define any properties or methods needed for user management
  private readonly apiUrl: string;

  /**
   * Constructor to inject HttpClient.
   * @param http - HttpClient for making HTTP requests.
   */
  constructor(private readonly http: HttpClient) {
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
        // Ici tu peux renvoyer l'erreur pour le composant
          return throwError(() => err);
      })
    );
  }
}
