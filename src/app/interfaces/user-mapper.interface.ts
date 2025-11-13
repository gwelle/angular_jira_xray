import { User } from "../models/user.model";
import { FormGroup } from "@angular/forms";

export interface UserMapperInterface {
   fromForm(form: FormGroup): User;
}
