import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpensesService } from '../../core/expenses.service';
import { ToastService } from '../../core/toast.service';
import { ExpenseSubmission } from '../../shared/expense-modal/expense-draft';
import { ExpenseModalComponent } from '../../shared/expense-modal/expense-modal.component';
import { ToastHostComponent } from '../../shared/toast-host/toast-host.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopBarComponent,
    BottomNavComponent,
    ExpenseModalComponent,
    ToastHostComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly expenses = inject(ExpensesService);
  private readonly toast = inject(ToastService);

  protected onSaved({ id, draft }: ExpenseSubmission): void {
    if (id === null) {
      this.expenses.add({ ...draft, origin: 'PERSONAL' });
      this.toast.show('Gasto guardado');
    } else {
      this.expenses.update(id, draft);
      this.toast.show('Gasto actualizado');
    }
  }
}
