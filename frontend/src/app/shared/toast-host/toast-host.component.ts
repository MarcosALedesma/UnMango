import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastAction, ToastService } from '../../core/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="host" role="status" aria-live="polite">
      @for (toast of toasts.all(); track toast.id) {
        <div class="toast" [class.fail]="toast.kind === 'error'">
          <span class="msg">{{ toast.message }}</span>
          @if (toast.action; as action) {
            <button type="button" class="act" (click)="run(action, toast.id)">
              {{ action.label }}
            </button>
          }
          <button
            type="button"
            class="x"
            aria-label="Cerrar aviso"
            (click)="toasts.dismiss(toast.id)"
          >
            <app-icon name="close" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .host {
      position: fixed;
      bottom: 24px;
      left: 50%;
      z-index: 30;
      display: grid;
      gap: 8px;
      width: min(440px, calc(100% - 24px));
      transform: translateX(-50%);
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      background: var(--color-dark);
      color: #fff;
      box-shadow: var(--shadow-pop);
      pointer-events: auto;

      &.fail {
        background: var(--color-danger);
      }
    }

    .msg {
      flex: 1;
      font-weight: 600;
    }

    .act {
      padding: 6px 10px;
      border: 0;
      border-radius: 8px;
      background: #ffffff26;
      color: var(--color-amber);
      font-weight: 700;
      cursor: pointer;
    }

    .x {
      display: grid;
      place-items: center;
      border: 0;
      background: none;
      color: inherit;
      cursor: pointer;
      opacity: 0.8;
    }

    @media (max-width: 860px) {
      .host {
        bottom: calc(84px + env(safe-area-inset-bottom, 0px));
      }
    }
  `,
})
export class ToastHostComponent {
  protected readonly toasts = inject(ToastService);

  protected run(action: ToastAction, id: number): void {
    action.run();
    this.toasts.dismiss(id);
  }
}
