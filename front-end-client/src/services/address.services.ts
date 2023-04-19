import axios from 'axios';
import { BaseService } from './base.services';

export class AddressService extends BaseService {
    constructor() {
        super('YUNO', 'addressService');
    }

    public async getAddressUser() {
        const url = `${this.baseUrl}/get-list`;
        return await axios.get(url);
    }
}

export default new AddressService();