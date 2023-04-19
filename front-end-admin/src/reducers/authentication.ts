import { ActionType }from 'src/enum';
import { Storage } from "react-jhipster";
import { ActionEntity } from '../models/ActionEntity';
import { CommonUtil } from 'src/utils/common-util';
import { MENU } from '../constants/constants';
import { RESPONSE_CODE, RESPONSE_TYPE } from "../constants/constants";
import AuthencationService from "../services/authencation.services";
import SysMenuService from '../services/system-menu.services';
import AccountService from '../services/account.services';
/**
 * initial state
 */
const initialState = {
    datasource: new Map<string, any>(),
    redirectMessage: '' as string,
    isLoading: false as boolean,
    isLoginSuccess: false as boolean,
    isLoginError: false as boolean,
    isAuthenticated: false as boolean,
    isAdmin: false as boolean,
    isStaff: false as boolean,
    account: {} as any,
    accountInfo: {} as any,
    isSessionHasBeenFetched: false,
    menu: [],
    listMenuItem: []
};

export const ACTION_TYPES = {
    CLEAR_AUTH: 'authentication/CLEAR_AUTH',
    ERROR_MESSAGE: 'authentication/ERROR_MESSAGE',
    LOGIN: 'authentication/LOGIN',
    SET_LOADING: 'authentication/SET_LOADING',
    SET_AUTHENTICATED: 'authentication/SET_AUTHENTICATED',
    GET_USER_INFO: 'authentication/GET_USER_INFO',
    GET_MENU: 'authentication/GET_MENU',
    SET_MENU: 'authentication/SET_MENU',
    UPDATE_DATASOURCE: 'authentication/UPDATE_DATASOURCE',
};

export type AuthenticationState = Readonly<typeof initialState>;

export default (state: AuthenticationState = initialState, action: ActionEntity): AuthenticationState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.LOGIN,
        state,
        action,
        null,
        () => {
            const { type, data } = action.payload?.data || { type: '' };
            const loginSuccess = type == RESPONSE_TYPE.SUCCESS;
            if (loginSuccess) {
                Storage.local.set('userInfo', data);
                Storage.local.set('token', data.token);
                CommonUtil.assignState(state, {
                    action: ActionType.Success,
                    isAuthenticated: true,
                    isLoginSuccess: loginSuccess,
                    isLoginError: !loginSuccess,
                    account: data
                });
            }
            return { ...state };
        }
    );
    if (result) return result;

    result = CommonUtil.excuteFunction(
        ACTION_TYPES.GET_USER_INFO,
        state,
        action,
        null,
        () => {
            const accountInfo = action.payload?.data?.data || {};
            let isAdmin = false;
            let isStaff = false;
            if (accountInfo) {
                isAdmin = accountInfo?.role?.name.toString().toLowerCase() == "admin";
                isStaff = accountInfo?.role?.name.toString().toLowerCase() == "staff";
            }
            CommonUtil.assignState(state, {
                action: ActionType.Success,
                accountInfo: accountInfo,
                isAdmin: isAdmin,
                isStaff: isAdmin || isStaff,
            });
            return { ...state };
        }
    );
    if (result) return result;

    result = CommonUtil.excuteFunction(
        ACTION_TYPES.GET_MENU,
        state,
        action,
        null,
        () => {
            CommonUtil.setSessionStorage(MENU, action.payload?.data);
            CommonUtil.assignState(state, {
                action: ActionType.Success,
                menu: CommonUtil.computeMenu(action.payload?.data),
                listMenuItem: action.payload?.data
            });
            return { ...state };
        }
    );
    if (result) return result;
    switch (action.type) {
        case ACTION_TYPES.ERROR_MESSAGE:
            return {
                ...initialState,
                redirectMessage: action.message
            };
        case ACTION_TYPES.CLEAR_AUTH:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: false
            };
        case ACTION_TYPES.SET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.payload
            };
        case ACTION_TYPES.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case ACTION_TYPES.SET_MENU:
            return {
                ...state,
                menu: CommonUtil.computeMenu(action.payload),
                listMenuItem: action.payload
            };
        case ACTION_TYPES.UPDATE_DATASOURCE:
            const datasource = state.datasource || new Map<string, any>();
            const { key, value } = action.payload
            datasource.set(key, value);
            return {
                ...state,
                datasource: datasource
            };
        default:
            return {
                ...state,
            };
    }
};

export const displayAuthError = (message: string) => ({ type: ACTION_TYPES.ERROR_MESSAGE, message });

export const clearAuthentication = (messageKey: string) => (dispatch: any, getState: any) => {
    dispatch(displayAuthError(messageKey));
    dispatch({
        type: ACTION_TYPES.CLEAR_AUTH
    });
};

export const setAuthenticated = (isAuthenticated) => ({
    type: ACTION_TYPES.SET_AUTHENTICATED,
    payload: isAuthenticated
});

export const getUserInfo = () => {
    return ({
        type: ACTION_TYPES.GET_USER_INFO,
        payload: AccountService.getUserInfo()
    });
};

export const setLoading = (isLoading: boolean) => ({
    type: ACTION_TYPES.SET_LOADING,
    payload: isLoading
});

export const getMenu = () => {
    return ({
        type: ACTION_TYPES.GET_MENU,
        payload: SysMenuService.getMenu()
    });
};

export const handleSetMenu = (menuStorage) => {
    return ({
        type: ACTION_TYPES.SET_MENU,
        payload: menuStorage
    });
};

export const handleLogin = (formData?: any, formik?: any) => {
    return ({
        type: ACTION_TYPES.LOGIN,
        payload: AuthencationService.login(formData).catch(err => {
            const { code } = err.response.data;
            if (code == RESPONSE_CODE.INVALID_VERIFY_ACCOUNT) {
                const errors = {}
                for (const field in formData) {
                    if (formData[field]) {
                        errors[field] = "Tài khoản hoặc mật khẩu không chính xác"
                    }
                }
                console.log(">>> errors: ", errors);
                formik.setErrors(errors);
            }
        })
    });
};

export const handleUpdateDatasource = (key, value) => {
    return ({
        type: ACTION_TYPES.UPDATE_DATASOURCE,
        payload: { key, value }
    });
};