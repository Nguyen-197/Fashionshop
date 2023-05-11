
import { Suspense } from 'react';
import { Switch } from 'react-router-dom';
import AppRoutes from 'src/layouts/app-routes';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import { useHistory } from 'react-router';
import { setAuthenticated, getUserInfo } from '../reducers/authentication';
import { store } from '../index';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import _ from 'lodash';
import { Storage } from 'react-jhipster';
import PageNotFound from 'src/components/error/PageNotFound';
import ExceptionPage from 'src/components/error/ExceptionPage';
const RoutersIndex = () => {
    const history = useHistory();
    const location = useLocation();
    const pathname = _.get(location, 'pathname') || '';

    // useEffect(() => {
    //     const token = Storage.local.get('token');
    //     if (!token && pathname != '/login') {
    //         history.push('/login');
    //         store.dispatch(setAuthenticated(false));
    //     } else {
    //         store.dispatch(setAuthenticated(!!token));
    //         if (token) {
    //             store.dispatch(getUserInfo());
    //         }
    //     }
    // }, [Storage.local.get('token')])
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
