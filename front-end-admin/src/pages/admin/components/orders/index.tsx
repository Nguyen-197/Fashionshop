
import { Switch } from 'react-router-dom';
import MenuPrivateRoute from 'src/components/auth/MenuPrivateRoute';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';

import UserIndex from './components/orders-index';
import OrderForm from './components/orders-form';
import OrderEditForm from './components/order-edit-form';
import orderView from './components/order-view';
const Routes = ({ match }) => (
    <>
        <Switch>
            <MenuPrivateRoute path={`${match.url}/create`} hasBreadCrumb={true} component={OrderForm} />
            <MenuPrivateRoute path={`${match.url}/edit/:orderId`} hasBreadCrumb={false} component={OrderEditForm} />
            <MenuPrivateRoute path={`${match.url}/view/:orderId`} hasBreadCrumb={false} component={orderView} />
            <MenuPrivateRoute path={`${match.url}`} hasBreadCrumb={true} component={UserIndex} />
            <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
    </>
);

export default Routes;
