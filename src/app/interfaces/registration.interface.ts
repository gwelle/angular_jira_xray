import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UserPayload } from "./user-payload.interface";

export interface RegistrationInterface {

    readonly apiUrl: string;
    readonly http: HttpClient;

    register(user:  UserPayload): Observable<UserPayload>
}