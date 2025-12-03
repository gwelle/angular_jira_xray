
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

        // 1️⃣ On nettoie toutes les erreurs avant d'appliquer les nouvelles
        Object.keys(form.controls).forEach(key => {
            const control = form.get(key);
            if (control) control.setErrors(null);
        });

        // 2️⃣ Gestion des erreurs 422 envoyées par API Platform
        if (err.status === 422 && err.error?.violations) {
            
            // Dictionnaire pour regrouper les erreurs par champ
            const fieldErrors: Record<string, string[]> = {};

            for (const violation of err.error.violations) {
                const field = violation.propertyPath;

                if (!fieldErrors[field]) {
                    fieldErrors[field] = [];
                }

                fieldErrors[field].push(violation.message);
            }

            // Maintenant on applique UNE SEULE erreur par champ :
            // toujours la première
            Object.keys(fieldErrors).forEach(fieldName => {
                const control = form.get(fieldName);
                if (!control) return;

                const firstError = fieldErrors[fieldName][0]; // 👉 ici tu contrôles la priorité

                control.setErrors({ backend: firstError });
                control.markAsTouched();
                control.markAsDirty();

                console.log("ERREUR RETENUE POUR LE CHAMP :", fieldName, firstError);
            });

            return;
    }

    // 3️⃣ Erreur serveur
    if (err.status >= 500) {
        form.setErrors({
            backend: "Une erreur interne est survenue. Réessayez plus tard."
        });
    }
}

}