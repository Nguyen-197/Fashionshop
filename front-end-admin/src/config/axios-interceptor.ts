import axios from 'axios';
import { Toast } from 'src/components/toast/toast.utils';
import LocalStorage from '../utils/LocalStorage';
import { store } from '../index';
import { setLoading } from '../reducers/authentication';
import { Storage } from 'react-jhipster';
import { RESPONSE_CODE } from '../enum';
import { serverError } from "../reducers/application-profile";
import { GHN_TOKEN, SHOP_ID } from 'src/@types/constants';
import { SERVER_API_URL, AUTH_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY } from '../constants/constants';
const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = SERVER_API_URL;

const setupAxiosInterceptors = (onUnauthenticated: any) => {
    const onRequestSuccess = (config: any) => {
        store.dispatch(setLoading(true));
        if (config.headers.Authorization) {
            config.headers.token = config.headers.Authorization
            config.headers.ShopId = SHOP_ID;
        } else {
            const token = LocalStorage.get('token') || Storage.local.get('token');
            if (token && !config.headers.noAuth) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    };
    const onResponseSuccess = (response: any) => {
        const { code, type, message } = response.data || {};
        if (type && (code || message)) {
            Toast.show(type, code, message);
        }
        store.dispatch(setLoading(false));
        return response;
    };
    const onResponseError = (err: any) => {
        // xu ly neu co loi o day
        const status = err.status || (err.response ? err.response.status : 0);
        store.dispatch(setLoading(false));
        if (status !== 403 && status !== 401 && !err.config.url.endsWith('/count-unread-notification') && err.config.url.indexOf("://") < 0) {
            if (status === 0) {
                store.dispatch(serverError('WAR_COM_0012'));
                return;
            }
        }

        if (status === 403 || status === 401) {
            if (status === 401 && err.config.url.endsWith('/count-unread-notification')) {
                Storage.local.remove(AUTH_TOKEN_KEY);
                Storage.local.remove(AUTH_REFRESH_TOKEN_KEY);
                Storage.session.remove(AUTH_TOKEN_KEY);
                Storage.session.remove(AUTH_REFRESH_TOKEN_KEY);
            }
            onUnauthenticated();
        } else if (status === 500) {
            const { code, type } = err.response?.data || {};
            if (code && type) {
                Toast.show(type, code);
                if (code == 'invalidToken') {
                    setTimeout(() => {
                        window.location.href = '/admin/login';
                    }, 1500);
                    return;
                } else if (code == RESPONSE_CODE.TOKEN_INVALID) {
                    setTimeout(() => {
                        window.location.href = '/admin/login';
                    }, 1500);
                    return;
                } else if (code == RESPONSE_CODE.TOKEN_EXPIRED) {
                    setTimeout(() => {
                        window.location.href = '/admin/login';
                    }, 1000);
                    return;
                }
            }
        }
        return Promise.reject(err);
    };
    axios.interceptors.request.use(onRequestSuccess);
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;
