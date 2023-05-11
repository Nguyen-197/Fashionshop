import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
type INavigationProps = StateProps & DispatchProps & {
}
const LIST_MENU = [
    {
        id: 1,
        label: "Tài khoản của tôi",
        url: "/account/profile",
    },
    {
        id: 2,
        label: "Đơn mua",
        url: "/purchase",
    },
    {
        id: 3,
        label: "Đăng xuất",
        url: "/logout",
    }
];
const Navigation = (props: INavigationProps) => {
    const location = useLocation();
    const getMenuActive = (url: any) => {
        const pathname = location.pathname;
        return url == pathname;
    }
    return (
        <>
            <div className="woocommerce-page-header">
                <div className="container">
                    <ul className="navigation-list">
                        <li className={classNames("account-link line-hover", {
                            active: getMenuActive("/account-info")
                        })}>
                            <Link to="/account-info">Tài khoản của tôi</Link>
                        </li>
                        <li className={classNames("order-tracking-link line-hover", {
                            active: getMenuActive("/purchase")
                        })}>
                            <Link to="/purchase">Đơn mua</Link>
                        </li>
                        <li className="logout-link line-hover">
                            <Link to="/login">Đăng xuất</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(Navigation);
