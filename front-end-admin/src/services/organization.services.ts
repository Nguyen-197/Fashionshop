import { BaseService } from './base.services';
import axios from 'axios';
import { CommonUtil } from '../utils/common-util';

export class OrganizationService extends BaseService {
    constructor() {
        super('ZUNE', 'category');
    }

    public initTreeOrg() {
        return axios.get(`${this.baseUrl}/get-root`);
    }

    public lazyLoadTree(formData) {
        const buildParams = CommonUtil.buildParams(formData || {});
        return axios.get(`${this.baseUrl}/lazy-load-child`, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        })
    }
}

export default new OrganizationService();