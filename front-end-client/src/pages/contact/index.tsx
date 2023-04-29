import { Switch } from 'react-router-dom';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';
import Women from './Contact';
const Routes = ({ match }) => {
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${match.url}/:productId`} component={Women} />
                <ErrorBoundaryRoute component={PageNotFound} />
            </Switch>
        </>
    );
};

export default Routes;
