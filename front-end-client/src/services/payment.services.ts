import axios from 'axios';
import { BaseService } from './base.services';

export class PaymentService extends BaseService {
    constructor() {
        super('YUNO', 'paymentService');
    }

    public async processPayment(formData: any) {
        const url = `${this.baseUrl}/create-payment`;
        return await axios.post(url, formData);
    }
}

export default new PaymentService();