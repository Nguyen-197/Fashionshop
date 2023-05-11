import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useHistory, Link } from 'react-router-dom';
import Navigation from 'src/components/layouts/Navigation';
import { InputText } from 'primereact/inputtext';
import BasePasswordControl from 'src/components/BasePasswordControl';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import _ from 'lodash';
import * as yup from 'yup';
import accountServices from 'src/services/account.services';
import LayoutCheckout from 'src/components/layouts/LayoutCheckout';
import { useEffect, useContext } from 'react';
import { UserContext } from 'src/context/user';
import { CommonUtil } from 'src/utils/common-util';
import { RESPONSE_TYPE} from 'src/@types/enums';
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
    const { userInfo } = useContext(UserContext);
    const { values, touched, errors, setErrors, setFieldValue, handleSubmit } = useFormik({
        initialValues: {
        },
        onSubmit: async (data: any) => {
            await onSubmit(data);
        },
        validationSchema: yup.object().shape({  
            password: yup.string().min(6).max(200).required(),
            newPassword: yup.string().min(6).max(200).required(),
            passwordConfirmation: yup.string().oneOf([yup.ref('newPassword'), null], 'Mật khẩu xác nhận không trùng khớp'),
        }),
        validateOnMount: false
    });
    const onSubmit = async (data) => {
        const dataTemp = _.cloneDeep(data);
        dataTemp['email'] = userInfo?.email
        accountServices.changePassword(dataTemp).then((resp) => {
            if(resp.data.type == RESPONSE_TYPE.SUCCESS) {
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            }
        })
    }
    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
    };
    useEffect(() => {
        console.log("userInfo",userInfo);
        
    }, [])
    return (
        <>
            <div style={{ paddingTop: 100, backgroundColor: '#F5F5F5' }}>
                <LayoutCheckout>
                    <>
                    <div className="layout-v2">
                        <Navigation />
                        <div className="woocommerce-account">
                            <main className="container site-main">
                                <div className="row">
                                    {/* <div className="col-3">
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
                                    </div> */}
                                    <div className="woocommerce-content p-4">
                                        <h3>Thông tin tài khoản</h3>
                                        <div className="sb-account-details">
                                            <div className="row">
                                                <div className="col-6">
                                                    <label htmlFor="name" className='mr-3'>Họ và Tên</label>
                                                    <InputText disabled id="name" className='p-inputtext-sm' value={userInfo?.fullName ?? ''} />
                                                </div>
                                                <div className="col-6">
                                                    <label htmlFor="email" className='mr-3'>Email</label>
                                                    <InputText disabled id="email" className='p-inputtext-sm' value={userInfo?.email ?? ''} />
                                                </div>
                                                <div className="col-6">
                                                    <label htmlFor="phone" className='mr-3'>Số điện thoại</label>
                                                    <InputText disabled id="phone" className='p-inputtext-sm' value={userInfo?.phoneNumber ?? ''} />
                                                </div>
                                            </div>
                                        </div>
                                        <h3>Thay đổi mật khẩu</h3>
                                            <form  id="user-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
                                                <div className="row">
                                                    <div className="col-12 d-flex">
                                                        <BasePasswordControl
                                                            labelKey='Mật khẩu cũ'
                                                            property='password'
                                                            className='p-inputtext-sm'
                                                            errors={errors}
                                                            touched={touched}
                                                            required={true}
                                                            feedback={false}
                                                            toggleMask 
                                                            initialValue={_.get(values, 'password')}
                                                            callbackValueChange={onChange}
                                                        />
                                                    </div>
                                                    <div className="col-12 d-flex">
                                                        <BasePasswordControl
                                                            labelKey='Mật khẩu mới'
                                                            property='newPassword'
                                                            className='p-inputtext-sm'
                                                            errors={errors}
                                                            touched={touched}
                                                            required={true}
                                                            toggleMask
                                                            initialValue={_.get(values, 'newPassword')}
                                                            callbackValueChange={onChange}
                                                        />
                                                    </div>
                                                    <div className="col-12 d-flex">
                                                        <BasePasswordControl
                                                            labelKey='Xác nhận lại mật khẩu'
                                                            property='passwordConfirmation'
                                                            className='p-inputtext-sm'
                                                            errors={errors}
                                                            touched={touched}
                                                            required={true}
                                                            initialValue={_.get(values, 'passwordConfirmation')}
                                                            callbackValueChange={onChange}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                            <div className='d-flex justify-content-end w-100'>
                                                <Button
                                                    type="submit"
                                                    form="user-form"
                                                    label="Thay đổi"
                                                />
                                            </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                    </>
                </LayoutCheckout>
            </div>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoginSuccess: authentication.isLoginSuccess
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
