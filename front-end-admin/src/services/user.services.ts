import { BaseService } from "./base.services";
import axios from 'axios';
import { CommonUtil } from 'src/utils/common-util';
import { GHN_TOKEN, SHOP_ID } from 'src/@types/constants';
export class UserService extends BaseService {
    constructor() {
        super('YUNO', 'account');
    }
    public getprovince() {
        return axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`, {
            headers: {
                ['Content-Type']: 'application/json',
                Authorization: GHN_TOKEN
            },
        });
    }
    public getdistrict(data) {
        const buildParams = CommonUtil.buildParams(data || {});
        return axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`, {
            headers: {
                ['Content-Type']: 'application/json',
                Authorization: GHN_TOKEN
            },
            params: buildParams
        });
    }
    public getward(data) {
        const buildParams = CommonUtil.buildParams(data || {});
        return axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`, {
            headers: {
                ['Content-Type']: 'application/json',
                Authorization: GHN_TOKEN
            },
            params: buildParams
        });
    }
    public filterUser(data) {
        const buildParams = CommonUtil.buildParams(data || {});
        return axios.get(`${this.baseUrl}/get-all-customer`, { params: buildParams });
    }
}

export default new UserService();