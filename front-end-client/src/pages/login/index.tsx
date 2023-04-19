import { Switch } from 'react-router-dom';
import Login from './Login';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';
const Routes = ({ match }) => (
    <>
        <Switch>
            <ErrorBoundaryRoute path={`${match.url}`} component={Login} />
            <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
    </>
);

export default Routes;
