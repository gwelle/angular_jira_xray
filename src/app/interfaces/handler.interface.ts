import { FormGroup } from '@angular/forms';

export interface HandlerInterface  {
    handleResponse(response?: unknown): void;
    handleError(error: unknown, form?: FormGroup): void;
}