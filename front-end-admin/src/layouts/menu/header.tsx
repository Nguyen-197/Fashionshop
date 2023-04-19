import React, { useMemo, useRef } from 'react';
import logo from 'src/app/content/images/logotest.png'
import { translate } from 'react-jhipster';
import { Avatar } from 'primereact/avatar';
import { TieredMenu } from 'primereact/tieredmenu';
import { IRootState } from '../../reducers';
import { connect } from 'react-redux';
export interface IHeaderProps {
    isAuthenticated?: boolean;
}

const Header = (props: IHeaderProps & DispatchProps & StateProps) => {
    const refMenu = useRef(null);

    const items = [
        {
            label: props.accountInfo?.email,
            disabled: true
        },
        {
            separator: true
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-fw pi-power-off',
            command: (event) => {
                window.location.href = "/account/login";
            }
        }
    ];

    const characterName = useMemo(() => {
        return props.accountInfo?.userName ? props.accountInfo?.userName[0].toUpperCase() : '#';
    }, [props.accountInfo]);

    return <>
        <div className="layout-topbar">
            dsad
        </div>
    </>;
};

const mapStateToProps = ({ authentication }: IRootState) => ({
    accountInfo: authentication.accountInfo
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

// export default Header;
