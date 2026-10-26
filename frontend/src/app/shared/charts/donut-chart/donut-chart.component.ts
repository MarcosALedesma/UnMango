import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChartDatum } from '../chart-datum';

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="donut">
      <div class="ring">
        <svg viewBox="0 0 42 42" role="img" aria-label="Distribución del gasto por categoría">
          <circle
            cx="21"
            cy="21"
            r="15.9155"
            fill="none"
            stroke="var(--color-line)"
            stroke-width="5"
          />
          @for (s of segments(); track s.label) {
            <circle
              cx="21"
              cy="21"
              r="15.9155"
              fill="none"
              stroke-width="5"
              transform="rotate(-90 21 21)"
              [attr.stroke]="s.color"
              [attr.stroke-dasharray]="s.dash"
              [attr.stroke-dashoffset]="s.offset"
            />
          }
        </svg>
        <div class="center"><ng-content /></div>
      </div>

      <ul class="legend">
        @for (s of segments(); track s.label) {
          <li>
            <i [style.background]="s.color"></i>
            <span>{{ s.label }}</span>
            <b>{{ s.percent }}%</b>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .donut {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 24px;
    }

    .ring {
      position: relative;
      width: 180px;
      height: 180px;
    }

    .center {
      position: absolute;
      inset: 0;
      display: grid;
      align-content: center;
      justify-items: center;
      text-align: center;
      font-size: 12px;
      color: var(--color-muted);

      :first-child {
        color: var(--color-text);
        font-size: 18px;
        font-weight: 800;
      }
    }

    .legend {
      display: grid;
      flex: 1;
      gap: 8px;
      min-width: 150px;
      padding: 0;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
      }

      span {
        flex: 1;
      }

      i {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
    }
  `,
})
export class DonutChartComponent {
  readonly data = input.required<readonly ChartDatum[]>();

  protected readonly segments = computed(() => {
    const items = this.data().filter((d) => d.value > 0);
    const total = items.reduce((sum, d) => sum + d.value, 0);
    let accumulated = 0;
    return items.map((d) => {
      const percent = (d.value / total) * 100;
      const segment = {
        label: d.label,
        color: d.color,
        percent: Math.round(percent),
        dash: `${percent} ${100 - percent}`,
        offset: -accumulated,
      };
      accumulated += percent;
      return segment;
    });
  });
}
