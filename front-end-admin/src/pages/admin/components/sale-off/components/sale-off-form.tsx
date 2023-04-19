
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useFormik } from 'formik';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { CommonUtil } from 'src/utils/common-util';
import { Button } from 'primereact/button';
import { translate } from 'react-jhipster';
import { RESPONSE_TYPE, SALEOFF_TYPE } from 'src/enum';
import BaseDialog from 'src/app/components/BaseDialog';
import * as yup from 'yup';
import _ from 'lodash';
import BaseTextControl from 'src/app/components/BaseTextControl';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import BaseTextarea from 'src/app/components/BaseTextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import BaseDateControl from 'src/app/components/BaseDateControl';
import TextSelectControl from 'src/app/components/BaseTextSelect';
import { DISCOUNT_TYPE, SALEOFF_OPTION } from 'src/constants/constants';
import useDebounce from 'src/utils/useDebounce';
import { Image } from 'primereact/image';
import { Panel } from 'primereact/panel';
import productServices from 'src/services/product.services';
import categoryServices from 'src/services/category.services';
import BaseNumberControl from 'src/app/components/BaseNumberControl';
import { Toast } from 'src/components/toast/toast.utils';
import saleOffServices from 'src/services/sale-off.services';
import { classNames } from 'primereact/utils';
type ISaleOffFormProps = StateProps & DispatchProps & {
    saleOffId?: number,
    afterSaveSuccess?: (res) => void,
    onHide: () => void,
}

const SaleOffForm = forwardRef((props: ISaleOffFormProps, ref: any) => {
    const userRef = useRef<any>(null);
    const productRef = useRef<any>(null);
    const categoryRef = useRef<any>(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [datasourceCategory, setDatasourceCategory] = useState([]);
    const [datasourceProduct, setDatasourceProduct] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState('Tạo chương trình khuyến mại');
    useEffect(() => {
        const fetchData = async () => {
            if (props.saleOffId) {
                setTitle('Cập nhật chương trình khuyến mại');
                const response = await saleOffServices.findById(props.saleOffId);
                if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                    const restData = response.data.data;
                    setIsEdit(true);
                    setValues(restData);
                }
            } else {
                setTitle('Tạo chương trình khuyến mại');
            }
            userRef.current && userRef.current.show();
        }
        fetchData();
    }, [props.saleOffId]);
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
            listPromotionDetail: []
        },
        onSubmit: async (data: any) => {
            try {
                const listPromotionDetail = _.get(data, 'listPromotionDetail');
                if (CommonUtil.isNullOrEmpty(listPromotionDetail)) {
                    Toast.show(RESPONSE_TYPE.WARNING, null, "Bạn chưa chọn sản phẩm");
                    modeSale === SALEOFF_TYPE.PRODUCT ?
                        productRef.current && productRef.current.focusIn() : categoryRef.current && categoryRef.current.focusIn()
                    return;
                }
                const formData = {
                    id: data.id,
                    name: data.name,
                    code: data.code,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    promotionType: data.promotionType,
                    description: data.description,
                    listPromotionDetail: listPromotionDetail.map(item => ({
                        objectId: item.objectId,
                        discountType: item.discountType,
                        discount: item.discount,
                        promotionLimited: item.promotionLimited
                    }))
                };
                const response = await saleOffServices.saveOrUpdate(formData);
                if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                    props.afterSaveSuccess && props.afterSaveSuccess(response);
                }
            } catch (error) {
                console.log(">>> Error: " + error);
            }
        },
        validationSchema: yup.object().shape({
            name: yup.string().max(200).required(),
            // code: yup.string().max(200).required(),
            promotionType: yup.mixed().required(),
            startDate: yup.mixed().required(),
            endDate: yup.date().typeError("* Trường này không được để trống").min(yup.ref('startDate'), `Ngày hết hiệu lực phải trước ngày hiệu lực`).required("* Trường này không được để trống"),
            listPromotionDetail: yup.array().of(
                yup.object().shape({
                    objectId: yup.number().required(),
                    objectName: yup.mixed().required(),
                    promotionLimited: yup.number().min(1000).required(),
                    discountType: yup.number().required(),
                    discount: yup.number().when("discountType", (discountType, schema) => {
                        if (discountType == DISCOUNT_TYPE[1].id) {
                            return discountType && schema.max(100);
                        }
                    }).required(),
                })
            ),
        }),
        validateOnMount: false
    });
    const modeSale = useDebounce(_.get(values, "promotionType"), 100);
    const footer = (
        <div className='text-center'>
            { !isEdit &&
                <Button
                    type="submit"
                    form="sale-off-form"
                    label={translate('common.saveLabel')}
                    icon="pi pi-check"
                />
            }
            <Button type="button" label={translate('common.cancelLabel')} icon="pi pi-times" className="p-button-danger" onClick={() => props.onHide && props.onHide()} />
        </div>
    );
    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    };
    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex * 1 + 1}</>
    }
    const renderImg = (rowData) => {
        return <Image src={rowData.image} alt={`${rowData.productName}`} width="80" preview />
    }
    const onRemoveItem = async (rowData) => {
        if (isEdit) return;
        const listPromotionDetail = _.get(values, `listPromotionDetail`);
        const index = listPromotionDetail?.findIndex(item => item.objectId == rowData.objectId);
        if (index != -1) {
            listPromotionDetail.splice(index, 1);
            await setFieldValue('listPromotionDetail', _.cloneDeep(listPromotionDetail));
        }
    }
    const renderActionDelete = (rowData) => {
        return (<i className={classNames("pi pi-times", { "p-disabled": isEdit })} onClick={() => onRemoveItem(rowData)}></i>)
    }
    useEffect(() => {
        const fetchDataPage = async () => {
            const restCategory = await categoryServices.findAll();
            if (restCategory.data.type == RESPONSE_TYPE.SUCCESS) {
                setDatasourceCategory(restCategory.data.data);
            }
            const restProduct = await productServices.filterProduct();
            if (restProduct.data.type == RESPONSE_TYPE.SUCCESS) {
                setDatasourceProduct(restProduct.data.data);
            }
        }
        fetchDataPage();
    }, [modeSale]);

    useEffect(() => {
        console.log(">>>> values: ", values);
    }, [values])

    const onSelectedItem = async (item) => {
        const listPromotionDetail = _.get(values, "listPromotionDetail");
        const mapSaleOffItem = {};
        listPromotionDetail.forEach(item => mapSaleOffItem[item.id] = item);
        if (!CommonUtil.isNullOrEmpty(mapSaleOffItem[item.id])) {
            Toast.show(RESPONSE_TYPE.WARNING, null, "Sản phẩm đã tồn tại trong danh sách");
            return;
        }
        const newItem = { objectId: item.id, objectName: item.name };
        if (modeSale == SALEOFF_TYPE.PRODUCT) { newItem['image'] = _.get(item, 'image'); }
        listPromotionDetail.push(newItem);
        await setFieldValue('listPromotionDetail', _.cloneDeep(listPromotionDetail));
    }

    const renderDropdownProduct = (
        <ul className="product-dropdown">
            {datasourceProduct?.map(item => {
                return (
                    <li className="product-item" key={item.id} onClick={() => onSelectedItem(item)}>
                        <Image src={item.image} alt={`${item.name}`} width="50" preview />
                        <div className="product-content">
                            <div className="share-info">
                                <p>{item.name}</p>
                                <p>{item.code}</p>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    );
    const renderDropdownCategory = (
        <ul className="product-dropdown">
            {datasourceCategory?.map(item => {
                return (
                    <li className="product-item" key={item.id} onClick={() => onSelectedItem(item)}>
                        <div className="product-content">
                            <div className="share-info">
                                <div className="flex-center">
                                    <span style={{ fontWeight: 500, marginRight: '6px' }}>Tên danh mục: </span><p style={{ fontWeight: 700 }}>{item.name}</p>
                                </div>
                                <div className="flex-center">
                                    <span style={{ fontWeight: 500, marginRight: '6px' }}>Mã danh mục: </span><p style={{ fontWeight: 700 }}>{item.code}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    );
    const templateHeader = () => {
        return (
            <>
                {
                    !isEdit &&
                    <div className="sale-off-overlaypanel">
                        {
                            modeSale == SALEOFF_TYPE.PRODUCT ?
                            <TextSelectControl
                                ref={productRef}
                                labelKey="Chọn sản phẩm áp dụng khuyến mại"
                                showLabel={false}
                                isAdd={false}
                                labelAdd="Thêm mới sản phẩm"
                                property="objectId"
                                initialValue={_.get(values, "objectId")}
                                placeholder="Chọn sản phẩm áp dụng khuyến mại"
                                callbackValueChange={onChange}
                                temlateBody={renderDropdownProduct}
                            /> :
                            <TextSelectControl
                                ref={categoryRef}
                                labelKey="Chọn danh mục sản phẩm áp dụng khuyến mại"
                                showLabel={false}
                                isAdd={false}
                                labelAdd="Thêm mới danh mục"
                                property="objectId"
                                initialValue={_.get(values, "objectId")}
                                placeholder="Chọn danh mục sản phẩm áp dụng khuyến mại"
                                callbackValueChange={onChange}
                                temlateBody={renderDropdownCategory}
                            />
                        }
                    </div>
                }
            </>
        );
    }

    const editPromotionLimited = (rowData: any, extValue: any) => {
        const initialValue = _.get(values, `listPromotionDetail[${extValue.rowIndex}].promotionLimited`);
        return (
            <>
                <BaseNumberControl
                    disabled={isEdit}
                    labelKey="Giới hạn khuyến mại"
                    showLabel={false}
                    required={true}
                    errors={errors}
                    touched={touched}
                    property={`listPromotionDetail[${extValue.rowIndex}].promotionLimited`}
                    initialValue={initialValue}
                    callbackValueChange={onChange}
                />
            </>
        );
    }
    const editDiscountType = (rowData: any, extValue: any) => {
        const initValType = _.get(values, `listPromotionDetail[${extValue.rowIndex}].discount`);
        const initValDiscount = _.get(values, `listPromotionDetail[${extValue.rowIndex}].discountType`) || DISCOUNT_TYPE[0].id;
        const maxPercent = initValDiscount == DISCOUNT_TYPE[1].id ? 100 : null;
        return (
            <>
                <BaseNumberControl
                    disabled={isEdit}
                    max={maxPercent}
                    labelKey="Chiết khấu"
                    showLabel={false}
                    required={true}
                    errors={errors}
                    touched={touched}
                    property={`listPromotionDetail[${extValue.rowIndex}].discount`}
                    initialValue={initValType}
                    callbackValueChange={onChange}
                />
                <BaseDropdownControl
                    labelKey="Loại chiết khấu"
                    showLabel={false}
                    errors={errors}
                    touched={touched}
                    required={true}
                    disabled={isEdit}
                    property={`listPromotionDetail[${extValue.rowIndex}].discountType`}
                    options={DISCOUNT_TYPE}
                    optionLabel="name"
                    optionValue="id"
                    initialValue={initValDiscount}
                    callbackValueChange={async(fieldName, event, value) => {
                        await setFieldValue(fieldName, value);
                        if (event) {
                            await setFieldValue(`listPromotionDetail[${extValue.rowIndex}].discount`, 0);
                        }
                    }}
                />
            </>
        );
    }
    return (
        <>
            <BaseDialog
                ref={userRef}
                onHide={() => props.onHide && props.onHide()}
                header={title}
                footer={footer}
                style={{ width: '65vw' }}
            >
                <form id="sale-off-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <BaseTextControl
                                labelKey="Tên khuyến mại"
                                property='name'
                                errors={errors}
                                touched={touched}
                                required={true}
                                disabled={isEdit}
                                initialValue={_.get(values, 'name')}
                                autoFocus
                                callbackValueChange={onChange}
                            />
                        </div>
                        {
                            isEdit && <div className="col-12 col-md-6">
                                <BaseTextControl
                                    labelKey="Mã khuyến mại"
                                    property='code'
                                    errors={errors}
                                    touched={touched}
                                    required={true}
                                    disabled={isEdit}
                                    initialValue={_.get(values, 'code')}
                                    callbackValueChange={onChange}
                                />
                            </div>
                        }
                        <div className="col-12 col-md-6">
                            <BaseDateControl
                                labelKey="Thời gian hiệu lực"
                                property='startDate'
                                errors={errors}
                                touched={touched}
                                required={true}
                                disabled={isEdit}
                                initialValue={_.get(values, 'startDate')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseDateControl
                                labelKey="Thời gian hết hiệu lực"
                                property='endDate'
                                errors={errors}
                                touched={touched}
                                disabled={isEdit}
                                required={true}
                                initialValue={_.get(values, 'endDate')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseDropdownControl
                                labelKey="Chọn phương thức khuyến mại"
                                property='promotionType'
                                errors={errors}
                                touched={touched}
                                disabled={isEdit}
                                initialValue={_.get(values, 'promotionType')}
                                options={SALEOFF_OPTION}
                                optionValue="id"
                                optionLabel="name"
                                callbackValueChange={async (fieldName, event, value) => {
                                    // const preValue = _.get(values, 'promotionType');
                                    await setFieldValue(fieldName, value);
                                    if (event) {
                                        await setFieldValue(`listPromotionDetail`, []);
                                    //     await CommonUtil.confirmDelete(async () => {
                                    //     }, async () => {
                                    //         await setFieldValue(fieldName, _.cloneDeep(preValue));
                                    //     }, "Bạn có đồng ý thay đổi phương thức khuyến mại ? Điều này sẽ xóa hết các điều kiện đã thêm.");
                                    // } else {
                                    //     await setFieldValue(fieldName, value);
                                    }
                                }}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <BaseTextarea
                                labelKey="Mô tả"
                                property='description'
                                errors={errors}
                                touched={touched}
                                disabled={isEdit}
                                initialValue={_.get(values, 'description')}
                                callbackValueChange={onChange}
                            />
                        </div>
                        { !CommonUtil.isNullOrEmpty(_.get(values, 'promotionType')) &&
                            <div className="col-12 col-md-12 no-empty">
                                <DataTable header={templateHeader} className="data-table-product" value={_.get(values, "listPromotionDetail") ?? []}
                                    stripedRows size="small" scrollable scrollDirection="both">
                                    <Column header="STT" body={renderSTT} style={{ flexGrow: 1, flexBasis: '40px' }} alignHeader="center" align="center"></Column>
                                    { modeSale == SALEOFF_TYPE.PRODUCT && <Column header="Hình ảnh" alignHeader="center" align="center" body={renderImg} style={{ flexGrow: 1, flexBasis: '80px' }}></Column> }
                                    { modeSale == SALEOFF_TYPE.PRODUCT && <Column field="objectName" header="Tên sản phẩm" style={{ flexGrow: 1, flexBasis: '300px' }}></Column> }
                                    { modeSale == SALEOFF_TYPE.CATEGORY && <Column field="objectName" header="Tên danh mục" style={{ flexGrow: 1, flexBasis: '300px' }}></Column> }
                                    <Column field="promotionLimited" header="Giới hạn khuyến mại" style={{ flexGrow: 1, flexBasis: '150px' }} body={editPromotionLimited}></Column>
                                    <Column field="discountType" header="Chiết khấu" style={{ flexGrow: 1, flexBasis: '250px' }} body={editDiscountType}></Column>
                                    <Column header="Thao tác" body={renderActionDelete} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '70px' }}></Column>
                                </DataTable>
                            </div>
                        }
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
)(SaleOffForm);
