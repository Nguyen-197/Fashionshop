import axios from 'axios';
import _ from 'lodash';
import { CommonUtil } from 'src/utils/common-util';
import { BaseService } from './base.services';

export class ProductService extends BaseService {
    constructor() {
        super('YUNO', 'productService');
    }

    public async getProductSales(formData?: any, event?: any) {
        const url = `${this.baseUrl}/product-sales`;
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        // formData = this.convertFormFile(formData || {});
        const buildParams = CommonUtil.buildParams(formData || {});
        return axios.get(url, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        });
    }

    public async getNewsProduct(formData?: any, event?: any) {
        const url = `${this.baseUrl}/news-product`;
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        // formData = this.convertFormFile(formData || {});
        const buildParams = CommonUtil.buildParams(formData || {});
        return axios.get(url, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        });
    }

    public async getBestSellersProduct(formData?: any, event?: any) {
        const url = `${this.baseUrl}/best-sellers-product`;
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        // formData = this.convertFormFile(formData || {});
        const buildParams = CommonUtil.buildParams(formData || {});
        return axios.get(url, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        });
    }
    public async getById(id: any) {
        const url = `${this.baseUrl}/find-by-id/${id}`;
        return await axios.get(url);
    }
}

export default new ProductService();