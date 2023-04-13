import { Switch } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';
const Routes = ({ match }) => {
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${match.url}/:productId`} component={ProductDetail} />
                <ErrorBoundaryRoute component={PageNotFound} />
            </Switch>
        </>
    );
};

export default Routes;
