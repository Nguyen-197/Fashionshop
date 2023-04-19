
import orderReturnServices from 'src/services/order-return.services';
import { ActionType } from '../enum';
import { CommonUtil } from '../utils/common-util';

const ACTION_TYPES = {
    ORDER_RETURN_SEARCH: 'order-return/ORDER_RETURN_SEARCH',
    ORDER_RETURN_UPDATE_FORM_SEARCH: 'order-return/ORDER_RETURN_UPDATE_FORM_SEARCH',
}

interface IOrderReturnReducerState {

}

const initialState = {
    data: new Map<string, IOrderReturnReducerState>(),
    listOrderReturn: [],
    formSearch: {},
    action: ActionType.None
};

export type OrderReturnReducerState = Readonly<typeof initialState>;

const handleAction = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.ORDER_RETURN_UPDATE_FORM_SEARCH:
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
export default (state: OrderReturnReducerState = initialState, action): OrderReturnReducerState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.ORDER_RETURN_SEARCH,
        state,
        action,
        null,
        () => {
            if (action?.payload?.data?.data) {
                CommonUtil.assignState(state, {
                    action: ActionType.Success,
                    listOrderReturn: action.payload.data.data
                });
            }
            return { ...state };
        }
    );
    if (result) return result;

    /** handle synchronized action */
    return handleAction(state, action);
};


export const handleSearchOrderReturn = (formData?: any, event?: any) => {
    return ({
        type: ACTION_TYPES.ORDER_RETURN_SEARCH,
        payload: orderReturnServices.search(formData, event)
    });
};

export const handleUpdateFormSearch = (data?: any) => {
    return ({
        type: ACTION_TYPES.ORDER_RETURN_UPDATE_FORM_SEARCH,
        payload: data
    });
};