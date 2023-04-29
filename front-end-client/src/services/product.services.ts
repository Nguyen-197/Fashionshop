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
        formData = _.cloneDeep(formData || {})
        formData = this.convertFormFile(formData || {});
        if (event) {
            formData.append("_search", JSON.stringify(event))
        }
        return axios.get(url, {
            headers: { ['Content-Type']: 'application/json' },
            params: formData
        });
    }

    public async getNewsProduct(formData?: any, event?: any) {
        const url = `${this.baseUrl}/news-product`;
        formData = _.cloneDeep(formData || {})
        formData = this.convertFormFile(formData || {});
        if (event) {
            formData.append("_search", JSON.stringify(event))
        }
        return axios.get(url, {
            headers: { ['Content-Type']: 'application/json' },
            params: formData
        });
    }

    public async getBestSellersProduct(formData?: any, event?: any) {
        const url = `${this.baseUrl}/best-sellers-product`;
        formData = _.cloneDeep(formData || {})
        formData = this.convertFormFile(formData || {});
        if (event) {
            formData.append("_search", JSON.stringify(event))
        }
        return axios.get(url, {
            headers: { ['Content-Type']: 'application/json' },
            params: formData
        });
    }
    public async getById(id: any) {
        const url = `${this.baseUrl}/find-by-id/${id}`;
        return await axios.get(url);
    }
}

export default new ProductService();