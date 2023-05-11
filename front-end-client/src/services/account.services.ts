import axios from 'axios';
import { BaseService } from './base.services';

export class AccountService extends BaseService {
    constructor() {
        super('YUNO', 'account');
    }

    public login(formData) {
        return axios.post(`${this.baseUrl}/login`, formData);
    }

    public getUserInfo() {
        return axios.get(`${this.baseUrl}/info`);
    }
    public changePassword(formData) {
        return axios.post(`${this.baseUrl}/change-password`, formData);
    }
}

export default new AccountService();