
import { connect } from 'react-redux';
import _ from 'lodash';
import { IRootState } from '../../../../reducers';
import './login.css';
import { useEffect } from 'react';
import { Storage, translate } from 'react-jhipster';
import { handleLogin } from '../../../../reducers/authentication';
import { useHistory } from 'react-router';
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password'
import { useFormik } from "formik";
import BgLogin from '../../../../app/content/images/login_illustration.png';
import BranchLogo from '../../../../app/content/images/logo.png';
import { setAuthenticated } from '../../../../reducers/authentication';
export interface ILoginIndexProps extends StateProps, DispatchProps {
}

const LoginIndex = (props: ILoginIndexProps) => {
    const history = useHistory();
    useEffect(() => {
        Storage.local.remove('token');
        localStorage.clear();
        sessionStorage.clear();
        props.setAuthenticated(false);
        // clear cookie
        const cookies = document.cookie;
        for (let i = 0; i < cookies.split(";").length; ++i) {
            const myCookie = cookies[i];
            if (myCookie) {
                const pos = myCookie.indexOf("=");
                const name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
    }, []);

    useEffect(() => {
        if (props.isAuthenticated && props.isLoginSuccess) {
            history.push('/admin/analytics');
        }
    }, [props.isAuthenticated, props.isLoginError]);
    const formik = useFormik({
        initialValues: {
            username: '',
            password: ''
        },
        onSubmit: async (formData) => {
            try {
                await props.handleLogin(formData, formik);
            } catch (error) {
                console.log(error);
            }
        }
    });

    const isFormFieldValid = (name) => {
        const _touched = _.get(formik?.touched, name);
        return !!(_touched && formik?.errors[name])
    };

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik?.errors[name]}</small>;
    };
    return (
        <>
            <div className="wrap-login__wrap height-100vh">
                <div className="signup-container">
                    <div className="left grey-100">
                        <div>
                            <img src={BgLogin} alt="logo" />
                        </div>
                    </div>
                    <div className="right">
                        <div className="branch-heading w-100 mb-24">
                            <img src={BranchLogo} width={80} alt="logo" />
                            <h3>{translate('admin.login.signIn')}</h3>
                            <p className="text-muted">{translate('admin.login.title')}</p>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <span className="p-float-label uname">
                                <InputText
                                    id="username"
                                    name="username"
                                    className={`w-100${isFormFieldValid('username') ? ' p-invalid' : ''}`}
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                />
                                <label htmlFor="username">{ translate('admin.login.username') }</label>
                                {/* {getFormErrorMessage("username")} */}
                            </span>
                            <span className="p-float-label password">
                                <Password
                                    id="password"
                                    name="password"
                                    className={`w-100${isFormFieldValid('password') ? ' p-invalid' : ''}`}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    toggleMask
                                    feedback={false}
                                />
                                <label htmlFor="password">{ translate('admin.login.password') }</label>
                                {/* {getFormErrorMessage("password")} */}
                            </span>
                            <div className="button-group">
                                <Button type="submit" hidden/>
                                <Button type="submit" label={translate('admin.login.signIn')} aria-label={translate('admin.login.signIn')} onClick={() => formik.handleSubmit()} loading={props.isLoading} />
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </>
    );
};
const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoginSuccess: authentication.isLoginSuccess,
    isLoginError: authentication.isLoginError,
    isAuthenticated: authentication.isAuthenticated,
    isLoading: authentication.isLoading,
    accountInfo: authentication.accountInfo
});

const mapDispatchToProps = {
    handleLogin,
    setAuthenticated
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginIndex);
