import axios from 'axios';
import { CommonUtil } from 'src/utils/common-util';
import { BaseService } from './base.services';

export class ProductDetailService extends BaseService {
    constructor() {
        super('YUNO', 'productDetailService');
    }

    public async getProductDetail(productId: any) {
        const url = `${this.baseUrl}/find-detail/${productId}`;
        return await axios.get(url);
    }

    public async getProductByCondition(formData: any) {
        const url = `${this.baseUrl}/find-by-condition`;
        formData = CommonUtil.buildParams(formData);
        return await axios.get(url, { params: formData, isLoading: false });
    }
}

export default new ProductDetailService();