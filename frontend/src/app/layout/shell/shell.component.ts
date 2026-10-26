import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpensesService } from '../../core/expenses.service';
import { ExpenseDraft } from '../../shared/expense-modal/expense-draft';
import { ExpenseModalComponent } from '../../shared/expense-modal/expense-modal.component';
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
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly expenses = inject(ExpensesService);

  protected onSaved(draft: ExpenseDraft): void {
    this.expenses.add({ ...draft, origin: 'PERSONAL' });
  }
}
