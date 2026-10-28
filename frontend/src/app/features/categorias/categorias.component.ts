import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CategoriesService } from '../../core/categories.service';
import { Category, CategoryDraft } from '../../core/models/category.model';
import { ToastService } from '../../core/toast.service';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { CategoryFormComponent } from './category-form/category-form.component';

type Editing = Category | 'new' | null;

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [PageHeaderComponent, CategoryIconComponent, IconComponent, CategoryFormComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriasComponent {
  private readonly categories = inject(CategoriesService);
  private readonly toast = inject(ToastService);

  protected readonly editing = signal<Editing>(null);

  protected readonly editingItem = computed(() => {
    const current = this.editing();
    return current === 'new' || current === null ? null : current;
  });

  protected readonly rows = computed(() =>
    this.categories.all().map((category) => ({
      category,
      usage: this.categories.usageOf(category.id),
    })),
  );

  protected openNew(): void {
    this.editing.set('new');
  }

  protected openEdit(category: Category): void {
    this.editing.set(category);
  }

  protected closeForm(): void {
    this.editing.set(null);
  }

  protected save(draft: CategoryDraft): void {
    const target = this.editingItem();
    if (target) {
      this.categories.update(target.id, draft);
      this.toast.show('Categoría actualizada');
    } else {
      this.categories.add(draft);
      this.toast.show('Categoría creada');
    }
    this.closeForm();
  }

  protected remove(category: Category): void {
    const usage = this.categories.usageOf(category.id);
    if (usage > 0) {
      this.toast.show(
        `No se puede eliminar "${category.name}": tiene ${usage} movimientos asociados.`,
        { kind: 'error' },
      );
      return;
    }
    this.categories.remove(category.id);
    this.toast.show('Categoría eliminada', {
      action: { label: 'Deshacer', run: () => this.categories.restore(category) },
    });
  }
}
