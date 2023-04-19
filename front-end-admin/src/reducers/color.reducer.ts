import { ActionType } from '../enum';
import ColorService from '../services/color.services';
import { CommonUtil } from 'src/utils/common-util';

const ACTION_TYPES = {
    COLOR_SEARCH: 'color/COLOR_SEARCH',
    COLOR_UPDATE_FORM_SEARCH: 'color/COLOR_FORM_SEARCH',
}

interface IColorReducerState {

}

const initialState = {
    data: new Map<string, IColorReducerState>(),
    listColor: [],
    formSearch: {},
    action: ActionType.None
};

export type ColorReducerState = Readonly<typeof initialState>;

const handleAction = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.COLOR_UPDATE_FORM_SEARCH:
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
export default (state: ColorReducerState = initialState, action): ColorReducerState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.COLOR_SEARCH,
        state,
        action,
        null,
        () => {
            if (action.payload?.data?.data) {
                CommonUtil.assignState(state, {
                    action: ActionType.Success,
                    listColor: action.payload.data.data
                });
            }
            return { ...state };
        }
    );
    if (result) return result;

    /** handle synchronized action */
    return handleAction(state, action);
};


export const handleSearchColor = (formData?: any, event?: any) => {
    return ({
        type: ACTION_TYPES.COLOR_SEARCH,
        payload: ColorService.search(formData, event)
    });
};

export const handleUpdateFormSearch = (data?: any) => {
    return ({
        type: ACTION_TYPES.COLOR_UPDATE_FORM_SEARCH,
        payload: data
    });
};