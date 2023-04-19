
import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import AdminRoutes from '../routes/admin-routes';
import PageNotFound from '../components/error/PageNotFound';
const AppRoutes = () => {
    return <>
        <Suspense fallback={<div>Loading</div>}>
            <>
                <Switch>
                    <ErrorBoundaryRoute path="/admin" component={AdminRoutes} />
                    <ErrorBoundaryRoute component={PageNotFound} />
                </Switch>
            </>
        </Suspense>
    </>;
};

export default AppRoutes;
