
import { inject, Injectable } from '@angular/core';
import { HandlerInterface } from '../interfaces/handler.interface';
import { NavigationHandlerProviderInterface } from '../tokens/global.token';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class RegistrationHandler implements HandlerInterface {

    private readonly navigationHandler = inject(NavigationHandlerProviderInterface);

    /**
     * Handles successful registration response.
     * @param response 
     */
    handleResponse(): void {
        this.navigationHandler.navigateTo('/login');
    }
        
    /**
     * Handles registration error response.
     * @param err
     * @param form
     * @returns void
     */
    handleError(err: HttpErrorResponse, form: FormGroup): void {
        if (err.status === 422 && err.error.violations) {
            const emailViolation = err.error.violations.find((v: { propertyPath: string }) =>{
                return v.propertyPath === 'email';
        })
            if (emailViolation) {
                form.get('email')?.setErrors({ alreadyExists: true });
                return;
            }
        };
    }
}