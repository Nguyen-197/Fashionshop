import { BaseService } from './base.services';
import { CommonUtil } from 'src/utils/common-util';
import axios from 'axios';
export class SaleOffService extends BaseService {
    constructor() {
        super('ZUNE', 'saleOffServices');
    }

    public async findById(id: any) {
        return await axios.get(`${this.baseUrl}/find-by-id/${id}`);
    }

    public async changeStatus(id: any, status: any) {
        return await axios.post(`${this.baseUrl}/admin/change-status-promotion/${id}?status=${status}`);
    }
}

export default new SaleOffService();