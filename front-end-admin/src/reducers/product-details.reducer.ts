
import { ActionType } from 'src/enum';
import ProductDetailsService from 'src/services/product-details.services';
import { CommonUtil } from 'src/utils/common-util';

const ACTION_TYPES = {
    PRODUCT_DETAILS_SEARCH: 'productDetails/PRODUCT_DETAILS_SEARCH',
    PRODUCT_DETAILS_UPDATE_FORM_SEARCH: 'productDetails/PRODUCT_DETAILS_UPDATE_FORM_SEARCH',
}

interface IProductDetailsReducerState {

}

const initialState = {
    data: new Map<string, IProductDetailsReducerState>(),
    listProductDetails: [],
    formSearch: {},
    action: ActionType.None
};

export type ProductDetailsReducerState = Readonly<typeof initialState>;

const handleAction = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.PRODUCT_DETAILS_SEARCH:
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
export default (state: ProductDetailsReducerState = initialState, action): ProductDetailsReducerState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.PRODUCT_DETAILS_SEARCH,
        state,
        action,
        null,
        () => {
            if (action.payload?.data?.data) {
                CommonUtil.assignState(state, {
                    action: ActionType.Success,
                    listProductDetails: action.payload.data.data || []
                });
            }
            return { ...state };
        }
    );
    if (result) return result;

    /** handle synchronized action */
    return handleAction(state, action);
};


export const handleSearchProductDetails = (formData?: any, event?: any) => {
    return ({
        type: ACTION_TYPES.PRODUCT_DETAILS_SEARCH,
        payload: ProductDetailsService.search(formData, event)
    });
};

export const handleUpdateFormSearch = (data?: any) => {
    return ({
        type: ACTION_TYPES.PRODUCT_DETAILS_UPDATE_FORM_SEARCH,
        payload: data
    });
};