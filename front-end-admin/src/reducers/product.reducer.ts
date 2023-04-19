
import { ActionType } from '../enum';
import ProductService from '../services/product.services';
import { CommonUtil } from 'src/utils/common-util';

const ACTION_TYPES = {
    PRODUCT_SEARCH: 'product/PRODUCT_SEARCH',
    PRODUCT_UPDATE_FORM_SEARCH: 'product/PRODUCT_UPDATE_FORM_SEARCH',
}

interface IProductReducerState {

}

const initialState = {
    data: new Map<string, IProductReducerState>(),
    listProduct: [],
    formSearch: {},
    action: ActionType.None
};

export type ProductReducerState = Readonly<typeof initialState>;

const handleAction = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.PRODUCT_UPDATE_FORM_SEARCH:
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
export default (state: ProductReducerState = initialState, action): ProductReducerState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.PRODUCT_SEARCH,
        state,
        action,
        null,
        () => {
            if (action.payload?.data?.data) {
                CommonUtil.assignState(state, {
                    action: ActionType.Success,
                    listProduct: action.payload?.data?.data || []
                });
            }
            return { ...state };
        }
    );
    if (result) return result;

    /** handle synchronized action */
    return handleAction(state, action);
};


export const handleSearchProduct = (formData?: any, event?: any) => {
    return ({
        type: ACTION_TYPES.PRODUCT_SEARCH,
        payload: ProductService.search(formData, event)
    });
};

export const handleUpdateFormSearch = (data?: any) => {
    return ({
        type: ACTION_TYPES.PRODUCT_UPDATE_FORM_SEARCH,
        payload: data
    });
};