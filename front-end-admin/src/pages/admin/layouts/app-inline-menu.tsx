import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { classNames } from 'primereact/utils';
import { translate } from 'react-jhipster';
import { useHistory } from 'react-router';
import { IRootState } from '../../../reducers';
import { useEffect } from 'react';
type IAppInlineMenuProps = StateProps & DispatchProps & {
    menuMode: any,
    activeInlineProfile: any,
    onChangeActiveInlineMenu: any,
}

const AppInlineMenu = (props: IAppInlineMenuProps) => {
    const history = useHistory();
    useEffect(() => {
        console.log(">>>>> test", props.accountInfo);
        
    }, []);
    const isSlim = () => {
        return props.menuMode === 'slim';
    }

    const isStatic = () => {
        return props.menuMode === 'static';
    }

    const isSidebar = () => {
        return props.menuMode === 'sidebar';
    }

    const isMobile = () => {
        return window.innerWidth <= 991;
    }

    const handleLogout = () => {
        window.location.href = '/admin/login';
    }

    return (
        <>
            {!isMobile() && (isStatic() || isSlim() || isSidebar()) && <div className={classNames('layout-inline-menu', { 'layout-inline-menu-active': props.activeInlineProfile })}>
                <button className="layout-inline-menu-action p-link" onClick={props.onChangeActiveInlineMenu}>
                    <img src={require('../../../app/content/images/profile-image.png')} alt="avatar" style={{ width: '44px', height: '44px' }} />
                    <span className="layout-inline-menu-text">{ props.accountInfo.fullName || "Gene Russell" }</span>
                    <i className="layout-inline-menu-icon pi pi-angle-down"></i>
                </button>
                <CSSTransition classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={props.activeInlineProfile} unmountOnExit>
                    <ul className="layout-inline-menu-action-panel">
                        <li className="layout-inline-menu-action-item">
                            <button className="p-link" onClick={handleLogout}>
                                <i className="pi pi-power-off pi-fw"></i>
                                <span>{ translate('share.logout') }</span>
                            </button>
                        </li>
                        <li className="layout-inline-menu-action-item">
                            <button className="p-link">
                                <i className="pi pi-cog pi-fw"></i>
                                <span>{ translate('share.setting') }</span>
                            </button>
                        </li>
                        <li className="layout-inline-menu-action-item">
                            <button className="p-link">
                                <i className="pi pi-user pi-fw"></i>
                                <span>{ translate('share.profile') }</span>
                            </button>
                        </li>
                    </ul>
                </CSSTransition>
            </div>}
        </>
    )
}

const mapStateToProps = ({ locale, authentication }: IRootState) => ({
    currentLocale: locale.currentLocale,
    accountInfo: authentication.accountInfo,
    a:authentication,

});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
)(AppInlineMenu);
