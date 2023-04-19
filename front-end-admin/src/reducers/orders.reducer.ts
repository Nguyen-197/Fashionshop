
import { ActionType } from '../enum';
import OrderService from '../services/order.services';
import { CommonUtil } from '../utils/common-util';

const ACTION_TYPES = {
    ORDER_SEARCH: 'order/ORDER_SEARCH',
    ORDER_UPDATE_FORM_SEARCH: 'order/ORDER_FORM_SEARCH',
}

interface IOrderReducerState {

}

const initialState = {
    data: new Map<string, IOrderReducerState>(),
    listOrder: [],
    formSearch: {},
    action: ActionType.None
};

export type OrderReducerState = Readonly<typeof initialState>;

const handleAction = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.ORDER_UPDATE_FORM_SEARCH:
            CommonUtil.assignState(state, {
                action: ActionType.Success,
                formSearch: action.payload
            });
            return { ...state };
        default:
            return state;
    }
}
// Reducer
export default (state: OrderReducerState = initialState, action): OrderReducerState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.ORDER_SEARCH,
        state,
        action,
        null,
        () => {
            CommonUtil.assignState(state, {
                action: ActionType.Success,
                listOrder: action.payload.data.data
            });
            return { ...state };
        }
    );
    if (result) return result;

    /** handle synchronized action */
    return handleAction(state, action);
};


export const handleSearchOrders = (formData?: any, event?: any) => {
    return ({
        type: ACTION_TYPES.ORDER_SEARCH,
        payload: OrderService.searchOrders(formData, event)
    });
};

export const handleUpdateFormSearch = (data?: any) => {
    return ({
        type: ACTION_TYPES.ORDER_UPDATE_FORM_SEARCH,
        payload: data
    });
};