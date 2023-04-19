import { BaseService } from './base.services';
import { CommonUtil } from 'src/utils/common-util';
import axios from 'axios';
import _ from 'lodash';
export class ProductService extends BaseService {
    constructor() {
        super('ZUNE', 'product-details');
    }
    public async saveOrUpdate(formData) {
        formData = CommonUtil.convertFormFile(formData);
        return await axios.post(`${this.baseUrl}`, formData);
    }

    public async searchDetail(formData?: any, event?: any) {
        const url = `${this.baseUrl}/search-details`;
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        const buildParams = CommonUtil.buildParams(formData || {});
        return await axios.get(url, { headers: { ['Content-Type']: 'application/json' },params: buildParams});
    }
}

export default new ProductService();