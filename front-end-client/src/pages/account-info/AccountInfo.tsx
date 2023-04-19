import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useHistory, Link } from 'react-router-dom';
import Navigation from 'src/components/layouts/Navigation';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import _ from 'lodash';
import { Password } from 'primereact/password';
import LayoutCheckout from 'src/components/layouts/LayoutCheckout';
type IAccountInfoProps = StateProps & DispatchProps & {
}
const MENU = [
    {
        id: 1,
        label: "Dashboard",
        url: "/account-info",
    },
    {
        id: 2,
        label: "Orders",
        url: "/orders",
    },
    {
        id: 3,
        label: "Downloads",
        url: "/my-account/download",
    },
    {
        id: 4,
        label: "Account details",
        url: "/my-account/edit-account",
    },
    {
        id: 5,
        label: "Logout",
        url: "/logout",
    },
];
const AccountInfo = (props: IAccountInfoProps) => {
    const history = useHistory();
    const { values, touched, errors, setErrors, setFieldValue, handleSubmit } = useFormik({
        initialValues: {
            name: "",
            email: ""
        },
        onSubmit: async (data: any) => {

        }
    });
    return (
        <>
            <div style={{ paddingTop: 100 }}>
                <LayoutCheckout>
                    <>
                        <Navigation />
                        <div className="woocommerce-account">
                            <main className="container site-main">
                                <div className="row">
                                    <div className="col-3">
                                        <nav className="woocommerce-navigation">
                                            <ul>
                                                {
                                                    MENU.map(item => {
                                                        return (
                                                            <li key={item.id} className={`woocommerce-navigation-link woocommerce-navigation-link--${item.label.toLowerCase()}`}>
                                                                <Link to={item.url}>{item.label}</Link>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </nav>
                                    </div>
                                    <div className="col-9">
                                        <div className="woocommerce-content">
                                            <form>
                                                <h3>Account Details</h3>
                                                <div className="sb-account-details">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <label htmlFor="name">Name</label>
                                                            <InputText id="name" value={_.get(values, 'name')} />
                                                        </div>
                                                        <div className="col-6">
                                                            <label htmlFor="email">Email</label>
                                                            <InputText id="email" value={_.get(values, 'email')} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <h3>Password Change</h3>
                                                <fieldset>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <label htmlFor="password">Current password</label>
                                                            <Password id="password" value={_.get(values, 'password')} feedback={false} />
                                                        </div>
                                                        <div className="col-12">
                                                            <label htmlFor="newPassword">New password</label>
                                                            <Password id="newPassword" value={_.get(values, 'newPassword')} />
                                                        </div>
                                                        <div className="col-12">
                                                            <label htmlFor="confirmPassword">Confirm new password</label>
                                                            <Password id="confirmPassword" value={_.get(values, 'confirmPassword')} />
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </>
                </LayoutCheckout>
            </div>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoginSuccess: authentication.isLoginSuccess,
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(AccountInfo);
