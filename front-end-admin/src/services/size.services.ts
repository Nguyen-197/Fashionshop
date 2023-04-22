import { BaseService } from './base.services';

export class SizeService extends BaseService {
    constructor() {
        super('YUNO', 'size');
    }
}

export default new SizeService();