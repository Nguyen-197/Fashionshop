
import { Switch } from 'react-router-dom';
import MenuPrivateRoute from 'src/components/auth/MenuPrivateRoute';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';

import OrderReturnIndex from './components/order-return-index';
import OrderReturnForm from './components/order-return-form';
import orderReturnEdit from './components/order-return-edit';
const Routes = ({ match }) => (
    <>
        <Switch>
            <MenuPrivateRoute path={`${match.url}/create`} component={OrderReturnForm} />
            <MenuPrivateRoute path={`${match.url}/edit/:orderReturnId`} component={orderReturnEdit} />
            <MenuPrivateRoute path={`${match.url}`} hasBreadCrumb={true} component={OrderReturnIndex} />
            <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
    </>
);

export default Routes;
