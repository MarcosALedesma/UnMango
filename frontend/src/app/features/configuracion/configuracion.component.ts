import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../core/theme.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
  protected readonly theme = inject(ThemeService);
}
