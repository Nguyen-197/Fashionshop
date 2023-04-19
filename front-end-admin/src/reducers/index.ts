import { combineReducers } from 'redux';
import menuLeft, { MenuLeftState } from '../layouts/menu/sidebar-menu-left.reducer';
import toastMsgState, { ToastMsgState } from '../components/toast/toast-msg.reducer';
import authentication, { AuthenticationState } from './authentication';
import locale, { LocaleState } from './locale';
import categoryReducerState, { CategoryReducerState } from './category.reducer';
import productReducerState, { ProductReducerState } from './product.reducer';
import productDetailsReducerState, { ProductDetailsReducerState } from './product-details.reducer';
import colorReducerState, { ColorReducerState } from './color.reducer';
import sizeReducerState, { SizeReducerState } from './size.reducer';
import userReducerState, { UserReducerState } from "./user.reducer";
import customerReducerState, { CustomerReducerState } from "./customer.reducer";
import orderReducerState, { OrderReducerState } from "./orders.reducer";
import orderReturnReducerState, { OrderReturnReducerState } from "./orders-return.reducer";
export interface IRootState {
    readonly locale: LocaleState;
    readonly menuLeft: MenuLeftState;
    readonly authentication: AuthenticationState;
    readonly toastMsgState: ToastMsgState;
    readonly categoryReducerState: CategoryReducerState;
    readonly productReducerState: ProductReducerState;
    readonly productDetailsReducerState: ProductDetailsReducerState;
    readonly colorReducerState: ColorReducerState;
    readonly sizeReducerState: SizeReducerState;
    readonly userReducerState: UserReducerState;
    readonly customerReducerState: CustomerReducerState;
    readonly orderReducerState: OrderReducerState;
    readonly orderReturnReducerState: OrderReturnReducerState;
}

const rootReducer = combineReducers<IRootState>({
    locale,
    menuLeft,
    authentication,
    toastMsgState,
    categoryReducerState,
    productReducerState,
    productDetailsReducerState,
    colorReducerState,
    sizeReducerState,
    userReducerState,
    customerReducerState,
    orderReducerState,
    orderReturnReducerState
});

export default rootReducer;
