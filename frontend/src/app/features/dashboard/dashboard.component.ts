import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { CategoriesService } from '../../core/categories.service';
import { ExpensesService } from '../../core/expenses.service';
import { ExpenseOrigin } from '../../core/models/expense.model';
import { PERIODICITY_LABEL } from '../../core/models/recurring-expense.model';
import { RecurringService } from '../../core/recurring.service';
import {
  inMonth,
  monthKey,
  percentChange,
  previousMonthKey,
  totalOf,
  totalsByCategory,
} from '../../core/summary';
import { BarChartComponent } from '../../shared/charts/bar-chart/bar-chart.component';
import { ChartDatum } from '../../shared/charts/chart-datum';
import { DonutChartComponent } from '../../shared/charts/donut-chart/donut-chart.component';
import { CategoryIconComponent } from '../../shared/category-icon/category-icon.component';
import {
  ExpenseRow,
  ExpenseTableComponent,
} from '../../shared/expense-table/expense-table.component';
import { IconName } from '../../shared/icon/icon-paths';
import { KpiCardComponent, KpiTone } from '../../shared/kpi-card/kpi-card.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { ShortDatePipe } from '../../shared/pipes/short-date.pipe';

interface Kpi {
  readonly label: string;
  readonly icon: IconName;
  readonly tone: KpiTone;
  readonly valueMinor: number;
  readonly change: number | null;
}

const FALLBACK_COLOR = '#94a3b8';
const SOON_DAYS = 5;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    KpiCardComponent,
    BarChartComponent,
    DonutChartComponent,
    ExpenseTableComponent,
    CategoryIconComponent,
    MoneyPipe,
    ShortDatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly expenses = inject(ExpensesService);
  private readonly categories = inject(CategoriesService);
  private readonly recurring = inject(RecurringService);

  private readonly now = new Date();
  private readonly currentMonth = monthKey(this.now);
  private readonly previousMonth = previousMonthKey(this.now);

  protected readonly periodicityLabel = PERIODICITY_LABEL;

  private readonly monthExpenses = computed(() => inMonth(this.expenses.all(), this.currentMonth));

  protected readonly monthTotal = computed(() => totalOf(this.monthExpenses()));

  protected readonly kpis = computed<readonly Kpi[]>(() => {
    const all = this.expenses.all();
    const build = (label: string, icon: IconName, tone: KpiTone, origin?: ExpenseOrigin): Kpi => {
      const current = totalOf(inMonth(all, this.currentMonth, origin));
      const previous = totalOf(inMonth(all, this.previousMonth, origin));
      return { label, icon, tone, valueMinor: current, change: percentChange(current, previous) };
    };
    return [
      build('Gastos del mes', 'expenses', 'green', 'PERSONAL'),
      build('Gastos fijos', 'recurring', 'amber', 'RECURRING'),
      build('Eventos', 'events', 'orange', 'EVENT'),
      build('Total gastado', 'check', 'green'),
    ];
  });

  protected readonly chartData = computed<readonly ChartDatum[]>(() =>
    totalsByCategory(this.monthExpenses()).map((total) => {
      const category = this.categories.byId(total.categoryId);
      return {
        label: category?.name ?? 'Sin categoría',
        value: total.totalMinor,
        color: category?.color ?? FALLBACK_COLOR,
      };
    }),
  );

  protected readonly recentRows = computed<readonly ExpenseRow[]>(() =>
    this.expenses
      .all()
      .slice(0, 5)
      .map((expense) => ({ expense, category: this.categories.byId(expense.categoryId) })),
  );

  protected readonly upcoming = computed(() =>
    this.recurring
      .upcoming()
      .slice(0, 3)
      .map((item) => ({
        item,
        category: this.categories.byId(item.categoryId),
        soon: differenceInCalendarDays(parseISO(item.nextDueDate), this.now) <= SOON_DAYS,
      })),
  );
}
