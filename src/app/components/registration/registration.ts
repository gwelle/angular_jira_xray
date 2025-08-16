import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration {

  // Define any properties or methods needed for registration
  registrationForm: FormGroup ;


  /**
   * constructor
   * @param userService
   * @param fb
   */
  constructor(private readonly userService: UserService, private readonly fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      plainPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) { 

      const user = {
        email: this.registrationForm.get('email')?.value,
        plainPassword: this.registrationForm.get('plainPassword')?.value,
        confirmPassword: this.registrationForm.get('confirmPassword')?.value,
        firstName: this.registrationForm.get('firstName')?.value,
        lastName: this.registrationForm.get('lastName')?.value
      };

      this.userService.register(user).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
        },
        error: (error) => {
          console.error('Error registering user:', error);
        }
      });

    }
    else{
      console.log('Formulaire invalide : \n', this.registrationForm.errors);
    }
  }
}