import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {

  // Define any properties or methods needed for login
  loginForm: FormGroup;

  /*
   * Constructor for the Login component
   * @param fb FormBuilder instance
   * @param router Router instance
   */
  constructor( private readonly fb: FormBuilder, 
    private readonly router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Handle form submission
   * @returns void
   */
  onSubmit() {}
}
