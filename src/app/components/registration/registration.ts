import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [],
  templateUrl: './registration.html',
  styleUrl: './registration.css'
})
export class Registration implements OnInit {
  // Define any properties or methods needed for registration

  /**
   * constructor
   * @param userService 
   */
  constructor(private readonly userService: UserService) {
  }

  ngOnInit(): void {
    // Perform any initialization logic here
        console.log('Resgistration::ngOnInit()');
  }
}
