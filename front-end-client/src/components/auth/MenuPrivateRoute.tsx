import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import { Storage, Translate } from 'react-jhipster';
import ErrorBoundary from '../error/ErrorBoundary';
import { IRootState } from '../../reducers';
import { RouteProps, useLocation } from 'react-router';
import { BreadCrumb } from 'primereact/breadcrumb';
import _ from 'lodash';
import { setAuthenticated } from '../../reducers/authentication';
import { AUTHORITIES, RESPONSE_TYPE } from 'src/@types/enums';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
interface IOwnProps extends RouteProps {
    hasAnyAuthorities?: string[];
    hasBreadCrumb?: boolean
}

export interface IMenuPrivateRouteProps extends IOwnProps, StateProps, DispatchProps {
    componentDisplayName?: any;
    component?: any;
    path?: any;
}

export const MenuPrivateRouteComponent = ({
    componentDisplayName,
    component: Component,
    isAuthenticated,
    isSessionHasBeenFetched,
    isAuthorized,
    hasAnyAuthorities = [],
    menu,
    listMenuItem,
    hasBreadCrumb,
    setAuthenticated,
    ...rest
}: IMenuPrivateRouteProps) => {

    if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`);
    const toast = useRef(null);
    const location = useLocation();
    const pathname = _.get(location, 'pathname') || '';
    const home = { icon: 'pi pi-home', url: '/admin', to: '/admin' }
    const [itemBreadCum, setItemBreadCum] = useState([]);

    useEffect(() => {
        const items = [];
        let currentItem = listMenuItem.find(e => e.to == pathname);
        if (!currentItem) {
            setItemBreadCum([]);
            return;
        }
        items.push({ label: currentItem.label, to: currentItem.to });
        while (currentItem.parentId) {
            currentItem = listMenuItem.find(e => e.sysMenuId == currentItem.parentId);
            if (!currentItem) {
                return;
            }
            items.push({ label: currentItem.label, to: currentItem.to });
        }
        setItemBreadCum(items.reverse());
    }, [listMenuItem]);

    const onRedirectLogin = () => {
        // Toast.show(RESPONSE_TYPE.WARNING, null, "Vui lòng đăng nhập trước !");
        toast.current && toast.current.show({severity:'warn', detail:'Vui lòng đăng nhập trước !', life: 3000});
        setTimeout(() => {
            window.location.href = '/login';
        }, 1500);
        return <></>
    }

    const checkAuthorities = props =>
        isAuthorized ? (
            <ErrorBoundary>
                <div className={`wrap-content wrap-container`}>
                    { isAuthenticated && hasBreadCrumb  && <BreadCrumb model={itemBreadCum} home={home} />}
                    {/* <Component {...props} popout={true} popoutParams = {props.match.params} /> */}
                    <Component {...props} />
                </div>
            </ErrorBoundary> ) :
            (
                <>
                    <Toast ref={toast} />
                    { onRedirectLogin() }
                    {/* <div className="insufficient-authority m-auto">
                        <div className="alert alert-danger text-center">
                            <h1>403</h1>
                            <h5>Forbidden</h5>
                            <Translate contentKey="error.http.403">You are not authorized to access this page.</Translate>
                            <br/>
                            <Link className="sign-in" to="/admin/login">
                                <Translate contentKey="login.signIn"></Translate>
                            </Link>
                            <Translate contentKey="login.signInOther"></Translate>
                        </div>
                    </div> */}
                </>
            )
    const renderRedirect = props => {
        return checkAuthorities(props);
    };

    return <Route {...rest} render={renderRedirect} />;
};

export const hasAnyAuthority = (hasAnyAuthorities: string[]) => {
    const { roles } = Storage.local.get('userInfo') || {};
    if (!roles) {
        return hasAnyAuthorities.includes(AUTHORITIES.GUEST);
    }
    if (hasAnyAuthorities.length === 0) {
        return true;
    }
    return hasAnyAuthorities.includes(roles[0]);
};

const mapStateToProps = (
    { authentication: { isAuthenticated, account, isSessionHasBeenFetched, menu, listMenuItem } }: IRootState,
    { hasAnyAuthorities = [] }: IOwnProps
) => ({
    isAuthenticated,
    isAuthorized: hasAnyAuthority(hasAnyAuthorities),
    isSessionHasBeenFetched,
    menu,
    listMenuItem
});


MenuPrivateRouteComponent.defaultProps = {
    componentDisplayName: "",
    hasBreadCrumb: false
}

type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
    setAuthenticated
};

type DispatchProps = typeof mapDispatchToProps;

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export const MenuPrivateRoute = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { pure: false }
)(MenuPrivateRouteComponent);

export default MenuPrivateRoute;
