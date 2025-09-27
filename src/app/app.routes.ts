import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'registration',
        pathMatch: 'full'
    },
    {
        path: 'registration',
        loadComponent: () => import('./components/registration/registration').then(m => m.Registration)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    {
        path: 'resend_confirmation',
        loadComponent: () => import('./components/resend/resend-confirmation-email').then(m => m.ResendConfirmationEmail)
    }
];