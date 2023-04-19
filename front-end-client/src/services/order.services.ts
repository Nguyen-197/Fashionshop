import axios from 'axios';
import { BaseService } from './base.services';

export class OrderService extends BaseService {
    constructor() {
        super('YUNO', 'orderService');
    }

    public async createOrder(formData: any) {
        const url = `${this.baseUrl}/customer/create-order`;
        return await axios.post(url, formData);
    }

    public async getOrderByStatus(status) {
        const url = `${this.baseUrl}/get-order-by-status?status=${status}`;
        return await axios.get(url);
    }

    public async cancelOrder(orderId: any) {
        const url = `${this.baseUrl}/customer/cancel-order/${orderId}`;
        return await axios.post(url);
    }
}

export default new OrderService();