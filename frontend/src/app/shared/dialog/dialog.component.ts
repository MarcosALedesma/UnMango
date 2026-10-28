import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

let nextId = 0;

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #root
      class="backdrop"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      [attr.aria-labelledby]="titleId"
      (click)="onBackdrop($event)"
      (keydown.escape)="closed.emit()"
    >
      <div class="sheet">
        <header>
          <button type="button" class="back" aria-label="Cerrar" (click)="closed.emit()">
            <app-icon name="back" />
          </button>
          <h2 [id]="titleId">{{ title() }}</h2>
        </header>
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: #0008;
      outline: none;
    }

    .sheet {
      display: grid;
      gap: 14px;
      width: 100%;
      max-width: 440px;
      max-height: 100%;
      padding: 22px;
      overflow-y: auto;
      border-radius: 20px;
      background: var(--color-card);
    }

    header {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        font-size: 18px;
      }
    }

    .back {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 50%;
      background: none;
      cursor: pointer;
    }

    @media (max-width: 860px) {
      .backdrop {
        align-items: stretch;
        padding: 0;
      }

      .sheet {
        max-width: none;
        align-content: start;
        padding: 16px;
        border-radius: 0;
      }
    }
  `,
})
export class DialogComponent implements AfterViewInit {
  readonly title = input.required<string>();
  readonly closed = output<void>();

  protected readonly titleId = `dialog-title-${nextId++}`;
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  ngAfterViewInit(): void {
    this.root().nativeElement.focus();
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
