import { FormGroup } from "@angular/forms";
import { UserMapperInterface } from "../interfaces/user-mapper.interface";
import { User } from "../models/user.model";

export class UserMapper implements UserMapperInterface {
  fromForm(form: FormGroup): User {
    if (!(form instanceof FormGroup)) {
      throw new Error('Invalid form: expected FormGroup instance');
    }
    const firstNameRaw = form.get('firstName')?.value ?? '';
    const firstName = firstNameRaw
      ? firstNameRaw.charAt(0).toUpperCase() + firstNameRaw.slice(1).toLowerCase()
      : '';
    const email = form.get('email')?.value ?? '';
    const plainPassword = form.get('plainPassword')?.value ?? '';
    const confirmationPassword = form.get('confirmationPassword')?.value ?? ''
    const lastNameRaw = form.get('lastName')?.value ?? '';
    const lastName = lastNameRaw ? lastNameRaw.toUpperCase() : '';
    
    return new User(email,plainPassword,confirmationPassword,firstName,lastName);
  }
}

