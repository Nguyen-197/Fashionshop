import axios from 'axios';
import { BaseService } from './base.services';

export class SysMenuService extends BaseService {
    constructor() {
        super('YUNO', 'sys-menu');
    }

    public getMenu() {
        return axios.get(`${this.baseUrl}/getMenu`);
    }
}

export default new SysMenuService();