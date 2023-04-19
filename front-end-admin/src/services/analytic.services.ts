import { BaseService } from './base.services';
import { CommonUtil } from 'src/utils/common-util';
import axios from 'axios';
export class AnalyticService extends BaseService {
    constructor() {
        super('ZUNE', 'analyticService');
    }
    public async reportStatusOrder(date: any) {
        const url = `${this.baseUrl}/total-status-order`;
        return await axios.get(url, { params: { date: date }});
    }
    public async reportTotalReturnOrder(date: any) {
        const url = `${this.baseUrl}/total-order-return`;
        return await axios.get(url, { params: { date: date }});
    }
    public async reportTotalAmountOrder(date: any) {
        const url = `${this.baseUrl}/total-price-order`;
        return await axios.get(url, { params: { date: date }});
    }
    public async reportTotalOrder(date: any) {
        const url = `${this.baseUrl}/total-order`;
        return await axios.get(url, { params: { date: date }});
    }
}

export default new AnalyticService();