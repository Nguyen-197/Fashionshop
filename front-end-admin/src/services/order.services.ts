import axios from 'axios';
import _ from 'lodash';
import { CommonUtil } from 'src/utils/common-util';
import { BaseService } from './base.services';

export class OrderService extends BaseService {
    constructor() {
        super('YUNO', 'order');
    }

    public async searchOrders(formData, event?) {
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        const buildParams = CommonUtil.buildParams(formData || {});
        return axios.get(`${this.baseUrl}/search-order`, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        });
    }

    public async getOrderDetail(orderId: any) {
        return await axios.get(`${this.baseUrl}/admin/find-order-by-id/${orderId}`);
    }

    public async cancelOrder(orderId: any) {
        return await axios.post(`${this.baseUrl}/admin/cancel-order/${orderId}`);
    }

    public async changeStatusOrder(orderId: any, status: any) {
        return await axios.post(`${this.baseUrl}/admin/change-status-order/${orderId}?status=${status}`);
    }

    public async downloadBill(orderId: any) {
        return await axios.get(`${this.baseUrl}/downloadBill/${orderId}`);
    }

    public async changePaymentStatus(orderId: any) {
        return await axios.post(`${this.baseUrl}/admin/change-payment-status/${orderId}`);
    }

    public async searchOrderProbablyReturn(formData: any, event?: any) {
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        const buildParams = CommonUtil.buildParams(formData || {});
        return axios.get(`${this.baseUrl}/admin/get-order-probably-return`, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        });
    }

    public async getOrderReturn(orderId: any) {
        return await axios.get(`${this.baseUrl}/admin/get-order-detail-probably-return/${orderId}`);
    }
}

export default new OrderService();