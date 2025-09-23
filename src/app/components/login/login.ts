import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html'
})
export class Login implements OnInit {

  // Define any properties or methods needed for login
  loginForm: FormGroup;
  activationMessage: string | null = null;
  isResending: boolean = false;

  /*
   * Constructor for the Login component
   * @param fb FormBuilder instance
   * @param router Router instance
   * @param route ActivatedRoute instance
   */
  constructor( private readonly fb: FormBuilder, 
    private readonly router: Router, private readonly route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * ngOnInit lifecycle hook
   * Checks for activation messages in query parameters
   * @returns void
   */
  ngOnInit(): void {
    // Check for activation message in query params (e.g., after account activation)
    this.route.queryParams.subscribe(params => {
      if (params['activated'] === '1') {
        if(params['info'] === 'already_activated') {
          this.activationMessage = 'Votre compte est déjà activé. Vous pouvez vous connecter.';
        } 
        else {
          this.activationMessage = 'Votre compte a été activé avec succès ! Vous pouvez vous connecter.';
        }
      } 

      else if (params['activated'] === '0') {
        const error = params['error'];

        if (error === 'token_expired') {
          this.activationMessage = "Votre lien d'activation n'est plus valide. Un nouveau email vous a été renvoyé.";
        } 
        else if (error === 'invalid_token') {
          this.activationMessage = "Ce lien d’activation est invalide. Veuillez demander un nouveau lien.";
          this.isResending = true;
        }
        else if(error === 'max_resend_reached') {
          this.activationMessage = "Vous avez atteint le nombre maximum de demandes de renvoi. Veuillez réessayer plus tard.";
        }
        else if (error === 'user_not_found') {
          this.activationMessage = "Aucun compte n'est associé à cet email.";
        } 
        else {
          this.activationMessage = 'Impossible d’activer votre compte. Veuillez réessayer plus tard.';
        }
      }
    });
  }

  /**
   * Determine the CSS class for the alert based on the message content
   * @param message The activation message
   * @returns The CSS class for the alert
   */
  getAlertClass(message: string): string {
    if (message.includes('est déjà activé') || message.includes('demandes de renvoi')) {
      return 'alert-warning';
    }
    else if (message.includes('succès')) {
      return 'alert-success';
    }
  
    return 'alert-danger';
  }

  /**
   * Handle form submission
   * @returns void
   */
  onSubmit() {}
}
