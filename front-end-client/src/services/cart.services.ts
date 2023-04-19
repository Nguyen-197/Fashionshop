import axios from 'axios';
import { BaseService } from './base.services';

export class CartService extends BaseService {
    constructor() {
        super('YUNO', 'cartService');
    }

    public async addCartItem(formData: any) {
        const url = `${this.baseUrl}`;
        return await axios.post(url, formData);
    }

    public async getUserCarts() {
        const url = `${this.baseUrl}/get-cart`;
        return await axios.get(url);
    }
}

export default new CartService();