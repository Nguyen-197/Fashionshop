import { BaseService } from './base.services';
import { CommonUtil } from 'src/utils/common-util';
import axios from 'axios';
export class ProductService extends BaseService {
    constructor() {
        super('ZUNE', 'product');
    }

    public async saveOrUpdate(formData) {
        formData = CommonUtil.convertFormFile(formData);
        return await axios.post(`${this.baseUrl}`, formData);
    }
    public async dowloadTemplate() {
        return await axios.get(`${this.baseUrl}/export-product`, { responseType: 'blob' });
	}
    public async filterProduct(data?) {
        const buildParams = CommonUtil.buildParams(data || {});
        return await axios.get(`${this.baseUrl}/get-all-product`, { params: buildParams });
    }
    public async changeBussiness(id: any) {
        return await axios.get(`${this.baseUrl}/stop-selling-products/${id}`);
    }
}

export default new ProductService();