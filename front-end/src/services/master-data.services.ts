import axios from 'axios';
import _ from 'lodash';
import { GHN_TOKEN, SHOP_ID } from 'src/@types/constants';
import { BaseService } from './base.services';

export class ShipService extends BaseService {
    constructor() {
        super('SHIP', 'masterDataService');
    }
    public async filterByGroupCode(code: any, path?: string) {
        const url = `${this.baseUrl}${path ? `/${path}` : ''}`;
        return await axios.get(url, { headers: { 'ShopId': SHOP_ID, Authorization: GHN_TOKEN }, params: { code } });
    }
    public async getProvince() {
        const url = `${this.baseUrl}/province`;
        return await axios.get(url, { headers: { 'ShopId': SHOP_ID, Authorization: GHN_TOKEN } });
    }
    public async getDistrict(code: any, path?: string) {
        const url = `${this.baseUrl}/district`;
        return await axios.get(url, { headers: { 'ShopId': SHOP_ID, Authorization: GHN_TOKEN }, params: { province_id: code } });
    }
    public async getWard(code: any, path?: string) {
        const url = `${this.baseUrl}/ward`;
        return await axios.get(url, { headers: { 'ShopId': SHOP_ID, Authorization: GHN_TOKEN }, params: { district_id: code } });
    }
}

export default new ShipService();