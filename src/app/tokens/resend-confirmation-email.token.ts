// form-helper.token.ts

import { InjectionToken } from '@angular/core';
import { ResendConfirmationEmailInterface } from '../interfaces/resend-confirmation-email.interface';  
import { HandlerInterface } from '../interfaces/handler.interface';
import { ResendConfirmationEmailHandler } from '../handlers/resend-confirmation-email.handler'; 

export const ResendConfirmationEmailProviderInterface = new InjectionToken<ResendConfirmationEmailInterface>('ResendConfirmationEmailInterface');
export const HandlerProviderInterface = new InjectionToken<HandlerInterface>(
    'HandlerInterface', { providedIn: 'root', factory: () => new ResendConfirmationEmailHandler() });