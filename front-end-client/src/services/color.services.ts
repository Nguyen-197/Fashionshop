import { BaseService } from './base.services';

export class ColorService extends BaseService {
    constructor() {
        super('YUNO', 'color');
    }
}

export default new ColorService();