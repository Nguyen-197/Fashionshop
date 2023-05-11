
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Formik, useFormik } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import UserService from 'src/services/user.services';
import { CommonUtil } from 'src/utils/common-util';
import { Button } from 'primereact/button';
import { translate } from 'react-jhipster';
import { RESPONSE_CODE, RESPONSE_TYPE } from 'src/enum';
import SizeService from 'src/services/size.services';
import ColorService from 'src/services/color.services';
import BaseDialog from 'src/app/components/BaseDialog';
import * as yup from 'yup';
import _ from 'lodash';
import BaseDropdown from 'src/app/components/BaseDropdownControl';
import BaseTextControl from 'src/app/components/BaseTextControl';
import BasePasswordControl from 'src/app/components/BasePasswordControl';
import BaseNumberControl from 'src/app/components/BaseNumberControl';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import BaseTextarea from 'src/app/components/BaseTextarea';
import CategoryControl from '../../category/components/category-control';
import BaseFileControl from 'src/app/components/BaseFileControl';
import BaseSwitchControl from 'src/app/components/BaseSwitchControl';
import BaseFileSelectorControl from 'src/app/components/BaseFileControl/FileSelector';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type IUserFormProps = StateProps & DispatchProps & {
    userId?: number,
    afterSaveSuccess?: (res) => void,
    onHide: () => void,
}

const UserForm = forwardRef((props: IUserFormProps, ref: any) => {
    const userRef = useRef<any>(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [title, setTitle] = useState('Thêm mới khách hàng');
    const [formData, setFormData] = useState({});
    const [datasourceRole, setDatasourceRole] = useState([]);
    useEffect(() => {
        const datasourceRole = [{ code: 1, name: 'ADMIN' }, { code: 2, name: 'STAFF' }]
        setDatasourceRole(datasourceRole)
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            if (props.userId) {
                setTitle('Cập nhật nhân viên');
                UserService.findById(props.userId).then((res) => {
                    const user = res.data;
                    setValues(user.data);
                }).catch(() => {
                    props.onHide && props.onHide();
                });
            } else {
                setTitle('Thêm mới nhân viên');
            }
            userRef.current && userRef.current.show();
        }
        fetchData();
    }, []);
    const {
        initialValues,
        values,
        setValues,
        touched,
        errors,
        setErrors,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            active: true
        },
        onSubmit: async (data: any) => {
            await onSubmit(data);
        },
        validationSchema: yup.object().shape({
            fullName: yup.string().max(200).required(),
            email: yup.string().email("Địa chỉ email không hợp lệ").max(200).required(),
            password: yup.string().min(6).max(200).required(),
            passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không trùng khớp'),
            phoneNumber: yup.string().matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Số điện thooại không hợp lệ").required(),
            role: yup.object().shape({
                id: yup.number().required(),
                name: yup.string()
            })
        }),
        validateOnMount: false
    });
    const footer = (
        <div className='text-center'>
            <Button
                type="submit"
                form="user-form"
                label={translate('common.saveLabel')}
                icon="pi pi-check"
            />
            <Button type="button" label={translate('common.cancelLabel')} icon="pi pi-times" className="p-button-danger" onClick={() => props.onHide && props.onHide()} />
        </div>
    );
    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
    };
    const onSubmit = async (data) => {
        const dataTemp = _.cloneDeep(data);
        console.log("dataTemp",dataTemp);
        
        setFormData(dataTemp);
        await CommonUtil.confirmSaveOrUpdate(async () => {
            await UserService.saveOrUpdate(dataTemp).then((res) => {
                if (res.data.type == RESPONSE_TYPE.SUCCESS) {
                    setDisplayBasic(false);
                    if (props.afterSaveSuccess) {
                        props.afterSaveSuccess(res);
                    }
                }
            }).catch(error => {
                const { data } = error.response;
                if (data.code == RESPONSE_CODE.ERROR_VALIDATE) {
                    const fields = data.data
                    setErrors(CommonUtil.convertDataError(fields));
                } else if (data.code == RESPONSE_CODE.DUPLICATE_CODE) {
                    console.log(">> data: ", data);
                }
            });
        });
    }
    return (
        <>
            <BaseDialog
                ref={userRef}
                onHide={() => props.onHide && props.onHide()}
                header={title}
                footer={footer}
                style={{ width: '80vw' }}
            >
                <form id="user-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <BaseTextControl
                                labelKey="Họ và tên"
                                property='fullName'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'fullName')}
                                autoFocus
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseTextControl
                                labelKey="Email"
                                property='email'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'email')}
                                callbackValueChange={onChange}
                            />
                        </div>
                    </div>
                    <>
                        {
                            !props.userId ?
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <BasePasswordControl
                                            labelKey='Mật khẩu'
                                            property='password'
                                            errors={errors}
                                            touched={touched}
                                            required={true}
                                            initialValue={_.get(values, 'password')}
                                            callbackValueChange={onChange}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <BasePasswordControl
                                            labelKey='Nhập lại mật khẩu'
                                            property='passwordConfirmation'
                                            errors={errors}
                                            touched={touched}
                                            required={true}
                                            initialValue={_.get(values, 'passwordConfirmation')}
                                            callbackValueChange={onChange}
                                        />
                                    </div>
                                </div> : ''
                        }
                    </>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <BaseTextControl
                                labelKey='Số điện thoại'
                                property='phoneNumber'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'phoneNumber')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseDropdownControl
                                labelKey="Quyền"
                                property='role'
                                fieldPath={`role.id`}
                                errors={errors}
                                touched={touched}
                                required={true}
                                options={datasourceRole}
                                optionValue='code'
                                optionLabel='name'
                                initialValue={_.get(values, `role.id`)}
                                callbackValueChange={onChange}
                            />
                        </div>
                    </div>
                </form>
            </BaseDialog>
        </>
    )
})

const mapStateToProps = ({ }: IRootState) => ({

});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
)(UserForm);
