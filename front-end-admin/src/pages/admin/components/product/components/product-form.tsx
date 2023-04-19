
import { connect, Options } from 'react-redux';
import { IRootState } from 'src/reducers';
import { forwardRef, useEffect, useRef, useState } from 'react';
import ProductService from 'src/services/product.services';
import { CommonUtil } from 'src/utils/common-util';
import { Button } from 'primereact/button';
import { translate } from 'react-jhipster';
import { RESPONSE_CODE, RESPONSE_TYPE } from 'src/enum';
import SizeService from 'src/services/size.services';
import ColorService from 'src/services/color.services';
import BaseDialog from 'src/app/components/BaseDialog'
import { useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import BaseTextControl from 'src/app/components/BaseTextControl';
import BaseNumberControl from 'src/app/components/BaseNumberControl';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import BaseTextarea from 'src/app/components/BaseTextarea';
import CategoryControl from '../../category/components/category-control';
import BaseFileControl from 'src/app/components/BaseFileControl';
import BaseFileSelectorControl from 'src/app/components/BaseFileControl/FileSelector';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'src/components/toast/toast.utils';
import { GENDER_OPTION } from 'src/constants/constants';
import { classNames } from 'primereact/utils';
type IProductFormProps = StateProps & DispatchProps & {
    onHide?: () => void,
    afterSaveSuccess?: (res) => void,
    productId?: any,
    viewMode?: boolean,
}

const ProductForm = forwardRef((props: IProductFormProps, ref: any) => {
    const productRef = useRef<any>(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [title, setTitle] = useState('');
    const [formData, setFormData] = useState({});
    const [image, setImage] = useState(null);
    const [datasourceSize, setDatasourceSize] = useState([]);
    const [datasourceColor, setDatasourceColor] = useState([]);
    const [propertiesType, setPropertiesType] = useState(null);
    const [productDetails, setProductDetails] = useState([])
    useEffect(() => {
        const loadData = async () => {
            await SizeService.findAll().then(resp => {
                const sizeResponse = resp?.data;
                if (sizeResponse?.type == RESPONSE_TYPE.SUCCESS) {
                    setDatasourceSize(sizeResponse.data)
                }
            });
            await ColorService.findAll().then(resp => {
                const sizeResponse = resp?.data;
                if (sizeResponse?.type == RESPONSE_TYPE.SUCCESS) {
                    setDatasourceColor(sizeResponse.data)
                }
            });
        }
        loadData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (props.productId) {
                setTitle("Cập nhật sản phẩm")
                await ProductService.findById(props.productId).then(resp => {
                    if (resp.data.type === RESPONSE_TYPE.SUCCESS) {
                        const restData = resp.data.data;
                        const listProductDetail = restData?.listProductDetail?.map(item => {
                            item.idColor = item.color.id;
                            item.idSize = item.size.id;
                            delete item.color;
                            delete item.size;
                            return item;
                        });
                        restData.listProductDetail = !CommonUtil.isEmpty(listProductDetail) ? listProductDetail : [{}];
                        setValues(_.cloneDeep({ ...restData, idCategory: restData.category.id }));
                    }
                }).catch(() => {
                    props.onHide && props.onHide();
                })
            } else {
                setTitle("Thêm mới sản phẩm");
            }
            productRef.current && productRef.current.show();
        }
        fetchData();
    }, []);

    const {
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
            code: "",
            name: "",
            productGender: null,
            mass: 0,
            image: null,
            idCategory: null,
            description: null,
            listProductDetail: [{}]
        },
        onSubmit: async (data: any) => {
            await onSubmit(data);
        },
        validationSchema: yup.object().shape({
            // code: yup.string().required(),
            name: yup.string().max(200).required(),
            image: yup.mixed().required(),
            mass: yup.number().required(),
            idCategory: yup.mixed().required(),
            productGender: yup.mixed().required(),
            description: yup.string().max(5000),
            listProductDetail: yup.array().of(
                yup.object().shape({
                    // image: yup.mixed().required(),
                    idColor: yup.mixed().required(),
                    idSize: yup.mixed().required(),
                    costPrice: yup.number().required(),
                    finalPrice: yup.number().required(),
                    quantity: yup.number().required(),
                })
            )
        }),
        validateOnMount: false
    });

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    };

    const onSubmit = async (data) => {
        const dataTemp = _.cloneDeep(data);
        const checkDuplicate = checkDuplicateProductDetails(dataTemp.listProductDetail)
        if (checkDuplicate) {
            Toast.error("Size và color đã tồn tại trong list");
            return;
        }
        setFormData(dataTemp);
        console.log("dataTemp", dataTemp);

        await CommonUtil.confirmSaveOrUpdate(async () => {
            await ProductService.saveOrUpdate(dataTemp).then((res) => {
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
    /**
     * Hàm check trùng size và color của 1 product
     * @param productDetails
     */
    const checkDuplicateProductDetails = (productDetails) => {
        const mapValue = new Map();
        for (let index = 0; index < productDetails.length; index++) {
            const keyProduct  = productDetails[index].idSize + "_" + productDetails[index].idColor;
            if (mapValue.has(keyProduct)) {
                return true;
            }
            mapValue.set(keyProduct, true);
        }
        return false;

    }

    /**
     * Render cột STT
     * @param {*} rowData
     * @param {*} x
     * @return {*}
     */
    const renderSTT = (rowData: any, x: any) => {
        return <>{x.rowIndex + 1}</>;
    };

    /**
     * Xóa dòng Đơn vị trực thuộc
     * @param {*} rowData
     * @param {*} extValue
     */
    const onDeleteRow = (rowData: any, extValue: any) => {
        let { listProductDetail } = values;
        listProductDetail = listProductDetail || [];
        listProductDetail.splice(extValue.rowIndex, 1);
        if (listProductDetail.length == 0) {
            listProductDetail.push({});
        }
        setFieldValue('listProductDetail', _.cloneDeep(listProductDetail));
    };

    /**
     * Thêm dòng Đơn vị trực thuộc
     */
    const onAddRow = () => {
        let { listProductDetail } = values;
        listProductDetail = listProductDetail || [];
        listProductDetail.push({});
        setFieldValue('listProductDetail', listProductDetail);
    };

    /**
     * Render cột action
     * @param {*} rowData
     * @param {*} extValue
     * @return {*}
     */
    const renderActionColumn = (rowData: any, extValue: any) => {
        return (
            <>
                {
                    !props.viewMode &&
                    <div className='text-center'>
                        <Button type="button" disabled={props.viewMode} tooltip={translate('common.addLabel')} icon="pi pi-plus" className="p-button-rounded p-button-text p-button-info p-button-plain" onClick={onAddRow} />
                        <Button type="button" disabled={props.viewMode} tooltip={translate('common.deleteLabel')} icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger p-button-plain ml-2" onClick={() => onDeleteRow(rowData, extValue)} />
                    </div>
                }
            </>
        );
    };

    const renderColumnImage = (rowData: any, extValue: any) => {
        return (
            <>
                <BaseFileSelectorControl
                    property='image'
                    fieldPath={`listProductDetail[${extValue.rowIndex}].image`}
                    errors={errors}
                    touched={touched}
                    disabled={props.viewMode}
                    required={true}
                    multiple={true}
                    upstreamFiles={_.get(values, 'image')}
                    initialValue={_.get(values, `listProductDetail[${extValue.rowIndex}].image`)}
                    callbackValueChange={onChange}
                />
            </>
        )
    };
    const renderColumnSize = (rowData: any, extValue: any) => {
        return (
            <>
                <BaseDropdownControl
                    property='idSize'
                    fieldPath={`listProductDetail[${extValue.rowIndex}].idSize`}
                    errors={errors}
                    touched={touched}
                    required={true}
                    disabled={props.viewMode}
                    options={datasourceSize}
                    optionValue='id'
                    optionLabel='name'
                    initialValue={_.get(values, `listProductDetail[${extValue.rowIndex}].idSize`)}
                    callbackValueChange={onChange}
                />
            </>
        )
    };
    const renderColumnColor = (rowData: any, extValue: any) => {
        return (
            <>
                <BaseDropdownControl
                    property='idColor'
                    fieldPath={`listProductDetail[${extValue.rowIndex}].idColor`}
                    errors={errors}
                    touched={touched}
                    required={true}
                    disabled={props.viewMode}
                    options={datasourceColor}
                    optionValue='id'
                    optionLabel='name'
                    initialValue={_.get(values, `listProductDetail[${extValue.rowIndex}].idColor`)}
                    callbackValueChange={onChange}
                />
            </>
        )
    };
    const renderColumnImportPrice = (rowData: any, extValue: any) => {
        return (
            <>
                <BaseNumberControl
                    property='costPrice'
                    fieldPath={`listProductDetail[${extValue.rowIndex}].costPrice`}
                    min={0}
                    errors={errors}
                    touched={touched}
                    required={true}
                    disabled={props.viewMode}
                    initialValue={_.get(values, `listProductDetail[${extValue.rowIndex}].costPrice`)}
                    callbackValueChange={onChange}
                />
            </>
        )
    };
    const renderColumnSale = (rowData: any, extValue: any) => {
        return (
            <>
                <BaseNumberControl
                    property='finalPrice'
                    fieldPath={`listProductDetail[${extValue.rowIndex}].finalPrice`}
                    min={0}
                    errors={errors}
                    touched={touched}
                    required={true}
                    disabled={props.viewMode}
                    initialValue={_.get(values, `listProductDetail[${extValue.rowIndex}].finalPrice`)}
                    callbackValueChange={onChange}
                />
            </>
        )
    };
    const renderColumnQuantity = (rowData: any, extValue: any) => {
        return (
            <>
                <BaseNumberControl
                    property='quantity'
                    fieldPath={`listProductDetail[${extValue.rowIndex}].quantity`}
                    min={0}
                    errors={errors}
                    touched={touched}
                    required={true}
                    disabled={props.viewMode}
                    initialValue={_.get(values, `listProductDetail[${extValue.rowIndex}].quantity`)}
                    callbackValueChange={onChange}
                />
            </>
        )
    };

    const footer = (
        <div className='text-center'>
            {!props.viewMode &&
                <Button
                    type="submit"
                    form="product-form"
                    label={translate('common.saveLabel')}
                    icon="pi pi-check"
                    disabled={props.viewMode}
                />
            }
            <Button type="button" label={translate('common.cancelLabel')} icon="pi pi-times" className="p-button-danger" onClick={() => props.onHide && props.onHide()} />
        </div>
    );
    return (
        <>
            <BaseDialog
                ref={productRef}
                onHide={() => props.onHide && props.onHide()}
                header={title}
                footer={footer}
                style={{ width: '80vw' }}
            >
                <form id="product-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
                    <div className="row">
                        {
                            props.productId &&
                            <div className="col-12 col-md-4">
                                <BaseTextControl
                                    labelKey={translate('product.productCode')}
                                    property='code'
                                    errors={errors}
                                    touched={touched}
                                    disabled={props.viewMode}
                                    required={true}
                                    initialValue={_.get(values, 'code')}
                                    autoFocus
                                    callbackValueChange={onChange}
                                />
                            </div>
                        }
                        <div className={classNames("col-12", { "col-md-4": props.productId, "col-md-6": !props.productId })}>
                            <BaseTextControl
                                labelKey={translate('product.name')}
                                property='name'
                                errors={errors}
                                touched={touched}
                                required={true}
                                disabled={props.viewMode}
                                initialValue={_.get(values, 'name')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className={classNames("col-12", { "col-md-4": props.productId, "col-md-6": !props.productId })}>
                            <CategoryControl
                                labelKey={translate('product.category')}
                                property='idCategory'
                                codeField='code'
                                nameField='name'
                                selectField='id'
                                errors={errors}
                                touched={touched}
                                required={true}
                                initialValue={_.get(values, 'idCategory')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseNumberControl
                                labelKey={"Khối lượng (g)"}
                                property='mass'
                                min={0}
                                errors={errors}
                                touched={touched}
                                required={true}
                                disabled={props.viewMode}
                                initialValue={_.get(values, 'mass')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseDropdownControl
                                labelKey={"Giới tính"}
                                property='productGender'
                                errors={errors}
                                touched={touched}
                                required={true}
                                disabled={props.viewMode}
                                options={GENDER_OPTION}
                                optionValue='id'
                                optionLabel='name'
                                initialValue={_.get(values, "productGender")}
                                callbackValueChange={onChange}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-12">
                        <BaseFileControl
                            labelKey={translate('product.image')}
                            property='image'
                            errors={errors}
                            touched={touched}
                            required={true}
                            disabled={props.viewMode}
                            multiple={true}
                            initialValue={_.get(values, 'image')}
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div className="col-12 col-md-12">
                        <BaseTextarea
                            labelKey={translate('product.description')}
                            property='description'
                            errors={errors}
                            touched={touched}
                            readOnly={props.viewMode}
                            // disabled={props.viewMode}
                            rows={4}
                            initialValue={_.get(values, 'description')}
                            callbackValueChange={onChange}
                        />
                    </div>
                    <div className="col-12 col-md-12">
                        <DataTable
                            value={(values as any)?.listProductDetail}
                            scrollable
                            scrollDirection='both'
                            paginator={false}
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            emptyMessage={translate('common.dataNotFound')}
                        >
                            <Column header={translate('common.rowNum')} body={renderSTT} style={{ width: '50px' }} bodyClassName="text-center"></Column>
                            <Column header={translate('product.image')} body={renderColumnImage} style={{ width: '120px' }}></Column>
                            <Column header={translate('product.size')} field="idSize" body={renderColumnSize} style={{ width: '300px' }}></Column>
                            <Column header={translate('product.color')} field="idColor" body={renderColumnColor} style={{ width: '300px' }}></Column>
                            <Column header={translate('product.importPrice')} field="importPrice" body={renderColumnImportPrice} style={{ width: '300px' }}></Column>
                            <Column header={translate('product.price')} field="price" body={renderColumnSale} style={{ width: '300px' }}></Column>
                            <Column header={translate('product.quantity')} field="quantity" body={renderColumnQuantity} style={{ width: '300px' }}></Column>
                            {!props.viewMode && <Column header={translate('common.actionLabel')} body={renderActionColumn} style={{ width: '120px' }}></Column>}
                        </DataTable>
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
const options = { forwardRef: true };
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
    // @ts-ignore
)(ProductForm);
