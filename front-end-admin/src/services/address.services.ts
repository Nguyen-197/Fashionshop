import { BaseService } from './base.services';
import { CommonUtil } from 'src/utils/common-util';
import axios from 'axios';
export class AddressService extends BaseService {
    constructor() {
        super('YUNO', 'address');
    }
    public findByUserId(userId) {
        return axios.get(`${this.baseUrl}/find-all-by-user/${userId}`);
    }
}

export default new AddressService();