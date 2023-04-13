import { useFormik } from 'formik';
import _ from 'lodash';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RESPONSE_TYPE } from 'src/@types/enums';
import BaseCheckboxControl from 'src/components/BaseCheckboxControl';
import BaseDropdownControl from 'src/components/BaseDropdownControl';
import BaseTextControl from 'src/components/BaseTextControl';
import { UserContext } from 'src/context/user';
import { IRootState } from 'src/reducers';
import addressServices from 'src/services/address.services';
import masterDataServices from 'src/services/master-data.services';
import { CommonUtil } from 'src/utils/common-util';
import * as yup from 'yup';
type IAddressFormProps = StateProps & DispatchProps & {
    addressId?: number;
    afterSaveSuccess?: Function;
    onHide?: Function;
}

const AddressForm = (props: IAddressFormProps) => {
    const { userInfo } = useContext(UserContext);
    const [dataSourceProvinces, setDataSourceProvinces] = useState([]);
    const [dataSourceDistricts, setDataSourceDistricts] = useState([]);
    const [dataSourceWards, setDataSourceWards] = useState([]);
    const [visible, setVisible] = useState(false);
    const [provinceName, setProvinceName] = useState(null);
    const [districtName, setDistrictName] = useState(null);
    const [wardName, setWardsName] = useState(null);

    const { values, errors, touched, handleSubmit, setFieldValue, setValues, handleChange } = useFormik({
        initialValues: {
            fullName: '',
            phoneNumber: '',
            province: '',
            district: '',
            ward: '',
            addressDetail: '',
            isDefault: false
        },
        onSubmit: async (data: any) => {
            try {
                CommonUtil.confirmSaveOrUpdate(async () => {
                    const addressFull = [];
                    if (data.addressDetail) addressFull.push(data.addressDetail);
                    if (wardName) addressFull.push(wardName);
                    if (districtName) addressFull.push(districtName);
                    if (provinceName) addressFull.push(provinceName);
                    const rest = await addressServices.saveOrUpdate({ ...data, userId: userInfo.id, addressFull: addressFull.join(', ')});
                    if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                        await props.afterSaveSuccess && props.afterSaveSuccess();
                        props.onHide && props.onHide();
                    }
                })
            } catch (error) {
                console.log(">>> error: ", error);
            }
        },
        validationSchema: yup.object().shape({
            fullName: yup.mixed().required(),
            phoneNumber: yup.string().max(10).required(),
            province: yup.mixed().required(),
            district: yup.mixed().required(),
            ward: yup.mixed().required(),
            addressDetail: yup.mixed().required()
        })
    });

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const masterData = await masterDataServices.getProvince();
            setDataSourceProvinces(masterData.data.data);
            if (props.addressId) {
                const addressDetail = await addressServices.findById(props.addressId);
                if (addressDetail.data.type == RESPONSE_TYPE.SUCCESS) {
                    const restData = addressDetail.data.data;
                    const _values = {
                        ...restData,
                        addressDetail: restData.addressDetail,
                        district: restData.district * 1,
                        province: restData.province * 1,
                    }
                    setValues(_values);
                }
            }
            setVisible(true);
        }
        fetchData();
    }, [props.addressId]);

    useEffect(() => {
        console.log(">>>> values: ", values);
    }, [values])

    const footer = () => {
        return (
            <div className="btn-group">
                <Button
                    className="p-button-text btn-default"
                    label="Hủy bỏ"
                    onClick={() => props.onHide && props.onHide()}
                />
                <Button
                    form="address-form"
                    type="submit"
                    label="Hoàn thành"
                    className="btn btn-primary"
                />
            </div>
        );
    }
    return (
        <>
            <Dialog
                style={{ width: '700px', height: '80vh' }}
                visible={visible}
                header="Địa chỉ mới"
                footer={footer}
                onHide={() => props.onHide && props.onHide()}
            >
                <form id="address-form" onSubmit={(event) => handleSubmit(event)}>
                    <div className="row">
                        <div className="col-6 col-md-6">
                            <BaseTextControl
                                labelKey="Họ tên"
                                property='fullName'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'fullName')}
                                autoFocus
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-6 col-md-6">
                            <BaseTextControl
                                labelKey="Số điện thoại"
                                property='phoneNumber'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'phoneNumber')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-6 col-md-6">
                            <BaseDropdownControl
                                labelKey="Tỉnh/Thành phố"
                                property='province'
                                errors={errors}
                                touched={touched}
                                required={true}
                                options={dataSourceProvinces}
                                optionLabel="ProvinceName"
                                optionValue="ProvinceID"
                                initialValue={_.get(values, 'province')}
                                callbackValueChange={async (fieldName, event, value) => {
                                    await setFieldValue(fieldName, value);
                                    if (!value) {
                                        await setFieldValue('district', null);
                                        await setFieldValue('ward', null);
                                        setDataSourceDistricts([]);
                                        setDataSourceWards([]);
                                        setProvinceName(null);
                                        return;
                                    }
                                    const _targetName = dataSourceProvinces.find(item => item.ProvinceID == value);
                                    if (_targetName) setProvinceName(_targetName.ProvinceName);
                                    const masterData = await masterDataServices.getDistrict(value);
                                    setDataSourceDistricts(masterData.data.data);
                                }}
                            />
                        </div>
                        <div className="col-6 col-md-6">
                            <BaseDropdownControl
                                labelKey="Quận/Huyện"
                                property='district'
                                errors={errors}
                                touched={touched}
                                required={true}
                                options={dataSourceDistricts}
                                optionLabel="DistrictName"
                                optionValue="DistrictID"
                                initialValue={_.get(values, 'district')}
                                callbackValueChange={async (fieldName, event, value) => {
                                    await setFieldValue(fieldName, value);
                                    if (!value) {
                                        await setFieldValue('ward', null);
                                        setDataSourceWards([]);
                                        setDistrictName(null);
                                        return;
                                    }
                                    const _targetName = dataSourceDistricts.find(item => item.DistrictID == value);
                                    if (_targetName) setDistrictName(_targetName.DistrictName);
                                    const masterData = await masterDataServices.getWard(value);
                                    setDataSourceWards(masterData.data.data);
                                }}
                            />
                        </div>
                        <div className="col-6 col-md-6">
                            <BaseDropdownControl
                                labelKey="Phường/Xã"
                                property='ward'
                                errors={errors}
                                touched={touched}
                                required={true}
                                options={dataSourceWards}
                                optionLabel="WardName"
                                optionValue="WardCode"
                                initialValue={_.get(values, 'ward')}
                                callbackValueChange={async (fieldName, event, value) => {
                                    await setFieldValue(fieldName, value);
                                    if (!value) {
                                        setWardsName(null);
                                        return;
                                    }
                                    const _targetName = dataSourceWards.find(item => item.WardCode == value);
                                    if (_targetName) setWardsName(_targetName.WardName);
                                }}
                            />
                        </div>
                        <div className="col-6 col-md-6">
                            <BaseTextControl
                                labelKey="Địa chỉ chi tiết"
                                property='addressDetail'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'addressDetail')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-6 col-md-6 d-flex">
                        <Checkbox inputId="cb1" checked={_.get(values, 'isDefault')} onChange={async (event) => await setFieldValue('isDefault', event.checked)}></Checkbox>
                        <label htmlFor="cb1" style={{ marginLeft: '8px' }} className="p-checkbox-label">Đặt làm mặc định</label>
                            {/* <BaseCheckboxControl
                                labelKey="Đặt làm mặc định"
                                property='isDefault'
                                errors={errors}
                                trueValue={1}
                                falseValue={0}
                                touched={touched}
                                initialValue={_.get(values, 'isDefault')}
                                callbackValueChange={onChange}
                            /> */}
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    )
}

const mapStateToProps = ({  }: IRootState) => ({

});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(AddressForm);
