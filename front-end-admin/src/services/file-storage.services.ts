import { BaseService } from './base.services';
import axios from 'axios';
import { CommonUtil } from '../utils/common-util';

export class FileStorageService extends BaseService {
    constructor() {
        super('YUNO', 'fileStorage');
    }

    public uploadFile(formData: any) {
        formData = CommonUtil.convertFormFile(formData);
        return axios.post(`${this.baseUrl}/upload`, formData);
    }

    public download(uuid) {
        return axios.get(`${this.baseUrl}/download/${uuid}`, { responseType: 'blob' });
    }

    public removeFileByUUID(uuid) {
        return axios.delete(`${this.baseUrl}/remove-file/${uuid}`);
    }
}

export default new FileStorageService();