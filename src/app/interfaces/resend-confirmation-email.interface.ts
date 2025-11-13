import { Observable } from "rxjs";
import { ResendResponse } from "./resend-response.interface";
import { HttpClient } from "@angular/common/http";

export interface ResendConfirmationEmailInterface {

    readonly apiUrl: string;
    readonly http: HttpClient;

    resendConfirmationEmail(email: string): Observable<ResendResponse>
}