import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import BaseTextControl from 'src/components/BaseTextControl';
import BasePasswordControl from 'src/components/BasePasswordControl';
import { useFormik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import { handleLogin, setAuthenticated } from 'src/reducers/authentication';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
type ILoginProps = StateProps & DispatchProps & {
    loginMode?: boolean,
    parentCallback?: Function
}

const Login = (props: ILoginProps) => {
    const history = useHistory();
    const { values, touched, errors, setErrors, setFieldValue, handleChange, handleSubmit } = useFormik({
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
        },
        validationSchema: yup.object().shape({
            username: yup.string().email("Địa chỉ email không hợp lệ").max(200).required(),
            password: yup.string().min(6).max(200).required(),
        }),
        validateOnMount: false
    });

    // useEffect(() => {
    //     if (props.isAuthenticated && props.isLoginSuccess) {
    //         history.push('/home');
    //     }
    // }, [props.isLoginSuccess, props.isAuthenticated]);

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    };
    return (
        <>  
            <div className={"box-login flex-center flex-col" + (!props.loginMode ? ' slide-out-blurred-left' : ' slide-in-blurred-right')}>
                <h3>Đăng nhập</h3>
                <form className="login-form flex-col" onSubmit={handleSubmit}>
                    <div>
                        <BaseTextControl
                            property='username'
                            errors={errors}
                            touched={touched}
                            placeholder='Tài khoản'
                            required={true}
                            initialValue={_.get(values, 'username')}
                            autoFocus
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div>
                        <BasePasswordControl
                            property='password'
                            errors={errors}
                            touched={touched}
                            placeholder='Mật khẩu'
                            required={true}
                            feedback={false}
                            toggleMask 
                            initialValue={_.get(values, 'password')}
                            autoFocus
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div>
                        <Button
                            className="login-normal"
                            label="Đăng nhập"
                            onClick={() => handleSubmit()}
                        />
                    </div>
                    <div className='mt-3'>Chưa có tài khoản? <span className='sign' onClick={() => {props.parentCallback(false)}}>Đăng ký</span></div>
                </form>
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
