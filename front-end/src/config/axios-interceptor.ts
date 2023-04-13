import { RESPONSE_TYPE } from 'src/@types/enums';
import axios from 'axios';
import { Toast } from 'src/components/toast/toast.utils';
import LocalStorage from '../utils/LocalStorage';
import { store } from '../index';
import { setLoading } from '../reducers/authentication';
import { Storage } from 'react-jhipster';
import { RESPONSE_CODE } from 'src/@types/enums';
import { serverError } from "src/reducers/application-profile";
import { SERVER_API_URL, AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY } from 'src/constants';
import { GHN_TOKEN, SHOP_ID } from 'src/@types/constants';
const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;
declare module 'axios' {
  export interface AxiosRequestConfig {
    isLoading?: boolean;
  }
}

const setupAxiosInterceptors = (onUnauthenticated: any) => {
    const onRequestSuccess = (config: any) => {
        if (typeof config.isLoading == 'boolean') {
            store.dispatch(setLoading(config.isLoading));
        } else {
            store.dispatch(setLoading(true));
        }
        const token = LocalStorage.get('token') || Storage.local.get('token');

        if (config.headers.Authorization) {
            config.headers.token = config.headers.Authorization;
            config.headers.Authorization = config.headers.Authorization;
            config.headers.ShopId = SHOP_ID;
            return config;
        }
        if (token && !config.headers.noAuth) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    };
    const onResponseSuccess = (response: any) => {
        const { code, type, message } = response.data || {};
        if (type && (code || message)) {
            Toast.show(type, code, message);
        }
        const timerId = setTimeout(() => {
            store.dispatch(setLoading(false));
            clearTimeout(timerId);
        }, 300);
        return response;
    };
    const onResponseError = (err: any) => {
        // xu ly neu co loi o day
        store.dispatch(setLoading(false));
        const { code, type, code_message_value, message } = err?.response?.data || {};
        console.log(">>> code: ", code);
        console.log(">>> message: ", message);
        if (code == RESPONSE_CODE.TOKEN_EXPIRED || code == RESPONSE_CODE.INVALID_VERIFY_ACCOUNT) {
            console.log(">>> message here: ", message);
            LocalStorage.clear();
            Storage.local.remove('token');
            Storage.local.remove('total');
            Storage.local.remove('userInfo');
            Storage.local.remove('cart-items');
            Storage.local.remove('CHECKOUT_REPORTER_LOGS');
            // window.location.href = '/login';
            return;
        }
        if (type == RESPONSE_TYPE.ERROR) {
            Toast.show(RESPONSE_TYPE.ERROR, code, message);
            return;
        }
        if (code == 400) {
            if (code_message_value) {
                Toast.show(RESPONSE_TYPE.WARNING, code, code_message_value);
            }
        }
        // store.dispatch(setLoading(false));
        return Promise.reject(err);
    };
    axios.interceptors.request.use(onRequestSuccess);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
