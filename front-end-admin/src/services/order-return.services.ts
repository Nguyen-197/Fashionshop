import axios from 'axios';
import _ from 'lodash';
import { CommonUtil } from 'src/utils/common-util';
import { BaseService } from './base.services';

export class OrderReturnService extends BaseService {
    constructor() {
        super('YUNO', 'orderReturn');
    }

    public async search(formData: any, event?: any) {
        const url = `${this.baseUrl}/admin/search-return-order`;
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        const buildParams = CommonUtil.buildParams(formData || {});
        return await axios.get(url, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        })
    }

    public async changeStatusRefund(orderReturnId: any) {
        const url = `${this.baseUrl}/admin/change-status-refund/${orderReturnId}`;
        return await axios.post(url);
    }

    public async changeStatusReturnOrder(orderReturnId: any, status: any) {
        const url = `${this.baseUrl}/admin/approve-return-order/${orderReturnId}?status=${status}`;
        return await axios.post(url);
    }

    public async getDetailReturn(orderReturnId: any) {
        const url = `${this.baseUrl}/admin/get-detail-return/${orderReturnId}`;
        return await axios.get(url);
    }
}

export default new OrderReturnService();