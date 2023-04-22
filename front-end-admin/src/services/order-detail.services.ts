import axios from 'axios';
import _ from 'lodash';
import { CommonUtil } from 'src/utils/common-util';
import { BaseService } from './base.services';

export class OrderDetailService extends BaseService {
    constructor() {
        super('YUNO', 'orderDetail');
    }

    public async getDetailOrder(orderId) {
        return await axios.get(`${this.baseUrl}/admin/get-detail/${orderId}`);
    }


}

export default new OrderDetailService();