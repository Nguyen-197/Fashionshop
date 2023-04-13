import { connect } from 'react-redux';
import { Switch, match } from 'react-router-dom';
import { IRootState } from 'src/reducers';
import PageIndex from 'src/pages';
import Home from 'src/pages/home';
import AccountInfo from 'src/pages/account-info';
import Cart from 'src/pages/cart';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';
import ExceptionPage from 'src/components/error/ExceptionPage';
import { Suspense } from 'react';
import Login from 'src/pages/login/Login';
import ProductDetail from 'src/pages/product-detail';
import Checkout from 'src/pages/Checkout/Checkout';
import MenuPrivateRoute from 'src/components/auth/MenuPrivateRoute';
import Purchase from 'src/pages/purchase/Purchase';
import Women from 'src/pages/women/Women';
import Men from 'src/pages/men/Men';
export interface IAppRoutersProps extends StateProps, DispatchProps {
    match?: match
}
const AppRouters = ({ match }: IAppRoutersProps) => {
    const renderComponent = () => {
        return (
            <>
                <Switch>
                    <Suspense fallback={<div>Loading...</div>}>
                        <ErrorBoundaryRoute exact path="/" component={PageIndex} />
                        <ErrorBoundaryRoute exact path="/home" component={Home} />
                        <ErrorBoundaryRoute exact path="/cart" component={Cart} />
                        <ErrorBoundaryRoute exact path="/purchase" component={Purchase} />
                        <MenuPrivateRoute path="/checkout" component={Checkout} />
                        <MenuPrivateRoute path="/account-info" component={AccountInfo} />
                        <ErrorBoundaryRoute path="/products" component={ProductDetail} />
                        <ErrorBoundaryRoute path="/women" component={Women} />
                        <ErrorBoundaryRoute path="/men" component={Men} />
                        <ErrorBoundaryRoute exact path="/login" component={Login} />
                    </Suspense>
                    <ErrorBoundaryRoute component={PageNotFound} />
                    <ErrorBoundaryRoute component={ExceptionPage} />
                </Switch>
            </>
        )
    };

    return (
        <>
            {renderComponent()}
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isAuthenticated: authentication.isAuthenticated,
    menu: authentication.menu
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export const AppWrapper = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRouters);

export default AppWrapper;

