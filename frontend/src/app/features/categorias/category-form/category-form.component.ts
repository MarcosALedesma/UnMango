import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CategoriesService } from '../../../core/categories.service';
import { Category, CategoryDraft } from '../../../core/models/category.model';
import { CategoryIconComponent } from '../../../shared/category-icon/category-icon.component';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { IconName } from '../../../shared/icon/icon-paths';

interface ColorOption {
  readonly value: string;
  readonly label: string;
}

interface IconOption {
  readonly name: IconName;
  readonly label: string;
}

const COLORS: readonly ColorOption[] = [
  { value: '#1fa855', label: 'Verde' },
  { value: '#84cc16', label: 'Lima' },
  { value: '#fbbf24', label: 'Ámbar' },
  { value: '#f97316', label: 'Naranja' },
  { value: '#ef4444', label: 'Rojo' },
  { value: '#8b5cf6', label: 'Violeta' },
  { value: '#0ea5e9', label: 'Celeste' },
  { value: '#94a3b8', label: 'Gris' },
];

const ICONS: readonly IconOption[] = [
  { name: 'home', label: 'Casa' },
  { name: 'utensils', label: 'Comida' },
  { name: 'car', label: 'Auto' },
  { name: 'film', label: 'Cine' },
  { name: 'heart', label: 'Salud' },
  { name: 'tv', label: 'Pantalla' },
  { name: 'events', label: 'Calendario' },
  { name: 'categories', label: 'Etiqueta' },
];

const DEFAULT_ICON: IconName = 'categories';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, DialogComponent, CategoryIconComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-dialog
      [title]="isEdit() ? 'Editar categoría' : 'Nueva categoría'"
      (closed)="cancelled.emit()"
    >
      <form class="form" [formGroup]="form" (ngSubmit)="submit()">
        <div class="preview">
          <app-category-icon [category]="preview()" [size]="24" />
          <strong>{{ form.controls.name.value || 'Nombre' }}</strong>
        </div>

        <div class="field">
          <label for="cat-name">Nombre <b class="req">*</b></label>
          <input id="cat-name" formControlName="name" placeholder="Mascotas" />
          @if (form.controls.name.touched && form.controls.name.hasError('required')) {
            <small class="field-error">Ingresá un nombre.</small>
          }
          @if (form.controls.name.hasError('taken')) {
            <small class="field-error">Ya existe una categoría con ese nombre.</small>
          }
        </div>

        <div class="field">
          <span class="lbl" id="cat-color-label">Color</span>
          <div class="options" role="radiogroup" aria-labelledby="cat-color-label">
            @for (c of colors; track c.value) {
              <button
                type="button"
                role="radio"
                class="swatch"
                [class.on]="form.controls.color.value === c.value"
                [style.background]="c.value"
                [attr.aria-checked]="form.controls.color.value === c.value"
                [attr.aria-label]="c.label"
                (click)="form.controls.color.setValue(c.value)"
              ></button>
            }
          </div>
        </div>

        <div class="field">
          <span class="lbl" id="cat-icon-label">Ícono</span>
          <div class="options" role="radiogroup" aria-labelledby="cat-icon-label">
            @for (i of icons; track i.name) {
              <button
                type="button"
                role="radio"
                class="pick"
                [class.on]="form.controls.icon.value === i.name"
                [attr.aria-checked]="form.controls.icon.value === i.name"
                [attr.aria-label]="i.label"
                (click)="form.controls.icon.setValue(i.name)"
              >
                <app-icon [name]="i.name" [size]="20" />
              </button>
            }
          </div>
        </div>

        <button type="submit" class="cta">Guardar</button>
      </form>
    </app-dialog>
  `,
  styles: `
    .preview {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: var(--radius-sm);
      background: var(--color-bg);
    }

    .lbl {
      font-size: 13px;
      font-weight: 600;
    }

    .options {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .swatch {
      width: 32px;
      height: 32px;
      border: 2px solid transparent;
      border-radius: 50%;
      cursor: pointer;

      &.on {
        box-shadow:
          0 0 0 2px var(--color-card),
          0 0 0 4px var(--color-text);
      }
    }

    .pick {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border: 1px solid var(--color-line);
      border-radius: 10px;
      background: var(--color-card);
      color: var(--color-muted);
      cursor: pointer;

      &.on {
        border-color: var(--color-primary);
        background: var(--color-primary-soft);
        color: var(--color-primary);
      }
    }
  `,
})
export class CategoryFormComponent implements OnInit {
  private readonly categories = inject(CategoriesService);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly item = input<Category | null>(null);
  readonly saved = output<CategoryDraft>();
  readonly cancelled = output<void>();

  protected readonly isEdit = computed(() => this.item() !== null);
  protected readonly colors = COLORS;
  protected readonly icons = ICONS;

  private readonly uniqueName: ValidatorFn = (control) => {
    const value: unknown = control.value;
    const name = typeof value === 'string' ? value : '';
    return this.categories.nameTaken(name, this.item()?.id ?? null) ? { taken: true } : null;
  };

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(40), this.uniqueName]],
    color: [COLORS[0]?.value ?? '#1fa855'],
    icon: [DEFAULT_ICON],
  });

  ngOnInit(): void {
    const item = this.item();
    if (!item) {
      return;
    }
    this.form.reset({ name: item.name, color: item.color, icon: item.icon });
  }

  protected preview(): Category {
    const value = this.form.getRawValue();
    return { id: 'preview', name: value.name, icon: value.icon, color: value.color };
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({ name: value.name.trim(), icon: value.icon, color: value.color });
  }
}
