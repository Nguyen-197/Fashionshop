
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Formik, useFormik } from 'formik';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import UserService from 'src/services/user.services';
import AddressService from 'src/services/address.services';
import { CommonUtil } from 'src/utils/common-util';
import { Button } from 'primereact/button';
import { translate } from 'react-jhipster';
import { RESPONSE_CODE, RESPONSE_TYPE } from 'src/enum';
import BaseDialog from 'src/app/components/BaseDialog';
import * as yup from 'yup';
import _ from 'lodash';
import BaseDropdown from 'src/app/components/BaseDropdownControl';
import BaseTextControl from 'src/app/components/BaseTextControl';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type ICustomerFormProps = StateProps & DispatchProps & {
    userId?: number,
    afterSaveSuccess?: (res) => void,
    onHide: () => void,
}

const CustomerForm = forwardRef((props: ICustomerFormProps, ref: any) => {
    const customerRef = useRef<any>(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [title, setTitle] = useState('Thêm mới khách hàng');
    const [formData, setFormData] = useState({});
    const [dataProvince, setDataProvince] = useState([]);
    const [dataDistrict, setDataDistrict] = useState([]);
    const [dataWard, setDataWard] = useState([]);
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    useEffect(() => {
        const fetchData = async () => {
            await UserService.getprovince().then((resp) => {
                setDataProvince(resp.data.data)
            })
            if (props.userId) {
                setTitle('Cập nhật khách hàng');
                let formData = {
                    id: "",
                    fullName: "",
                    password: "",
                    email: "",
                    phoneNumber: "",
                    active: true,
                    address: {
                        province: null,
                        district: null,
                        ward: null,
                        id: null
                    },
                    role: {
                        id: null,
                        name: ""
                    },
                    addressDetail: ""
                };
                await UserService.findById(props.userId).then((res) => {
                    const user = res.data.data;
                    formData.id = user.id
                    formData.fullName = user.fullName
                    formData.email = user.email
                    formData.role.id = user.role.id
                    formData.active = user.active
                    formData.phoneNumber = user.phoneNumber
                })
                await AddressService.findByUserId(props.userId).then((res) => {
                    if (res.data.data.length) {
                        const address = res.data.data[0];
                        formData.address.province = address.province * 1
                        formData.address.district = address.district * 1
                        formData.address.id = address.id
                        formData.address.ward = address.ward
                        formData.addressDetail = address.addressDetail
                    }
                })
                setValues(formData);
            } else {
                setTitle('Thêm mới khách hàng');
            }
            customerRef.current && customerRef.current.show();
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
            role: {
                id: 3,
                name: ''
            },
        },
        onSubmit: async (data: any) => {
            await onSubmit(data);
        },
        validationSchema: yup.object().shape({
            fullName: yup.string().max(200).required(),
            email: yup.string().email("Địa chỉ email không hợp lệ").max(200).required(),
            phoneNumber: yup.string().matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, "Số điện thooại không hợp lệ").required(),
            address: yup.object().shape({
                province: yup.mixed().required(),
                district: yup.mixed().required(),
                ward: yup.mixed().required()
            }),
            addressDetail: yup.string().max(200).required(),
        }),
        validateOnMount: false
    });
    const footer = (
        <div className='text-center'>
            <Button
                type="submit"
                form="customer-form"
                label={translate('common.saveLabel')}
                icon="pi pi-check"
            />
            <Button type="button" label={translate('common.cancelLabel')} icon="pi pi-times" className="p-button-danger" onClick={() => props.onHide && props.onHide()} />
        </div>
    );
    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    };
    const onChangeProvince = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (value) {
            const form = { province_id: value }
            await UserService.getdistrict(form).then((resp) => {
                setDataDistrict(resp.data.data)
            })
        }
        if (evt) {
            handleChange(evt);
        }
    };
    const onChangeDistrict = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (value) {
            const form = { district_id: value }
            await UserService.getward(form).then((resp) => {
                setDataWard(resp.data.data)
            })
        }
        if (evt) {
            handleChange(evt);
        }
    };
    useEffect(() => {
        console.log('values', values);

    }, [values])
    const onSubmit = async (data) => {
        const dataTemp = _.cloneDeep(data);
        setFormData(dataTemp);
        const provinceAddress = dataProvince.filter(item => item.ProvinceID == dataTemp.address.province)[0].ProvinceName
        const districtAddress = dataDistrict.filter(item => item.DistrictID == dataTemp.address.district)[0].DistrictName
        const wardAddress = dataWard.filter(item => item.WardCode == dataTemp.address.ward)[0].WardName
        console.log(dataTemp);
        console.log(dataTemp.role.id);
        const dataUser = {
            id: dataTemp.id || null,
            fullName: dataTemp.fullName,
            email: dataTemp.email,
            password: '123456a@',
            phoneNumber: dataTemp.phoneNumber,
            role: {
                id: dataTemp.role.id ? dataTemp.role.id : 3,
                name: ''
            },
            active: true
        }
        await CommonUtil.confirmSaveOrUpdate(async () => {
            await UserService.saveOrUpdate(dataUser).then(async res => {
                if (res.data.type == RESPONSE_TYPE.SUCCESS) {
                    const addressFull = [];
                    const formAddress = {
                        id: dataTemp.address.id || null,
                        userId: res.data.data.id,
                        fullName: dataTemp.fullName,
                        phoneNumber: dataTemp.phoneNumber,
                        province: dataTemp.address.province,
                        district: dataTemp.address.district,
                        ward: dataTemp.address.ward,
                        addressDetail: dataTemp.addressDetail,
                        isDefault: true,
                    }
                    if (data.addressDetail) addressFull.push(data.addressDetail);
                    if (wardAddress) addressFull.push(wardAddress);
                    if (districtAddress) addressFull.push(districtAddress);
                    if (provinceAddress) addressFull.push(provinceAddress);
                    formAddress['addressFull'] = addressFull.join(', ');
                    const rest = await AddressService.saveOrUpdate(formAddress);
                    if (res.data.type == RESPONSE_TYPE.SUCCESS) {
                        setDisplayBasic(false);
                        props.afterSaveSuccess && props.afterSaveSuccess(res.data.data);
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
                ref={customerRef}
                onHide={() => props.onHide && props.onHide()}
                header={title}
                footer={footer}
                style={{ width: '80vw' }}
            >
                <form id="customer-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
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
                                labelKey="Tỉnh/Thành phố"
                                property='province'
                                fieldPath={`address.province`}
                                errors={errors}
                                touched={touched}
                                required={true}
                                options={dataProvince}
                                optionValue='ProvinceID'
                                optionLabel='ProvinceName'
                                initialValue={_.get(values, `address.province`)}
                                callbackValueChange={onChangeProvince}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <BaseDropdownControl
                                labelKey="Quận/huyện"
                                property='district'
                                fieldPath={`address.district`}
                                errors={errors}
                                touched={touched}
                                required={true}
                                options={dataDistrict}
                                optionValue='DistrictID'
                                optionLabel='DistrictName'
                                initialValue={_.get(values, `address.district`)}
                                callbackValueChange={onChangeDistrict}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseDropdownControl
                                labelKey="Tỉnh/xã"
                                property='ward'
                                fieldPath={`address.ward`}
                                errors={errors}
                                touched={touched}
                                required={true}
                                options={dataWard}
                                optionValue='WardCode'
                                optionLabel='WardName'
                                initialValue={_.get(values, `address.ward`)}
                                callbackValueChange={onChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <BaseTextControl
                                labelKey='Địa chỉ chi tiết'
                                property='addressDetail'
                                errors={errors}
                                touched={touched}
                                initialValue={_.get(values, 'addressDetail')}
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
)(CustomerForm);
