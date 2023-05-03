import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import VideoShort from 'src/assets/images/hightlight_short.mp4';
import YunoLogo from 'src/assets/images/new-folder-image/logo/logo.png';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useFormik } from 'formik';
import _ from 'lodash';
import { handleLogin, setAuthenticated } from 'src/reducers/authentication';
import { Button } from 'primereact/button';
import * as FaIcon from "react-icons/fa";
import { useHistory } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Storage } from 'react-jhipster';
import { UserContext } from 'src/context/user';
import BaseLayout from 'src/components/layouts/BaseLayout';
import Banner from '../home/Banner';
import LoginForm from './LoginForm';
import SignForm from './SignForm';
type ILoginProps = StateProps & DispatchProps & {
}

const Login = (props: ILoginProps) => {
    const { userInfo } = useContext(UserContext);
    const history = useHistory();
    const [loginMode, setLoginMode] = useState(true);
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

    const callbackFunction = (data) => {
        setLoginMode(data);
    }
    return (
        <>  
            <BaseLayout>
                <div>
                    <Banner/>
                    <div className="flex-center my-8">
                        {loginMode &&
                        <LoginForm 
                            loginMode={loginMode}
                            parentCallback={callbackFunction}
                        />
                        }
                        {
                            !loginMode &&
                            <SignForm
                                loginMode={loginMode}
                                parentCallback={callbackFunction}
                            />
                        }
                    </div>
                </div>
            </BaseLayout>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoginSuccess: authentication.isLoginSuccess,
    isAuthenticated: authentication.isAuthenticated,
});

const mapDispatchToProps = {
    setAuthenticated
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(Login);
