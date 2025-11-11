import { Component, OnInit, inject } from '@angular/core';
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
  loginForm!: FormGroup;
  activationMessage: string | null = null;
  isResending = false;
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);  
  

  /*
   * Constructor for the Login component
   */
  constructor() {
    this.ngOnInit();
  }

  /**
   * ngOnInit lifecycle hook
   * Checks for activation messages in query parameters
   * @returns void
   */
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    // Récupération des query params après redirection ou activation
    this.route.queryParams.subscribe(params => {
      const activated = params['activated'];
      const error = params['error'];
      const info = params['info'];

      if (activated === '1') {
        if (info === 'already_activated') {
          this.activationMessage = 'Votre compte est déjà activé. Vous pouvez vous connecter.';
        } 
        else {
          this.activationMessage = 'Votre compte a été activé avec succès ! Vous pouvez vous connecter.';
        }
        this.isResending = false;
      } 
      
      else if (activated === '0') {
        switch (error) {
          case 'token_expired':
            this.activationMessage = "Votre lien d'activation n'est plus valide. Un nouveau email vous a été renvoyé.";
            this.isResending = false;
            break;
          case 'invalid_token':
            this.activationMessage = "Ce lien d’activation est invalide. Veuillez demander un nouveau lien.";
            this.isResending = true;
            break;
          case 'max_resend_reached':
            this.activationMessage = "Vous avez atteint le nombre maximum de demandes de renvoi. Veuillez réessayer plus tard.";
            this.isResending = false;
            break;
          default:
            // Aucun "error" spécifique, on regarde "info"
            if (info === 'check_resend_email') {
              this.activationMessage = "Si un compte existe, un e-mail de confirmation sera envoyé.";
            } 
            else {
              this.activationMessage = 'Le serveur a rencontré une erreur. Veuillez réessayer plus tard.';
            }
            this.isResending = false;
            break;
        }
      } 
      
      else {
        // Cas par défaut, pas de query param "activated"
        this.activationMessage = null;
        this.isResending = false;
      }
    });
  }

  /**
   * Determine the CSS class for the alert based on the message content
   * @param message The activation message
   * @returns The CSS class for the alert
   */
  getAlertClass(message: string): string {
    if (message.includes('succès')) {
      return 'alert-success';
    }
    else if (message.includes('est déjà activé') ) {
      return 'alert-warning';
    }
    else if (message.includes('demandes de renvoi')) {
      return 'alert alert-info';
    }
    else if (message.includes('Si un compte existe')) {
      return 'alert alert-secondary';
    }
    return 'alert-danger';
  }

  /**
   * Handle form submission
   * @returns void
   */
  onSubmit() {
    // Mark the form as submitted
    if (this.loginForm.valid) {
      // Form is valid, proceed with login
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      console.log('Login attempt with email:', email, 'and password:', password);
    }
  }
}
