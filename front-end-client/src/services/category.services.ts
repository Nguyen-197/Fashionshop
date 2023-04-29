import axios from 'axios';
import { CommonUtil } from 'src/utils/common-util';
import { BaseService } from './base.services';

export class CategoryService extends BaseService {
    constructor() {
        super('YUNO', 'categoryService');
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
    public findByCode(code) {
        return axios.get(`${this.baseUrl}/find-by-code/${code}`, {
            headers: { ['Content-Type']: 'application/json' },
        })
    }
}

export default new CategoryService();