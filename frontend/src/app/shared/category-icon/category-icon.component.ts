import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Category } from '../../core/models/category.model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-category-icon',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="box"
      [style.background]="category()?.color ?? 'var(--color-muted)'"
      [style.width.px]="size() + 16"
      [style.height.px]="size() + 16"
    >
      <app-icon [name]="category()?.icon ?? 'categories'" [size]="size()" />
    </span>
  `,
  styles: `
    .box {
      display: inline-grid;
      flex: none;
      place-items: center;
      border-radius: 10px;
      color: #fff;
    }
  `,
})
export class CategoryIconComponent {
  readonly category = input<Category | undefined>(undefined);
  readonly size = input<number>(18);
}
