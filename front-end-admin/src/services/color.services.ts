import { BaseService } from './base.services';

export class ColorService extends BaseService {
    constructor() {
        super('ZUNE', 'color');
    }
}

export default new ColorService();