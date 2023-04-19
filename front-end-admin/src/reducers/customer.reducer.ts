
import { ActionType } from '../enum';
import UserService from '../services/user.services';
import { CommonUtil } from 'src/utils/common-util';

const ACTION_TYPES = {
    USER_SEARCH: 'user/USER_SEARCH',
    USER_UPDATE_FORM_SEARCH: 'user/USER_UPDATE_FORM_SEARCH',
}
interface IUserReducerState {

}

const initialState = {
    data: new Map<string, IUserReducerState>(),
    listUser: [],
    formSearch: {},
    action: ActionType.None
};

export type CustomerReducerState = Readonly<typeof initialState>;

const handleAction = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.USER_UPDATE_FORM_SEARCH:
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
export default (state: CustomerReducerState = initialState, action): CustomerReducerState => {
    let result;
    result = CommonUtil.excuteFunction(
        ACTION_TYPES.USER_SEARCH,
        state,
        action,
        null,
        () => {
            let data = []
            if (action.payload?.data?.data) {
                data = action.payload.data.data;
            }
            CommonUtil.assignState(state, {
                action: ActionType.Success,
                listUser: data
            });
            return { ...state };
        }
    );
    if (result) return result;

    /** handle synchronized action */
    return handleAction(state, action);
};


export const handleSearchUser = (formData?: any, event?: any) => {
    const dataRole = { roles: 3 }
    const formSearch = Object.assign({}, formData, dataRole)
    console.log("formSearch", formSearch);

    return ({
        type: ACTION_TYPES.USER_SEARCH,
        payload: UserService.search(formSearch, event)
    });
};

export const handleUpdateFormSearch = (data?: any) => {
    return ({
        type: ACTION_TYPES.USER_UPDATE_FORM_SEARCH,
        payload: data
    });
};