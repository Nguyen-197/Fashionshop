import { useEffect } from 'react';
import { Switch, match } from 'react-router-dom';
import { Storage } from 'react-jhipster';
import { useLocation } from 'react-router';
import MenuPrivateRoute from '../components/auth/MenuPrivateRoute';
import ErrorBoundaryRoute from '../components/error/ErrorBoundaryRoute';
import PageNotFound from '../components/error/PageNotFound';
import _ from 'lodash'
import { store } from '../index';
import { setAuthenticated, getUserInfo } from '../reducers/authentication';
import { useHistory } from 'react-router';
import { AUTHORITIES } from '../enum';
import AdminLogin from '../pages/admin/components/login';
import Logined from '../pages/admin/layouts/logined';

type IProps = {
    match?: match
}

const AdminRoutes = ({ match }: IProps) => {
    const history = useHistory();
    const location = useLocation();
    const pathname = _.get(location, 'pathname') || '';

    useEffect(() => {
        const token = Storage.local.get('token');
        if (!token && pathname != '/admin/login') {
            history.push('/admin/login');
            store.dispatch(setAuthenticated(false));
        } else {
            store.dispatch(setAuthenticated(!!token));
            if (token) {
                store.dispatch(getUserInfo());
            }
        }
    }, [Storage.local.get('token')])
    return (
        <>
            <Switch>
                <ErrorBoundaryRoute path={`${match.url}/login`} component={AdminLogin} />
                <MenuPrivateRoute path={`${match.url}`} component={Logined} hasAnyAuthorities={[AUTHORITIES.STAFF, AUTHORITIES.ADMIN]} />
                <ErrorBoundaryRoute component={PageNotFound} />
            </Switch>
        </>
    )
};

export default AdminRoutes;