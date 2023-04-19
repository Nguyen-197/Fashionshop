import { combineReducers } from 'redux';
import toastMsgState, { ToastMsgState } from '../components/toast/toast-msg.reducer';
import authentication, { AuthenticationState } from './authentication';
import locale, { LocaleState } from './locale';

export interface IRootState {
    readonly locale: LocaleState;
    readonly authentication: AuthenticationState;
    readonly toastMsgState: ToastMsgState;
}

const rootReducer = combineReducers<IRootState>({
    locale,
    authentication,
    toastMsgState,
});

export default rootReducer;
