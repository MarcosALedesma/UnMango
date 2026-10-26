import { Pipe, PipeTransform } from '@angular/core';

const WHOLE = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const WITH_CENTS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

@Pipe({ name: 'money', standalone: true })
export class MoneyPipe implements PipeTransform {
  transform(amountMinor: number): string {
    const formatter = amountMinor % 100 === 0 ? WHOLE : WITH_CENTS;
    return formatter.format(amountMinor / 100);
  }
}
