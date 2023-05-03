import { connect } from 'react-redux';
import BaseTextControl from 'src/components/BaseTextControl';
import BasePasswordControl from 'src/components/BasePasswordControl';
import authencationServices from 'src/services/authencation.services';
import { RESPONSE_CODE, RESPONSE_TYPE } from 'src/enum';
import * as yup from 'yup';
import { useFormik } from 'formik';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { CommonUtil } from 'src/utils/common-util';
type ISignProps = StateProps & DispatchProps & {
    loginMode?: boolean,
    parentCallback?: Function
}

const Sign = (props: ISignProps) => {
    const { values, touched, errors, setErrors, setFieldValue, handleChange , handleSubmit } = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            phoneNumber: "",
            active: true,
            role: {id: 3},
        },
        onSubmit: async (data: any) => {
            try {
                await authencationServices.signin(data).then((res) => {
                    if(res.data.type == RESPONSE_TYPE.SUCCESS) {
                        
                    }
                })
            //   const resp = await props.handleSignIn(data)
            //   if(resp)
            //   console.log("resp", resp);
              
            //    props.parentCallback(true)
            } catch (error) {
                console.log(">>>> error: ", error);
            }
        },
        validationSchema: yup.object().shape({
            fullName: yup.string().max(200).required(),
            email: yup.string().email("Địa chỉ email không hợp lệ").max(200).required(),
            password: yup.string().min(6).max(200).required(),
            passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không trùng khớp').required(),
            phoneNumber: yup.string().matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Số điện thooại không hợp lệ").required(),
        }),
        validateOnMount: false
    });

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    };
    return (
        <>  
            <div className={"box-login flex-center flex-col" + (props.loginMode ? ' slide-out-blurred-left' : ' slide-in-blurred-right')}>
                <h3>Đăng ký </h3>
                <form className="login-form flex-col" onSubmit={handleSubmit}>
                    <div>
                        <BaseTextControl
                            property='fullName'
                            errors={errors}
                            touched={touched}
                            placeholder='Họ và Tên'
                            required={true}
                            initialValue={_.get(values, 'fullName')}
                            autoFocus
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div>
                        <BaseTextControl
                            property='email'
                            errors={errors}
                            touched={touched}
                            placeholder='Email'
                            required={true}
                            initialValue={_.get(values, 'email')}
                            autoFocus
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div>
                        <BaseTextControl
                            placeholder='Số điện thoại'
                            property='phoneNumber'
                            errors={errors}
                            touched={touched}
                            required={true}
                            initialValue={_.get(values, 'phoneNumber')}
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div>
                        <BasePasswordControl
                            placeholder='Mật khẩu'
                            property='password'
                            errors={errors}
                            touched={touched}
                            required={true}
                            initialValue={_.get(values, 'password')}
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div>
                        <BasePasswordControl
                            placeholder='Nhập lại mật khẩu'
                            property='passwordConfirmation'
                            errors={errors}
                            touched={touched}
                            required={true}
                            initialValue={_.get(values, 'passwordConfirmation')}
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div>
                        <Button
                            className="login-normal"
                            label="Đăng ký"
                        />
                    </div>
                    <div className='mt-3'>Đã tài khoản? <span className='sign' onClick={() => {props.parentCallback(true)}}>Đăng nhập</span></div>
                </form>
            </div>
        </>
    )
}

const mapStateToProps = () => ({

});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(Sign);
