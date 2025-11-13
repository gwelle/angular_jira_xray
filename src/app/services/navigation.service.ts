
import { NavigationInterface } from '../interfaces/navigation.interface';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService implements NavigationInterface {

    private readonly router = inject(Router);

    /**
     * Navigate to a specified path with optional parameters
     * @param path The path to navigate to
     * @param params Optional parameters to include in the navigation
     */
    navigateTo(path: string, params?: unknown): void {
        const safeParams = (params && typeof params === 'object' && !Array.isArray(params))
            ? params as  Record<string, unknown> 
            : {};
            this.router.navigate([path], { queryParams: safeParams });
    }
}