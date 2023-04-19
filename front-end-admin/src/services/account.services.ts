import axios from 'axios';
import { BaseService } from './base.services';

export class AccountService extends BaseService {
    constructor() {
        super('ZUNE', 'account');
    }

    public login(formData) {
        return axios.post(`${this.baseUrl}/login`, formData);
    }

    public getUserInfo() {
        return axios.get(`${this.baseUrl}/info`);
    }
}

export default new AccountService();