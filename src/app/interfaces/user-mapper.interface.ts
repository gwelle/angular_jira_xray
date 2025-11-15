import { FormGroup } from "@angular/forms";
import { User } from "../models/user.model";

export interface UserMapperInterface {
   fromForm(form: FormGroup): User;
}
