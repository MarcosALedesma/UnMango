import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MoneyPipe } from '../../pipes/money.pipe';
import { ChartDatum } from '../chart-datum';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [MoneyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart" role="img" aria-label="Gráfico de barras de gastos por categoría">
      @for (bar of bars(); track bar.label) {
        <div class="col" [title]="bar.label + ': ' + (bar.value | money)">
          <div class="track">
            <div class="bar" [style.height.%]="bar.percent" [style.background]="bar.color"></div>
          </div>
          <span class="lbl">{{ bar.label }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    .chart {
      display: flex;
      gap: 10px;
      height: 230px;
    }

    .col {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .track {
      display: flex;
      flex: 1;
      align-items: flex-end;
      justify-content: center;
      border-bottom: 1px solid var(--color-line);
    }

    .bar {
      width: min(38px, 70%);
      min-height: 2px;
      border-radius: 8px 8px 0 0;
    }

    .lbl {
      overflow: hidden;
      color: var(--color-muted);
      font-size: 11px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
})
export class BarChartComponent {
  readonly data = input.required<readonly ChartDatum[]>();

  protected readonly bars = computed(() => {
    const items = this.data();
    const max = Math.max(1, ...items.map((d) => d.value));
    return items.map((d) => ({ ...d, percent: (d.value / max) * 100 }));
  });
}
