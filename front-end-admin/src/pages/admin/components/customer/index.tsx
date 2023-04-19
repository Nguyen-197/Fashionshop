
import { Switch } from 'react-router-dom';
import MenuPrivateRoute from 'src/components/auth/MenuPrivateRoute';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';

import UserIndex from './components/user-index';
const Routes = ({ match }) => (
    <>
        <Switch>
            <MenuPrivateRoute path={`${match.url}`} hasBreadCrumb={true} component={UserIndex} />
            <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
    </>
);

export default Routes;
