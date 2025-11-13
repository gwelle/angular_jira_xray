
import { HandlerInterface } from '../interfaces/handler.interface';
import { ResendResponse } from '../interfaces/resend-response.interface';
import { inject, Injectable } from '@angular/core';
import { NavigationHandlerProviderInterface } from '../tokens/global.token';

@Injectable({ providedIn: 'root' })
export class ResendConfirmationEmailHandler implements HandlerInterface {

    private readonly navigationHandler = inject(NavigationHandlerProviderInterface);

    /**
     * Handles successful registration response.
     * @param response 
     */
    handleResponse(response: ResendResponse): void {
        if (response.error === 'max_resend_reached') {
            this.navigationHandler.navigateTo('/login', { activated: 0, error: 'max_resend_reached' });
        } 
        else {
        this.navigationHandler.navigateTo('/login', { activated: 0, info: 'check_resend_email' });
        }
    }

    /**
     * Handles resend confirmation email error.
     * @param error 
     */
    handleError(error: unknown): void {
        console.error('Resend confirmation email error:', error);
    }
}