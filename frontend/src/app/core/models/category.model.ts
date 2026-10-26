import { IconName } from '../../shared/icon/icon-paths';

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly icon: IconName;
  readonly color: string;
}
