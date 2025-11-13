// form-helper.token.ts

import { InjectionToken } from '@angular/core';
import { UserMapperInterface } from '../interfaces/user-mapper.interface';
import { RegistrationInterface } from '../interfaces/registration.interface';
import { HandlerInterface } from '../interfaces/handler.interface';
import { RegistrationHandler } from '../handlers/registration.handler';

export const UserMapperProviderInterface = new InjectionToken<UserMapperInterface>('UserMapperInterface');
export const RegistrationProviderInterface = new InjectionToken<RegistrationInterface>('RegistrationInterface'); 
export const HandlerProviderInterface = new InjectionToken<HandlerInterface>(
    'HandlerInterface', { providedIn: 'root', factory: () => new RegistrationHandler() });