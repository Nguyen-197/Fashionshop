import { Switch } from 'react-router-dom';
import Category from './Category';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';
const Routes = ({ match }) => (
    <>
        <Switch>
            <ErrorBoundaryRoute path={`${match.url}/:categoryCode`} component={Category} />
            <ErrorBoundaryRoute component={PageNotFound} />
        </Switch>
    </>
);

export default Routes;