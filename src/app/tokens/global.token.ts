
import { InjectionToken } from '@angular/core';

import { FormHelperService } from '../services/form-helper.service';
import { FormHelperInterface } from '../interfaces/fom-helper.interface';

import { NavigationInterface } from '../interfaces/navigation.interface';
import { NavigationService } from '../services/navigation.service';

export const FormHelperProviderInterface = new InjectionToken<FormHelperInterface>(
    'FormHelperInterface', { providedIn: 'root', factory: () => new FormHelperService() });

export const NavigationHandlerProviderInterface = new InjectionToken<NavigationInterface>(
    'NavigationInterface',{ providedIn: 'root', factory: () => new NavigationService() });