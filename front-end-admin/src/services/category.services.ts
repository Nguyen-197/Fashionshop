import { BaseService } from './base.services';
import { CommonUtil } from 'src/utils/common-util';
import axios from 'axios';
export class CategoryService extends BaseService {
    constructor() {
        super('ZUNE', 'category');
    }

    public initTreeCategory() {
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

export default new CategoryService();