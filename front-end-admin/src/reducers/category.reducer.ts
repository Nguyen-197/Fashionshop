import { ActionType } from '../enum';
import CateogryService from '../services/category.services';
import { CommonUtil } from 'src/utils/common-util';

const ACTION_TYPES = {
    CATEGORY_SEARCH: 'category/CATEGORY_SEARCH',
    CATEGORY_UPDATE_FORM_SEARCH: 'category/CATEGORY_UPDATE_FORM_SEARCH',
}

interface ICategoryReducerState {

}

const initialState = {
    data: new Map<string, ICategoryReducerState>(),
    listCategories: [],
    formSearch: {},
    action: ActionType.None
};

export type CategoryReducerState = Readonly<typeof initialState>;

const handleAction = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.CATEGORY_UPDATE_FORM_SEARCH:
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
export default (state: CategoryReducerState = initialState, action): CategoryReducerState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.CATEGORY_SEARCH,
        state,
        action,
        null,
        () => {
            CommonUtil.assignState(state, {
                action: ActionType.Success,
                listCategories: action.payload?.data?.data || []
            });
            return { ...state };
        }
    );
    if (result) return result;

    /** handle synchronized action */
    return handleAction(state, action);
};


export const handleSearchCategories = (formData?: any, event?: any) => {
    return ({
        type: ACTION_TYPES.CATEGORY_SEARCH,
        payload: CateogryService.search(formData, event)
    });
};

export const handleUpdateFormSearch = (data?: any) => {
    return ({
        type: ACTION_TYPES.CATEGORY_UPDATE_FORM_SEARCH,
        payload: data
    });
};