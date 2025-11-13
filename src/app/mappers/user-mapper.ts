import { FormGroup } from "@angular/forms";
import { User } from "../models/user.model";
import { UserMapperInterface } from "../interfaces/user-mapper.interface";

export class UserMapper implements UserMapperInterface {
  fromForm(form: FormGroup): User {
    const firstName = form.get('firstName')?.value || '';
      return new User(
        form.get('email')?.value,
        form.get('plainPassword')?.value,
        form.get('confirmPassword')?.value,
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
        form.get('lastName')?.value.toUpperCase()
      );
    }
}