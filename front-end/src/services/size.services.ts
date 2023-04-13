import { BaseService } from './base.services';

export class SizeService extends BaseService {
    constructor() {
        super('ZUNE', 'size');
    }
}

export default new SizeService();