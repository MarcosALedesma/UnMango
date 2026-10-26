import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="pager" aria-label="Paginación">
      <button
        type="button"
        class="pg"
        aria-label="Página anterior"
        [disabled]="page() <= 1"
        (click)="pageChange.emit(page() - 1)"
      >
        <app-icon name="chevron-left" [size]="16" />
      </button>

      @for (p of pages(); track p) {
        <button
          type="button"
          class="pg"
          [class.on]="p === page()"
          [attr.aria-current]="p === page() ? 'page' : null"
          (click)="pageChange.emit(p)"
        >
          {{ p }}
        </button>
      }

      <button
        type="button"
        class="pg"
        aria-label="Página siguiente"
        [disabled]="page() >= totalPages()"
        (click)="pageChange.emit(page() + 1)"
      >
        <app-icon name="chevron-right" [size]="16" />
      </button>
    </nav>
  `,
  styles: `
    .pager {
      display: flex;
      gap: 6px;
    }

    .pg {
      display: grid;
      place-items: center;
      min-width: 34px;
      height: 34px;
      padding: 0 8px;
      border: 1px solid var(--color-line);
      border-radius: 10px;
      background: var(--color-card);
      font-weight: 600;
      cursor: pointer;

      &.on {
        border-color: var(--color-primary);
        background: var(--color-primary);
        color: #fff;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.45;
      }
    }
  `,
})
export class PaginatorComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const start = Math.max(1, Math.min(this.page() - 2, total - 4));
    const end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
}
