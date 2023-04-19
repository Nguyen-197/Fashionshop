
import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from '../../reducers';
import { PanelMenu } from 'primereact/panelmenu';
import { useLocation } from 'react-router';
import _ from 'lodash';
import { getMenu, handleSetMenu } from '../../reducers/authentication';
import { Storage } from 'react-jhipster';
import { SIDEBAR } from './constant';
import { CommonUtil } from '../../utils/common-util';
export interface ISidebarMenuLeftProps extends StateProps, DispatchProps {
    componentDisplay: string;
}

const SidebarMenuLeft = (props: ISidebarMenuLeftProps) => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [layoutColorMode, setLayoutColorMode] = useState('light');
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const location = useLocation();

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
        const items = _.cloneDeep(props.menu);
        computedExpanded(items, pathname);
        return items;
    }, [location, props.menu]);


    const menu = [
        {
            label: 'Home',
            items: [{
                label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'
            }]
        },
        {
            label: 'Pages', icon: 'pi pi-fw pi-clone',
            items: [
                { label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud' },
                { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/timeline' },
                { label: 'Empty', icon: 'pi pi-fw pi-circle-off', to: '/empty' }
            ]
        },
        {
            label: 'Menu Hierarchy', icon: 'pi pi-fw pi-search',
            items: [
                {
                    label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                            ]
                        },
                        {
                            label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.2.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                    ]
                },
                {
                    label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.1.3', icon: 'pi pi-fw pi-bookmark' },
                            ]
                        },
                        {
                            label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 2.2.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            label: 'Get Started',
            items: [
                { label: 'Documentation', icon: 'pi pi-fw pi-question' },
                { label: 'View Source', icon: 'pi pi-fw pi-search' }
            ]
        },
        {
            label: 'UI Components', icon: 'pi pi-fw pi-sitemap',
            items: [
                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/formlayout' },
                { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/input' },
                { label: "Float Label", icon: "pi pi-fw pi-bookmark", to: "/floatlabel" },
                { label: "Invalid State", icon: "pi pi-fw pi-exclamation-circle", to: "invalidstate" },
                { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/button' },
                { label: 'Table', icon: 'pi pi-fw pi-table', to: '/table' },
                { label: 'List', icon: 'pi pi-fw pi-list', to: '/list' },
                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/tree' },
                { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/panel' },
                { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/overlay' },
                { label: "Media", icon: "pi pi-fw pi-image", to: "/media" },
                { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/menu' },
                { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/messages' },
                { label: 'File', icon: 'pi pi-fw pi-file', to: '/file' },
                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/chart' },
                { label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/misc' },
            ]
        },
        {
            label: 'UI Blocks',
            items: [
                { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: "NEW" },
                { label: 'All Blocks', icon: 'pi pi-fw pi-globe', to: 'https://www.primefaces.org/primeblocks-react' }
            ]
        },
        {
            label: 'Icons',
            items: [
                { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/icons' }
            ]
        }
    ];

    const toggleShowSidebar = () => {
        setShowSidebar(!showSidebar);
    }
    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }

    return (
        <>
            <div className="layout-menu-wrapper layout-sidebar-active">
                {/* <AppMenu
                    model={memoizedValue}
                    onMenuItemClick={onMenuItemClick}
                    layoutColorMode={layoutColorMode}
                /> */}
            </div>
        </>
    );
};
const mapStateToProps = ({ authentication }: IRootState) => ({
    menu: authentication.menu
});

const mapDispatchToProps = {
    getMenu,
    handleSetMenu
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SidebarMenuLeft);
