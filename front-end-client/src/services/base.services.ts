import { CommonUtil } from '../utils/common-util';
import axios from 'axios';
import { CONFIG } from '../config/app-config';
import _ from 'lodash';
import { log } from 'console';

export class BaseService {
    protected baseUrl: String;

    constructor(service: any = "YUNO", module: any) {
        const servicesURL = `REACT_APP_${service}_SERVICE_URL`
        this.baseUrl = `${process?.env[servicesURL]}${CONFIG.API_PATH[module]}`;
        console.log("baseUrl", this.baseUrl);
        
    }
    /**
     * convertDataObject
     * param data
     */
     convertDataObject(data) {
        if (data) {
            for (const key in data) {
                if (data[key] instanceof File) {
                    // empty
                } else {
                    data[key] = this.convertData(data[key]);
                }
            }
        }
        return data;
    }
    convertBoolean(value) {
        return value ? 1 : 0;
    }
    convertDataArray(data) {
        if (data && data.length > 0) {
            for (const i in data) {
                data[i] = this.convertData(data[i]);
            }
        }
        return data;
    }
    /**
    * convertData
    */
     convertData(data) {
        if (typeof data === typeof {}) {
            return this.convertDataObject(data);
        } else if (typeof data === typeof []) {
            return this.convertDataArray(data);
        } else if (typeof data === typeof true) {
            return this.convertBoolean(data);
        }
        return data;
    }

    buildArray(obj, rootName, ignoreList) {
        const formData = new URLSearchParams();
        function appendFormData(data, root) {
            if (!ignore(root)) {
                root = root || '';
                if (Array.isArray(data)) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i] && typeof data[i] === 'object') {
                            appendFormData(data[i], root + '[' + i + ']');
                        } else {
                            appendFormData(data[i], root);
                        }
                    }
                } else if (data && data instanceof Date) {
                    formData.append(root, data.toISOString());
                } else if (data && typeof data === 'object' && data.type !== 'stored_file') {
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            if (root === '') {
                                appendFormData(data[key], `${key}`);
                            } else {
                                appendFormData(data[key], `${root}.${key}`);
                            }
                        }
                    }
                } else {
                    if (data !== null && typeof data !== 'undefined' && data.type !== 'stored_file') {
                        formData.append(root, data);
                        // formData[root] = data;
                    }
                }
            }
        }
        function ignore(root) {
            return Array.isArray(ignoreList) && ignoreList.some(x => x === root);
        }
        appendFormData(obj, rootName)
        return formData;
    }
    convertFormFile(dataPost) {
        const filteredData = this.convertData(dataPost);
        const formData = this.buildArray(filteredData, null, null);
        return formData;
    }
    public async search(formData, event?) {
        console.log("event",event);
        
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        formData = this.convertFormFile(formData || {});
        return await axios.get(`${this.baseUrl}/search`, {
            headers: { ['Content-Type']: 'application/json' },
            params: formData
        })
    }

    public async saveOrUpdate(formData) {
        // formData = CommonUtil.convertFormFile(formData);
        return await axios.post(`${this.baseUrl}`, formData);
    }

    public async findById(id) {
        return await axios.get(`${this.baseUrl}/${id}`, {
            headers: { ['Content-Type']: 'application/json' },
        })
    }

    public async delete(id) {
        return await axios.delete(`${this.baseUrl}/${id}`);
    }

    public async findAll() {
        return await axios.get(`${this.baseUrl}/find-all`);
    }

    public async getDataDropdownByFilter(formData) {
        const buildParams = CommonUtil.buildParams(formData || {});
        return await axios.get(`${this.baseUrl}`, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        })
    }

    public async findByIds(ids) {
        return await axios.get(`${this.baseUrl}/find-by-ids`, {
            headers: { ['Content-Type']: 'application/json' },
            params: { listIdCarts: ids.join(',') }
        })
    }

    public filterByGroupCode(groupCode) {
        return axios.get(`${this.baseUrl}/filter-by-group-code?code=${groupCode}`);
    }
}