import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import VideoShort from 'src/assets/images/hightlight_short.mp4';
import ZuneLogoBlack from 'src/assets/images/zune-logo.png';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useFormik } from 'formik';
import _ from 'lodash';
import { handleLogin, setAuthenticated } from 'src/reducers/authentication';
import { Button } from 'primereact/button';
import * as FaIcon from "react-icons/fa";
import BannerLogin from 'src/assets/images/login-banner.jpeg';
import { useHistory } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Storage } from 'react-jhipster';
import { UserContext } from 'src/context/user';
type ILoginProps = StateProps & DispatchProps & {
}

const Login = (props: ILoginProps) => {
    const { userInfo } = useContext(UserContext);
    const history = useHistory();
    const { values, touched, errors, setErrors, setFieldValue, handleSubmit } = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        onSubmit: async (data: any) => {
            try {
                await props.handleLogin(data);
            } catch (error) {
                console.log(">>>> error: ", error);
            }
        }
    });

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
            history.push('/home');
        }
    }, [props.isLoginSuccess, props.isAuthenticated]);

    const onChange = async (fieldName: string, event: any) => {
        await setFieldValue(fieldName, event.target.value);
    };
    return (
        <>
            {/* <div className='video__player'>
                <video width="100%" height="100%" autoPlay muted loop>
                    <source src={VideoShort} type="video/mp4"></source>
                </video>
            </div> */}
            <div className="login-overlay flex-center">
                <div className="login-box flex">
                    <div className="login-left flex-center flex-col">
                        <img width="30%" src={ZuneLogoBlack} alt="ZuneLogo" />
                        <form className="login-form flex-col" onSubmit={handleSubmit}>
                            <div>
                                <InputText id="username" name="username" placeholder="Username" value={_.get(values, 'username')} onChange={(event) => onChange('username', event)} />
                            </div>
                            <div>
                                <Password id="password" name="password" placeholder="Password" value={_.get(values, 'password')} onChange={(event) => onChange('password', event)} feedback={false} />
                            </div>
                            <div>
                                <Button
                                    className="login-normal"
                                    label="Đăng nhập"
                                    onClick={() => handleSubmit()}
                                />
                                <Button onClick={() => handleSubmit()}>
                                    <FaIcon.FaFacebookSquare className="icon" />
                                    <span className="px-3">Đăng nhập với Facebook</span>
                                </Button>
                                <Button onClick={() => handleSubmit()}>
                                    <FaIcon.FaGoogle className="icon" />
                                    <span className="px-3">Đăng nhập với Google</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div className="login-right">
                        <div className="animation-overlay"></div>
                        <img src={BannerLogin} alt="banner-login" />
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoginSuccess: authentication.isLoginSuccess,
    isAuthenticated: authentication.isAuthenticated,
});

const mapDispatchToProps = {
    handleLogin,
    setAuthenticated
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(Login);
