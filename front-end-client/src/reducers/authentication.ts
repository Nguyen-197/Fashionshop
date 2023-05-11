import { ActionType }from 'src/@types/enums';
import { Storage } from "react-jhipster";
import { ActionEntity } from '../models/ActionEntity';
import { CommonUtil } from 'src/utils/common-util';
import { RESPONSE_TYPE } from 'src/constants';
import AuthencationService from "../services/authencation.services";
import AccountService from 'src/services/account.services';
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
    SIGNIN: 'authentication/SIGNIN',
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
            console.log("accountInfo", action);
            
            CommonUtil.assignState(state, {
                action: ActionType.Success,
                accountInfo: action.payload?.data?.data || {}
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

export const handleSetMenu = (menuStorage) => {
    return ({
        type: ACTION_TYPES.SET_MENU,
        payload: menuStorage
    });
};

export const handleLogin = (formData?: any) => {
    return ({
        type: ACTION_TYPES.LOGIN,
        payload: AuthencationService.login(formData)
    });
};
export const handleUpdateDatasource = (key, value) => {
    return ({
        type: ACTION_TYPES.UPDATE_DATASOURCE,
        payload: { key, value }
    });
};