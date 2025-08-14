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
    }
];