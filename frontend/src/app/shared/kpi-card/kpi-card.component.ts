import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { IconName } from '../icon/icon-paths';
import { MoneyPipe } from '../pipes/money.pipe';

export type KpiTone = 'green' | 'amber' | 'orange';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [IconComponent, MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="kpi card">
      <span class="badge" [attr.data-tone]="tone()">
        <app-icon [name]="icon()" [size]="22" />
      </span>
      <div class="body">
        <span class="label">{{ label() }}</span>
        <strong class="value">{{ valueMinor() | money }}</strong>
        @if (delta(); as d) {
          <span class="delta" [class.up]="d.kind === 'up'" [class.down]="d.kind === 'down'">
            @if (d.kind !== 'flat') {
              <app-icon [name]="d.kind === 'up' ? 'arrow-up' : 'arrow-down'" [size]="14" />
            }
            {{ d.text }}
            <small>vs. mes anterior</small>
          </span>
        } @else {
          <span class="delta"><small>Sin datos del mes anterior</small></span>
        }
      </div>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .kpi {
      display: flex;
      align-items: center;
      gap: 14px;
      height: 100%;
      padding: 16px;
    }

    .badge {
      display: grid;
      flex: none;
      place-items: center;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      color: #fff;

      &[data-tone='green'] {
        background: linear-gradient(135deg, var(--color-primary-2), var(--color-primary));
      }

      &[data-tone='amber'] {
        background: linear-gradient(135deg, var(--color-amber), #f59e0b);
      }

      &[data-tone='orange'] {
        background: linear-gradient(135deg, #fb923c, var(--color-orange));
      }
    }

    .body {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .label {
      color: var(--color-muted);
      font-size: 12px;
    }

    .value {
      font-size: 22px;
      font-weight: 800;
    }

    .delta {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 700;

      &.down {
        color: var(--color-primary);
      }

      &.up {
        color: var(--color-orange);
      }

      small {
        color: var(--color-muted);
        font-weight: 500;
      }
    }

    @media (max-width: 860px) {
      .kpi {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 12px;
      }

      .badge {
        width: 40px;
        height: 40px;
      }

      .value {
        font-size: 18px;
      }
    }
  `,
})
export class KpiCardComponent {
  readonly label = input.required<string>();
  readonly icon = input.required<IconName>();
  readonly tone = input<KpiTone>('green');
  readonly valueMinor = input.required<number>();
  readonly change = input<number | null>(null);

  protected readonly delta = computed(() => {
    const change = this.change();
    if (change === null) {
      return null;
    }
    const kind = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
    return { kind, text: `${Math.abs(change)}%` } as const;
  });
}
