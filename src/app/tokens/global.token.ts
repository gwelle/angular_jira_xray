
import { InjectionToken } from '@angular/core';

import { FormHelperErrorService } from '../services/form-helper-error.service';
import { FormHelperErrorInterface } from '../interfaces/fom-helper-error.interface';

import { NavigationInterface } from '../interfaces/navigation.interface';
import { NavigationService } from '../services/navigation.service';

export const FormHelperProviderInterface = new InjectionToken<FormHelperErrorInterface>(
    'FormHelperErrorInterface', { providedIn: 'root', factory: () => new FormHelperErrorService() });

export const NavigationHandlerProviderInterface = new InjectionToken<NavigationInterface>(
    'NavigationInterface',{ providedIn: 'root', factory: () => new NavigationService() });
