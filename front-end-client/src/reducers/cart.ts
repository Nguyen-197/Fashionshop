import { ProductDetailModel } from './../models/ProductDetailModel';
import { ActionType }from 'src/@types/enums';
import { Storage } from "react-jhipster";
import LocalStorage from '../utils/LocalStorage';
import { ActionEntity } from '../models/ActionEntity';
import { CommonUtil } from 'src/utils/common-util';
import { RESPONSE_TYPE } from 'src/constants';
import cartService from 'src/services/cart.services';
/**
 * initial state
 */
const initialState = {
    listCarts: []
};

export const ACTION_TYPES = {
    GET_CART: "cart/GET_CART",
    ADD_CART: "cart/ADD_CART",
    UPDATE_CART: "cart/UPDATE_CART",
    REMOVE_CART: "cart/REMOVE_CART",
};

export type AuthenticationState = Readonly<typeof initialState>;

export default (state: AuthenticationState = initialState, action: ActionEntity): AuthenticationState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.GET_CART,
        state,
        action,
        null,
        () => {
            const { type, data } = action.payload?.data;
            if (type == RESPONSE_TYPE.SUCCESS) {
                Storage.local.set('user_cart', JSON.stringify(data));
                LocalStorage.set('user_cart', JSON.stringify(data));
                CommonUtil.assignState(state, {
                    action: ActionType.Success,
                    listCarts: data || []
                });
            }
            return { ...state };
        }
    );
    if (result) return result;

    switch (action.type) {
        default:
            return {
                ...state,
            };
    }
};

export const getCarts = async () => {
    return ({
        type: ACTION_TYPES.GET_CART,
        payload: await cartService.getUserCarts()
    });
}

export const addToCart = async (item: ProductDetailModel, quantity: number) => {
    return ({
        type: ACTION_TYPES.ADD_CART,
        payload: await cartService.addCartItem(item)
    });
}