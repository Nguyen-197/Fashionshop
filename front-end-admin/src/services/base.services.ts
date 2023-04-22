import { CommonUtil } from '../utils/common-util';
import axios from 'axios';
import { CONFIG } from '../config/app-config';
import _ from 'lodash';

export class BaseService {
    protected baseUrl: String;

    constructor(service: any = "YUNO", module: any) {
        const servicesURL = `REACT_APP_${service}_SERVICE_URL`
        this.baseUrl = `${process?.env[servicesURL]}${CONFIG.API_PATH[module]}`;
    }

    public search(formData, event?) {
        console.log("event", event);
        
        formData = _.cloneDeep(formData || {});
        if (event) {
            formData['_search'] = event;
        }
        const buildParams = CommonUtil.buildParams(formData || {});
        return axios.get(`${this.baseUrl}/search`, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        })
    }

    public saveOrUpdate(formData) {
        // formData = CommonUtil.convertFormFile(formData);
        return axios.post(`${this.baseUrl}`, formData);
    }

    public findById(id) {
        return axios.get(`${this.baseUrl}/${id}`, {
            headers: { ['Content-Type']: 'application/json' },
        })
    }

    public delete(id) {
        return axios.delete(`${this.baseUrl}/${id}`);
    }

    public findAll() {
        return axios.get(`${this.baseUrl}/find-all`);
    }

    public getDataDropdownByFilter(formData) {
        const buildParams = CommonUtil.buildParams(formData || {});
        return axios.get(`${this.baseUrl}`, {
            headers: { ['Content-Type']: 'application/json' },
            params: buildParams
        })
    }

    public filterByGroupCode(groupCode) {
        return axios.get(`${this.baseUrl}/filter-by-group-code?code=${groupCode}`);
    }

    public findByIds(ids) {
        return axios.get(`${this.baseUrl}/find-by-ids`, {
            headers: { ['Content-Type']: 'application/json' },
            params: {listUuid: ids.join(",")}
        })
    }
}