import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react'
import { Switch, math } from 'react-router-dom';
import { useLocation, useHistory } from 'react-router';
import { classNames } from 'primereact/utils';
import { connect } from 'react-redux';
import { MenuPrivateRoute } from '../../../components/auth/MenuPrivateRoute';
import _ from 'lodash';
import PageNotFound from '../../../components/error/PageNotFound';
import ExceptionPage from '../../../components/error/ExceptionPage';
import PrimeReact from 'primereact/api';
import { SIDEBAR } from '../../../config/menu';
import { IRootState } from '../../../reducers';
import Header from '../layouts/header';
import AppMenu from '../layouts/app-menu';
import { handleSetMenu } from '../../../reducers/authentication';
import { Tooltip } from 'primereact/tooltip';
import CategoryComponent from '../components/category';
import ProductComponent from '../components/product';
import ProductDetailsComponent from '../components/product-details';
import ColorComponent from '../components/color';
import SizeComponent from '../components/size';
import UserComponent from '../components/user';
import CustomerComponent from '../components/customer';
import OrdersComponent from '../components/orders';
import OrderReturnComponent from '../components/order-return';
import SaleOffComponent from '../components/sale-off';
import AnalyticsComponent from '../components/dashboard';
import { AUTHORITIES } from 'src/enum';
// import SocialChanel from '../components/social-chanel'
// import SocialChanelSetting from "../components/social-chanel-setting"
export interface ILoginedComponentProps extends StateProps, DispatchProps {
    colorScheme: any,
    match: math
}
const LoginedComponent = (props: ILoginedComponentProps) => {
    const [rightMenuActive, setRightMenuActive] = useState(false);
    const [configActive, setConfigActive] = useState(false);
    const [menuMode, setMenuMode] = useState('sidebar');
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [ripple, setRipple] = useState(true);
    const [sidebarStatic, setSidebarStatic] = useState(false);
    const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false);
    const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [topbarMenuActive, setTopbarMenuActive] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(false);
    const [pinActive, setPinActive] = useState(true);
    const [activeInlineProfile, setActiveInlineProfile] = useState(false);
    const [resetActiveIndex, setResetActiveIndex] = useState(null);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const history = useHistory();
    PrimeReact.ripple = true;

    useLayoutEffect(() => {
        props.handleSetMenu(SIDEBAR);
        // console.log()
        if (window.innerWidth >= 1400) {
            setSidebarStatic(true);
            setSidebarActive(true);
        }
    }, [])
    const computedExpanded = (items, pathname) => {
        if (!items) {
            return;
        }
        items.forEach((child: any) => {
            if (pathname.includes(child.value)) {
                child.expanded = true;
                computedExpanded(child.items, pathname);
            }
            if (pathname == child.to) {
                child.className = 'parent-menu-active';
            }
        });
    }

    const memoizedValue = useMemo(() => {
        if (!props.menu || props.menu.length == 0) {
            return [];
        }
        const pathname = _.get(location, 'pathname') || '';
        // const items = _.cloneDeep(CommonUtil.computeMenu(menus));
        const items = _.cloneDeep(props.menu);
        computedExpanded(items, pathname);
        return items;
    }, [location, props.menu]);

    let rightMenuClick;
    let configClick;
    let menuClick;
    let searchClick = false;
    let topbarItemClick;

    useEffect(() => {
        // copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        setResetActiveIndex(true)
        setMenuActive(false)
    }, [menuMode])

    const onDocumentClick = () => {
        if (!searchClick && searchActive) {
            onSearchHide();
        }

        if (!topbarItemClick) {
            setTopbarMenuActive(false)
        }

        if (!menuClick) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false)
                setResetActiveIndex(true)
            }

            if (overlayMenuActive || staticMenuMobileActive) {
                setOverlayMenuActive(false);
                setStaticMenuMobileActive(false)
            }

            hideOverlayMenu();
            unblockBodyScroll();
        }

        if (!rightMenuClick) {
            setRightMenuActive(false)
        }

        if (configActive && !configClick) {
            setConfigActive(false);
        }

        topbarItemClick = false;
        menuClick = false;
        configClick = false;
        rightMenuClick = false;
        searchClick = false;
    }

    const onSearchHide = () => {
        setSearchActive(false);
        searchClick = false;
    }

    const onMenuModeChange = (menuMode) => {
        setMenuMode(menuMode);
        setOverlayMenuActive(false);
    }

    const onRightMenuButtonClick = () => {
        rightMenuClick = true;
        setRightMenuActive(true)
    }

    const onRightMenuClick = () => {
        rightMenuClick = true;
    }

    const onRightMenuActiveChange = (active) => {
        setRightMenuActive(active);
    }

    const onConfigClick = () => {
        configClick = true;
    }

    const onConfigButtonClick = (event) => {
        setConfigActive(prevState => !prevState)
        configClick = true;
        event.preventDefault();
    }

    const onRippleChange = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    }

    const onMenuButtonClick = (event) => {
        menuClick = true;

        if (isOverlay()) {
            setOverlayMenuActive(prevState => !prevState)
        }

        if (isDesktop()) {
            setStaticMenuDesktopInactive(prevState => !prevState)
        } else {
            setStaticMenuMobileActive(prevState => !prevState)
        }

        event.preventDefault();
    }

    const hideOverlayMenu = () => {
        setOverlayMenuActive(false)
        setStaticMenuMobileActive(false)
    }

    const onTopbarItemClick = (event) => {
        topbarItemClick = true;
        setTopbarMenuActive(prevState => !prevState)
        hideOverlayMenu();
        event.preventDefault();
    }

    const onToggleMenu = (event) => {
        menuClick = true;

        if (overlayMenuActive) {
            setOverlayMenuActive(false)
        }

        if (sidebarActive) {
            setSidebarStatic(prevState => !prevState)
        }

        event.preventDefault();
    }

    const onSidebarMouseOver = () => {
        if (menuMode === 'sidebar' && !sidebarStatic) {
            setSidebarActive(isDesktop());
            setTimeout(() => {
                setPinActive(isDesktop())
            }, 200);
        }
    }

    const onSidebarMouseLeave = () => {
        if (menuMode === 'sidebar' && !sidebarStatic) {
            setTimeout(() => {
                setSidebarActive(false);
                setPinActive(false);
            }, 250);
        }
    }

    const onMenuClick = () => {
        menuClick = true;
    }

    const onChangeActiveInlineMenu = (event) => {
        setActiveInlineProfile(prevState => !prevState);
        event.preventDefault();
    }

    const onRootMenuItemClick = () => {
        setMenuActive(prevState => !prevState)
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            hideOverlayMenu();
            setResetActiveIndex(true);
        }

        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false);
        }
    }

    const isHorizontal = () => {
        return menuMode === 'horizontal';
    }

    const isSlim = () => {
        return menuMode === 'slim';
    }

    const isOverlay = () => {
        return menuMode === 'overlay';
    }

    const isDesktop = () => {
        return window.innerWidth > 991;
    }


    const onInputClick = () => {
        searchClick = true
    }

    const breadcrumbClick = () => {
        searchClick = true;
        setSearchActive(true);
    }

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    const layoutClassName = classNames('layout-wrapper', {
        'layout-static': menuMode === 'static',
        'layout-overlay': menuMode === 'overlay',
        'layout-overlay-active': overlayMenuActive,
        'layout-slim': menuMode === 'slim',
        'layout-horizontal': menuMode === 'horizontal',
        'layout-active': menuActive,
        'layout-mobile-active': staticMenuMobileActive,
        'layout-sidebar': menuMode === 'sidebar',
        'layout-sidebar-static': menuMode === 'sidebar' && sidebarStatic,
        'layout-static-inactive': staticMenuDesktopInactive && menuMode === 'static',
        'p-ripple-disabled': !ripple
    });

    const isShowHeadAdmin = () => {
        const pathname = _.get(location, 'pathname') || '';
        if (pathname.startsWith('/admin/')) {
            return true;
        }
        return false;
        // return true;
    }

    const isShowMenu = () => {
        const pathname = _.get(location, 'pathname') || '';
        return true;
    }

    const renderComponent = () => {
        return (
            <>
                <div className={layoutClassName} onClick={onDocumentClick}>
                    {isShowHeadAdmin() && <Header />}
                    <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
                    <div className="layout-main">
                        {isShowMenu() &&
                            <AppMenu model={memoizedValue} onRootMenuItemClick={onRootMenuItemClick} onMenuItemClick={onMenuItemClick} onToggleMenu={onToggleMenu} onMenuClick={onMenuClick} menuMode={menuMode}
                                colorScheme={props.colorScheme} menuActive={menuActive}
                                sidebarActive={sidebarActive} sidebarStatic={sidebarStatic} pinActive={pinActive}
                                onSidebarMouseLeave={onSidebarMouseLeave} onSidebarMouseOver={onSidebarMouseOver}
                                activeInlineProfile={activeInlineProfile} onChangeActiveInlineMenu={onChangeActiveInlineMenu} resetActiveIndex={resetActiveIndex} />
                        }
                        <div className="layout-main-container">
                            <Switch>
                                {/* <MenuPrivateRoute path="/" exact component={Home} hasAnyAuthorities={[AUTHORITIES.STAFF, AUTHORITIES.ADMIN]} /> */}
                                {/* <ErrorBoundaryRoute path="/social-chanel" component={SocialChanel} />
                            <ErrorBoundaryRoute path="/social-chanel" component={SocialChanel} />
                            <ErrorBoundaryRoute path="/social-channel/facebook/setting" component={SocialChanelSetting} /> */}
                                <MenuPrivateRoute path={`${props.match.url}/analytics`} component={AnalyticsComponent} hasAnyAuthorities={[AUTHORITIES.ADMIN]}/>
                                <MenuPrivateRoute path={`${props.match.url}/orders`} component={OrdersComponent} />
                                <MenuPrivateRoute path={`${props.match.url}/category`} component={CategoryComponent} />
                                <MenuPrivateRoute path={`${props.match.url}/products`} component={ProductComponent} />
                                <MenuPrivateRoute path={`${props.match.url}/product-details`} component={ProductDetailsComponent} />
                                <MenuPrivateRoute path={`${props.match.url}/config/product-color`} component={ColorComponent} />
                                <MenuPrivateRoute path={`${props.match.url}/config/product-size`} component={SizeComponent} />
                                <MenuPrivateRoute path={`${props.match.url}/staff`} component={UserComponent} hasAnyAuthorities={[AUTHORITIES.ADMIN]}/>
                                <MenuPrivateRoute path={`${props.match.url}/customer`} component={CustomerComponent} />
                                <MenuPrivateRoute path={`${props.match.url}/order-returns`} component={OrderReturnComponent} />
                                <MenuPrivateRoute path={`${props.match.url}/config/sale-offs`} component={SaleOffComponent} />
                                <MenuPrivateRoute component={PageNotFound} />
                                <MenuPrivateRoute component={ExceptionPage} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </>
        )
    };

    return (
        <>
            {renderComponent()}
        </>
    )
}

const mapStateToProps = (
    { authentication }: IRootState) => ({
        isAuthenticated: authentication.isAuthenticated,
        menu: authentication.menu
    });

const mapDispatchToProps = {
    handleSetMenu
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export const  Logined = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginedComponent);

export default Logined;

