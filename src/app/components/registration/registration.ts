import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration implements OnInit {
  // Define any properties or methods needed for registration

  registrationForm: FormGroup;

  user = signal({
    id: null,
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  ;

  /**
   * constructor
   * @param userService 
   */
  constructor(private readonly userService: UserService, private readonly fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Perform any initialization logic here
        console.log('Resgistration::ngOnInit()');
  }

  validateRegistrationForm() {}

}
