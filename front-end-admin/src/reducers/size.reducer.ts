
import { ActionType } from '../enum';
import SizeService from '../services/size.services';
import { CommonUtil } from '../utils/common-util';

const ACTION_TYPES = {
    SIZE_SEARCH: 'size/SIZE_SEARCH',
    SIZE_UPDATE_FORM_SEARCH: 'size/SIZE_FORM_SEARCH',
}

interface ISizeReducerState {

}

const initialState = {
    data: new Map<string, ISizeReducerState>(),
    listSize: [],
    formSearch: {},
    action: ActionType.None
};

export type SizeReducerState = Readonly<typeof initialState>;

const handleAction = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.SIZE_UPDATE_FORM_SEARCH:
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
export default (state: SizeReducerState = initialState, action): SizeReducerState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.SIZE_SEARCH,
        state,
        action,
        null,
        () => {
            if (action.payload?.data?.data) {
                CommonUtil.assignState(state, {
                    action: ActionType.Success,
                    listSize: action.payload.data.data
                });
            }
            return { ...state };
        }
    );
    if (result) return result;

    /** handle synchronized action */
    return handleAction(state, action);
};


export const handleSearchSize = (formData?: any, event?: any) => {
    return ({
        type: ACTION_TYPES.SIZE_SEARCH,
        payload: SizeService.search(formData, event)
    });
};

export const handleUpdateFormSearch = (data?: any) => {
    return ({
        type: ACTION_TYPES.SIZE_UPDATE_FORM_SEARCH,
        payload: data
    });
};