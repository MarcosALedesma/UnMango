import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ExpenseModalService } from '../../core/expense-modal.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { NAV_ITEMS } from '../nav-items';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavComponent {
  protected readonly modal = inject(ExpenseModalService);

  private readonly bar = NAV_ITEMS.filter((item) => item.inBottomBar);
  protected readonly left = this.bar.slice(0, 2);
  protected readonly right = this.bar.slice(2, 4);
}
