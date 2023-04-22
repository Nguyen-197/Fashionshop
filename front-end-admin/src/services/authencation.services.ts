import axios from 'axios';
import { BaseService } from './base.services';

export class AccountService extends BaseService {
    constructor() {
        super('YUNO', 'auth');
    }

    public login(formData) {
        return axios.post(`${this.baseUrl}/login`, formData);
    }
}

export default new AccountService();