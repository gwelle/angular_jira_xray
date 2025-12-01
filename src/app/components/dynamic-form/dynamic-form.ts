import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule,  } from '@angular/forms';
import { FormField } from '../../interfaces/form-field.interface';

@Component({
  standalone: true,
  selector: 'app-dynamic-form',
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dynamic-form.html'
})
export class DynamicForm {

  @Input() form!: FormGroup;
  @Input() formFieldsState!: Signal<FormField[]>;
  @Input() title = '';
  @Input() buttonLabel = 'Valider';
  
  //@Output() formReady = new EventEmitter<FormGroup>();
  @Output() submitted = new EventEmitter<void>();

  /*ngOnInit(): void {
    this.formReady.emit(this.form);
  }*/

  onSubmit(): void {
    // Montre toutes les erreurs
    this.form.markAllAsTouched();

    // Si formulaire invalide, ne pas notifier Registration
    if (this.form.invalid) return;

    // Notifie les composants (ex: registration)
    this.submitted.emit();
  }
}
