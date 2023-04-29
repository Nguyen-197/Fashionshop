import { Switch } from 'react-router-dom';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';
import News from './News';
const Routes = ({ match }) => {
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${match.url}`} component={News} />
                <ErrorBoundaryRoute component={PageNotFound} />
            </Switch>
        </>
    );
};

export default Routes;
