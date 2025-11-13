import { Observable } from "rxjs";
import { User } from "../models/user.model";
import { HttpClient } from "@angular/common/http";

export interface RegistrationInterface {

    readonly apiUrl: string;
    readonly http: HttpClient;

    register(user: User): Observable<User>
}