import { bindFormat } from '../../../../packages/facilis-dom/src/index.ts';
import { accessCode } from './formats/accessCode.ts';

export function mountHomeAccessCodeDemo() {
    bindFormat('[data-home-access-code]', accessCode());
}
