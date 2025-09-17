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
        if(params['existing'] === 'true') {
          this.activationMessage = 'Votre compte est déjà activé. Vous pouvez vous connecter.';
          return;
        }
        this.activationMessage = 'Votre compte a été activé avec succès ! Vous pouvez vous connecter.';
      } 
      else if (params['activated'] === '0') {
        if (params['error'] === 'token_expired') {
          this.activationMessage = "Le lien d'activation est invalide ou expiré.";
        } 
        else {
          this.activationMessage = 'Impossible d’activer votre compte.';
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
    if (message.includes('déjà activé')) {
      return 'alert-warning';
    }
    if (message.includes('succès')) {
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
