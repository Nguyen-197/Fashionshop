
import { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import AppRoutes from 'src/layouts/app-routes';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';
import ExceptionPage from 'src/components/error/ExceptionPage';
const RoutersIndex = () => {
    return <>
        <Suspense fallback={<div>Loading</div>}>
            <>
                <Switch>
                    <ErrorBoundaryRoute path="/" component={AppRoutes} />
                </Switch>
            </>
        </Suspense>
    </>;
};

export default RoutersIndex;
