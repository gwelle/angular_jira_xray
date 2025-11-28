
import { inject, Injectable } from '@angular/core';
import { HandlerInterface } from '../interfaces/handler.interface';
import { NavigationHandlerProviderInterface } from '../tokens/global.token';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { ValidationViolation } from '../interfaces/validation-violation.interface';

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

        // On nettoie d'abord toutes les erreurs existantes
        Object.keys(form.controls).forEach(key => {
            const control = form.get(key);
            if (control) control.setErrors(null);
        });

        if (err.status === 422 && err.error?.violations) {
            err.error.violations.forEach((v: ValidationViolation) => {
                const control = form.get(v.propertyPath);
                if (!control) return; 

                control.setErrors({ backend: v.message });

                control.markAsTouched(); // Pour afficher l'erreur immédiatement
                control.markAsDirty(); // Pour marquer le champ comme modifié
                console.log("ERREURS DU CHAMP :", v.propertyPath, control.errors);
            });
            
            return;
        } 
        
        if (err.status >= 500) {
            form.setErrors({ backend: "Une erreur interne est survenue. Réessayez plus tard." });
        }
    }
}