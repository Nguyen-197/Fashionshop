import axios from 'axios';
import { BaseService } from './base.services';

export class FavoriesService extends BaseService {
    constructor() {
        super('YUNO', 'favoriesService');
    }

    public async addFavoriesItem(formData: any) {
        const url = `${this.baseUrl}`;
        return await axios.post(url, formData);
    }

    public async getUserFavorites() {
        const url = `${this.baseUrl}/get-favories`;
        return await axios.get(url);
    }
}

export default new FavoriesService();