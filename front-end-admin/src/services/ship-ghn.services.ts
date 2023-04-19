import axios from 'axios';
import _ from 'lodash';
import { GHN_TOKEN, SHOP_ID } from 'src/@types/constants';
import { CommonUtil } from 'src/utils/common-util';
import { BaseService } from './base.services';

export class ShipService extends BaseService {
    constructor() {
        super('SHIP', 'shipOrderService');
    }

    public async previewCheckout(formData) {
        const url = `${this.baseUrl}/preview`;
        return await axios.post(url, formData, { headers: { 'ShopId': SHOP_ID, Authorization: GHN_TOKEN } });
    }
    public async getServicesType(formData) {
        const url = `${this.baseUrl}/available-services`;
        return await axios.post(url, formData, { headers: { 'ShopId': SHOP_ID, Authorization: GHN_TOKEN } });
    }
    public async saveOrder(formData) {
        const url = `${this.baseUrl}/create`;
        return await axios.post(url, formData, { headers: { 'ShopId': SHOP_ID, Authorization: GHN_TOKEN } });
    }
}

export default new ShipService();