import { bindFormat } from '../../../../packages/facilis-dom/src/index.ts';
import { creditCard } from './formats/creditCard.ts';

export function mountHomeCreditCardDemo() {
    bindFormat('[data-home-credit-card]', creditCard());
}
