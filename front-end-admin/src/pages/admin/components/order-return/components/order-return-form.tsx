
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useHistory, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { CommonUtil } from 'src/utils/common-util';
import orderServices from 'src/services/order.services';
import { DELIVERY_TYPE, PAYMENT_STATUS, PAYMENT_TYPE, RESPONSE_TYPE, RETURN_ORDER_STATUS, RETURN_TYPE, STATUS_ORDER, STATUS_REFUND } from 'src/enum';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import _ from 'lodash';
import { useFormik } from 'formik';
import { Card } from 'primereact/card';
import addressServices from 'src/services/address.services';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';
import BaseNumberControl from 'src/app/components/BaseNumberControl';
import { Checkbox } from 'primereact/checkbox';
import { DELIVERY_ORDER, REASON_OPTION } from 'src/constants/constants';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import orderReturnServices from 'src/services/order-return.services';
import useDebounce from 'src/utils/useDebounce';
import * as yup from 'yup';
import TextSelectControl from 'src/app/components/BaseTextSelect';
import BaseTextarea from 'src/app/components/BaseTextarea';
import productServices from 'src/services/product.services';
import DialogProductDetail from '../../orders/components/DialogProductDetail';
import ProductForm from '../../product/components/product-form';
import { SHOP_ID } from 'src/@types/constants';
import shipGhnServices from 'src/services/ship-ghn.services';
import { Toast } from 'src/components/toast/toast.utils';
type IOrderFormProps = StateProps & DispatchProps & {
}

const OrderReturnForm = (props: IOrderFormProps) => {
    const history = useHistory();
    const { search } = useLocation();
    const orderId = new URLSearchParams(search).get('orderId');
    const mapStep = { 0: STATUS_ORDER.ORDER, 1: STATUS_ORDER.APPROVE_ORDER, 2: STATUS_ORDER.PACK_ORDER, 3: STATUS_ORDER.DELIVERING, 4: STATUS_ORDER.COMPLETE_ORDER, 5: STATUS_ORDER.CANCEL_ORDER }
    const [isPaid, setIsPaid] = useState(false);
    const [isPaidBuy, setIsPaidBuy] = useState(false);
    const [hasReturn, setHasReturn] = useState(false);
    const [isReceived, setIsReceived] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [customerSelected, setCustomerSelected] = useState(null);
    const [addressCustomer, setAddressCustomer] = useState(null);
    const [datasourceProduct, setDatasourceProduct] = useState([]);
    const [productId, setProductId] = useState(null);
    const [deliveryType, setDeliveryType] = useState(DELIVERY_TYPE.GHN);
    const [feeShip, setfeeShip] = useState(null);
    const [showSelectProductDetail, setShowSelectProductDetail] = useState(false);
    const {
        values,
        errors,
        touched,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            methodType: 1,
            isExchangeable: 1,
            lstOrderDetail: [],
            lstProductDetail: []
        },
        validationSchema: yup.object().shape({
            reason: yup.mixed().required(),
            lstProductDetail: yup.array().of(
                yup.object().shape({
                    quantityBuy: yup.number().min(1).required(),
                })
            ),
            lstOrderDetail: yup.array().of(
                yup.object().shape({
                    quantityReturn: yup.number().min(1).required(),
                })
            )
        }),
        onSubmit: async (data) => {
            await onSubmitOrderReturn(data);
        }
    });

    const lstOrderDetail = useDebounce(_.get(values, 'lstOrderDetail'), 100);
    const productDebounce = useDebounce(_.get(values, 'lstProductDetail'), 100);
    const isRefreshFeeShip = useDebounce(_.get(values, 'lstProductDetail'), 1500);

    const goBack = () => {
        history.push('/admin/order-returns');
    }

    const hasProduct = useMemo(() => {
        const lst = _.get(values, 'lstProductDetail');
        return !CommonUtil.isEmpty(lst);
    }, [_.get(values, 'lstProductDetail')]);

    const fetchProducts = async () => {
        const restProduct = await productServices.filterProduct();
        if (restProduct.data.type == RESPONSE_TYPE.SUCCESS) {
            setDatasourceProduct(restProduct.data.data);
        }
    }

    const buildFormSaveGHN = () => {
        const formData = {
            shop_id: SHOP_ID,
            payment_type_id: 2,
            to_name: addressCustomer.fullName,
            to_phone: addressCustomer.phoneNumber,
            to_address: addressCustomer.addressFull,
            to_ward_code: addressCustomer.ward,
            to_district_id: addressCustomer.district,
            weight: calMassProduct,
            length: 15,
            width: 15,
            height: 15,
            insurance_value: productDebounce.reduce((item, preItem) => { return item + (preItem.salePrice * preItem.quantity) }, 0) ,
            service_id: 0,
            service_type_id: 2,
            pick_shift:[2],
            items: productDebounce.filter(item => item.quantityBuy > 0).map(item => ({
                name: item.productName,
                quantity: item.quantityBuy || 0,
                price: item.finalPrice,
            })),
            quantity: calQuantityProduct,
            required_note: _.get(values, 'requestNote'),
        };
        return formData;
    }

    useEffect(() => {
        if (hasReturn && CommonUtil.isEmpty(datasourceProduct)) {
            fetchProducts();
        }
    }, [hasReturn]);

    useEffect(() => {
        const fetchDetailOrder = async () => {
            if (CommonUtil.isNullOrEmpty(orderId)) {
                goBack();
            }
            try {
                const detailOrder = await orderServices.getOrderReturn(orderId);
                if (detailOrder.data.type == RESPONSE_TYPE.SUCCESS) {
                    const restData = detailOrder.data.data;
                    restData['lstProductDetail'] = [];
                    restData['requestNote'] = DELIVERY_ORDER[0].code;
                    setValues(restData);
                    console.log(">>> restData: ", restData);
                    const restInfo = await addressServices.findByUserId(restData.idUser);
                    if (restInfo.data.type === RESPONSE_TYPE.SUCCESS) {
                        const restInfoData = restInfo.data.data;
                        const _addressDefault = restInfoData.find(item => item.isDefault);
                        setAddressCustomer(_addressDefault || restInfoData[0]);
                        setCustomerSelected(_addressDefault || restInfoData[0]);
                    }
                }
            } catch (error) {
                console.log(">>>> ERROR: ", error);
                goBack();
            }
        }
        fetchDetailOrder();
    }, [orderId]);

    useEffect(() => {
        const fetchFeeShip = async () => {
            if (addressCustomer && !CommonUtil.isEmpty(productDebounce) && deliveryType == DELIVERY_TYPE.GHN) {
                const formData = buildFormSaveGHN();
                const previewCheckout = await shipGhnServices.previewCheckout(formData);
                if (previewCheckout.data.code == 200) {
                    setfeeShip(previewCheckout.data.data);
                }
            } else {
                setfeeShip(null);
            }
        };
        fetchFeeShip();
    },[addressCustomer, isRefreshFeeShip]);

    const renderTitle = () => {
        return (
            <>
                <div className="customer-header">
                { customerSelected && <i className='bx bxs-user-circle'></i> }
                    <h3>Thông tin khách hàng</h3>
                </div>
                { customerSelected &&
                    <div className="customer-info">
                        <span className="text-primary name">{customerSelected.fullName}</span>
                        { customerSelected.fullName && customerSelected.phoneNumber && <span style={{ margin: '0 4px' }}>-</span> }
                        <span className="pgone">{customerSelected.phoneNumber}</span>
                    </div>
                }
            </>
        );
    };

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    }

    const isValid = () => {
        if (hasReturn) {
            if (CommonUtil.isEmpty(productDebounce)) {
                Toast.show(RESPONSE_TYPE.WARNING, null, "Bạn chưa chọn sản phẩm trả");
                return false;
            }
        }
        return true;
    }

    const renderMesssage = () => {
        let message = [];
        if (!isPaid || !isReceived) {
            message.push("Đơn hàng");
            !isPaid && message.push("chưa được hoàn tiền");
            !isPaid && !isReceived && message.push("và");
            !isReceived && message.push("chưa nhận hàng trả lại");
            message.push(", bạn có muốn tiếp tục đổi hàng không ?");
        } else {
            message.push("Bạn có chắc chắn muốn tạo đơn đổi trả này không ?");
        }
        return message.join(" ");
    }



    const buildFormReturn = () => {
        const formData = {
            ordersId: orderId,
            reason: _.get(values, 'reason'),
            status: isReceived ? RETURN_ORDER_STATUS.ITEM_RECEIVED : RETURN_ORDER_STATUS.NOT_YET_RECEIVED,
            isExchangeable: hasReturn ? RETURN_TYPE.EXCHANGE : RETURN_TYPE.RETURN,
            detailReturnFormList: lstOrderDetail.map(item => ({
                orderDetailId: item.id,
                quantity: item.quantityReturn,
                price: item.unitPrice
            }))
        };
        if (calCustomerMustPay > 0) {
            formData['statusRefund'] = STATUS_REFUND.PAID;
            formData['totalRefund'] = 0;
        } else {
            formData['statusRefund'] = isPaid ? STATUS_REFUND.PAID : STATUS_REFUND.UNPAID;
            formData['totalRefund'] = Math.abs(calCustomerMustPay);
        }
        return formData;
    }

    const onSubmitOrderReturn = async (data) => {
        // event.preventDefault();
        if (!isValid()) return;
        if (hasReturn) {
            let message = renderMesssage();
            await CommonUtil.confirmSaveOrUpdate(async () => {
                try {
                    const response = await orderReturnServices.saveOrUpdate(buildFormReturn());
                    if (response.data.type === RESPONSE_TYPE.SUCCESS) {
                        const formSave = {
                            deliveryType: deliveryType,
                            idAddress: addressCustomer.id,
                            userId: customerSelected?.user?.id,
                            totalPrice: calCustomerMustPay > 0 ? calCustomerMustPay : calTotalPriceProductBuy,
                            paymentType: PAYMENT_TYPE.COD,
                            // calCustomerMustPay = tổng tiền sản phẩm đổi + phí giao hàng - tổng tiền trả hàng
                            paymentStatus: calCustomerMustPay > 0 ? PAYMENT_STATUS.UNPAID : PAYMENT_STATUS.PAID,
                            detailOrdersList: productDebounce.map(item => {
                                const _price = item.salePrice ? item.salePrice : item.finalPrice;
                                const total = _price * item.quantityBuy;
                                return {
                                    productDetailId: item.id,
                                    quantity: item.quantityBuy,
                                    totalPrice: total * 1,
                                    unitPrice: _price * 1
                                }
                            })
                        };
                        if (deliveryType == DELIVERY_TYPE.GHN) {
                            try {
                                const restSaveGHN = await shipGhnServices.saveOrder(buildFormSaveGHN());
                                console.log(">>> restSaveGHN: ", restSaveGHN);
                                if (restSaveGHN.data.code == 200) {
                                    const restData = restSaveGHN.data.data;
                                    formSave['codeLading'] = restData['order_code'];
                                    if (deliveryType == DELIVERY_TYPE.GHN) {
                                        formSave['deliveryCost'] = restData['total_fee'];
                                    }
                                    formSave['estimatedDeliveryTime'] = restData['expected_delivery_time'];
                                }
                            } catch (error) {
                                console.log(">>>> error: ", error);
                            }
                        }
                        const restSaveOrder = await orderServices.saveOrUpdate(formSave);
                        if (restSaveOrder.data.type == RESPONSE_TYPE.SUCCESS) {
                            history.push(`/admin/orders/view/${restSaveOrder.data.data.id}`);
                        }
                    }
                } catch (error) {
                    console.log(">>>>> save return error: ", error);
                }
            }, null, message);
        } else {
            await CommonUtil.confirmSaveOrUpdate(async () => {
                const rest = await orderReturnServices.saveOrUpdate(buildFormReturn());
                if (rest.data.type === RESPONSE_TYPE.SUCCESS) {
                    history.push(`/admin/order-returns/${rest.data.data.id}`);
                }
            }, null, "Bạn có chắc chắn muốn trả lại đơn hàng này không ?");
        }
    }

    const renderSTT = (rowData, x) => {
        return <>{x.rowIndex * 1 + 1}</>
    }
    const renderImg = (rowData) => {
        return <Image src={rowData.image} alt={`${rowData.productName}`} width="50" preview />
    }
    const editorColorName = (rowData) => {
        return (<>{rowData.colorName}</>)
    }
    const editorSizeName = (rowData) => {
        return (<>{rowData.sizeName}</>)
    }
    const editorQuantity = (rowData, extValue) => {
        const maxQuantity = _.get(values, `lstOrderDetail[${extValue.rowIndex}].quantity`) || 1;
        const initialValue = maxQuantity > 0 ? 1 : 0;
        return (
            <div className="flex align-items-center">
                <BaseNumberControl
                    min={0}
                    showButtons
                    mode="decimal"
                    property={`lstOrderDetail[${extValue.rowIndex}].quantityReturn`}
                    max={maxQuantity}
                    errors={errors}
                    touched={touched}
                    initialValue={initialValue}
                    callbackValueChange={async (fieldName, event, value) => {
                        const quantity = value > maxQuantity ? maxQuantity : value;
                        await setFieldValue(fieldName, quantity);
                    }}
                />
                <span style={{ marginLeft: '8px', fontWeight: 500, flex: 2 }}>/ {maxQuantity}</span>
            </div>
        );
    }

    const renderFinalPrice = (rowData) => {
        const _price = rowData.unitPrice > 0 ? rowData.unitPrice : 0;
        return <>{CommonUtil.formatMoney(_price)}</>
    }

    const renderTotalPriceItems = (rowData, extValue) => {
        const _quantityReturn = _.get(values, `lstOrderDetail[${extValue.rowIndex}].quantityReturn`);
        const _price = rowData.unitPrice;
        const _total = _price * _quantityReturn;
        return (<span>{CommonUtil.formatMoney(_total)}</span>);
    }

    const editorQuantityBuy = (rowData, extValue) => {
        const _productItem = _.get(values, `lstProductDetail[${extValue.rowIndex}]`);
        const initialValue =  _productItem.quantity > 0 ? _.get(values, `lstProductDetail[${extValue.rowIndex}].quantityBuy`) || 1 : 0;
        return (
            <BaseNumberControl
                min={initialValue > 0 ? 1 : 0}
                showButtons
                mode="decimal"
                property={`lstProductDetail[${extValue.rowIndex}].quantityBuy`}
                fieldPath={`lstProductDetail[${extValue.rowIndex}].quantityBuy`}
                max={_productItem.quantity}
                initialValue={initialValue}
                disabled={initialValue <= 0}
                errors={errors}
                touched={touched}
                callbackValueChange={async (fieldName, event, value) => {
                    await setFieldValue(`lstProductDetail[${extValue.rowIndex}].quantityBuy`, value);
                }}
            />
        );
    }

    const renderFinalPriceBuy = (rowData) => {
        const _price = rowData.salePrice > 0 ? rowData.salePrice : rowData.finalPrice;
        return <>{CommonUtil.formatMoney(_price)}</>
    }
    const renderTotalPriceItemsBuy = (rowData, extValue) => {
        const _quantityBuy = _.get(values, `lstProductDetail[${extValue.rowIndex}].quantityBuy`);
        const _price = rowData.salePrice > 0 ? rowData.salePrice : rowData.finalPrice;
        const _total = _price * _quantityBuy;
        return (<span>{CommonUtil.formatMoney(_total)}</span>);
    }

    const renderNameOrPhone = useMemo(() => {
        if (!addressCustomer) return;
        const _temp = [];
        addressCustomer.fullName && _temp.push(addressCustomer.fullName);
        addressCustomer.phoneNumber && _temp.push(addressCustomer.phoneNumber);
        return _temp.join(' - ');
    }, [addressCustomer]);

    const calTotalQuantity = useMemo(() => {
        return lstOrderDetail.reduce((cur, item) => {
            const _quantityReturn = item.quantityReturn || 0;
            return cur += _quantityReturn;
        }, 0);
    },[lstOrderDetail]);

    const calTotalPriceProduct = useMemo(() => {
        return lstOrderDetail.reduce((cur, item) => {
            const _unitPrice = item.unitPrice || 0;
            const _quantityReturn = item.quantityReturn || 0;
            return cur += _unitPrice * _quantityReturn;
        }, 0);
    },[lstOrderDetail]);

    // Tổng số lượng mua
    const calQuantityProduct = useMemo(() => {
        return productDebounce.reduce((cur, item) => cur += item.quantityBuy, 0);
    }, [productDebounce]);

    // Tổng tiền sản phẩm mua
    const calTotalPriceProductBuy = useMemo(() => {
        return productDebounce.reduce((cur, item) => {
            const priceItem = item.salePrice > 0 ? item.salePrice : item.finalPrice;
            const quantity = item.quantityBuy || 0;
            return cur += priceItem * quantity;
        }, 0);
    }, [productDebounce]);

    // Phí ship
    const calFeeShip = useMemo(() => {
        return deliveryType == DELIVERY_TYPE.GHN ? feeShip?.total_fee || 0 : 0;
    }, [feeShip, deliveryType]);

    // Số tiền khách phải trả
    const calCustomerMustPay = useMemo(() => {
        const amountMustPaid = calTotalPriceProductBuy - calTotalPriceProduct;
        return amountMustPaid;
    }, [calTotalPriceProductBuy, calTotalPriceProduct]);

    const calMassProduct = useMemo(() => {
        return productDebounce.reduce((cur, item) => {
            const mass = item.mass || 0;
            const quantity = item.quantityBuy || 0;
            return cur += mass * quantity;
        }, 0);
    }, [productDebounce]);

    const onSelected = async (listSelected) => {
        if (!CommonUtil.isEmpty(listSelected)) {
            const lstProductDetail = _.get(values, 'lstProductDetail');
            const mapItems = {};
            lstProductDetail?.forEach((item) => {
                mapItems[item.id] = item;
            });
            listSelected.forEach((item) => {
                if (!mapItems[item.id]) {
                    lstProductDetail.push(item);
                }
            });
            await setFieldValue('lstProductDetail', _.cloneDeep(lstProductDetail ?? []));
        }
        setShowSelectProductDetail(false);
    }

    const onShowSelectDetail = (item) => {
        setProductId(item.id);
        setShowSelectProductDetail(true);
    }

    const onAddProduct = () => {
        setShowAddProduct(true);
    }

    const renderDropdownProduct = (
        <ul className="product-dropdown">
            {datasourceProduct.map(item => {
                return (
                    <li className="product-item" key={item.id} onClick={() => onShowSelectDetail(item)}>
                        <Image src={item.image} alt={`${item.name}`} width="50" preview />
                        <div className="product-content">
                            <div className="share-info">
                                <p>{item.name}</p>
                                <p>{item.code}</p>
                            </div>
                            <div className="inventory-info">
                                <p>Tồn kho:</p>
                                <p style={{ fontWeight: 500 }}>{item.quantity}</p>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    );

    const onRemoveItem = async (rowData) => {
        const lstProductDetail = _.get(values, `lstProductDetail`);
        const index = lstProductDetail?.findIndex(item => item.id == rowData.id);
        if (index != -1) {
            lstProductDetail.splice(index, 1);
            await setFieldValue('lstProductDetail', _.cloneDeep(lstProductDetail));
        }
    }

    const renderActionDelete = (rowData) => {
        return (<i className="pi pi-times" onClick={() => onRemoveItem(rowData)}></i>)
    }

    const onRemoveReturnItem = async (rowData) => {
        const lstOrderDetail = _.get(values, `lstOrderDetail`);
        const index = lstOrderDetail?.findIndex(item => item.id == rowData.id);
        if (index != -1) {
            lstOrderDetail.splice(index, 1);
            await setFieldValue('lstOrderDetail', _.cloneDeep(lstOrderDetail));
        }
    }

    const renderActionReturnDelete = (rowData) => {
        return (<i className="pi pi-times" onClick={() => onRemoveReturnItem(rowData)}></i>)
    }

    const renderProductTitle = () => {
        return (
            <div className="page-info-title w-100">
                <i className="bx bx-cube-alt"></i>
                <span>Thông tin sản phẩm đổi</span>
            </div>
        );
    }

    return (
        <>
            <main className="order-form-wrap order-return">
                <div className="flex">
                    <div className="order-return-heading">
                        <Link to="/admin/order-returns">
                            <i className='bx bx-chevron-left'></i>
                            <span>Đơn trả hàng</span>
                        </Link>
                    </div>
                </div>
                <section>
                    <div className="head-action">
                        {
                            hasReturn ?
                                <Button
                                    type="submit"
                                    label="Tạo đơn và duyệt"
                                    className="p-button-success"
                                    form="return-order-form"
                                /> :
                                <Button
                                    type="submit"
                                    label="Trả hàng"
                                    className="p-button-danger"
                                    form="return-order-form"
                                />
                        }
                    </div>
                </section>
                <section className='content'>
                    <form id="return-order-form" onSubmit={(event) => CommonUtil.focusOnSubmitError(event, handleSubmit)}>
                        <div className="flex justify-content-between">
                            <Card className="customer-order-info" title={renderTitle}>
                                {
                                    !customerSelected ?
                                        <>
                                            <div className="p-empty">
                                                <img src={require('../../../../../assets/img/empty-list.png')} alt="empty-customer" />
                                                <p>Không có thông tin khách hàng</p>
                                            </div>
                                        </> :
                                        <div className="box-info">
                                            <div className="delivery-address">
                                                <div className="title">
                                                    <p>Địa chỉ giao hàng</p>
                                                    <span className="text-primary">Thay đổi</span>
                                                </div>
                                                { addressCustomer &&
                                                    <div className="body-content">
                                                        <p className="name-phone">{renderNameOrPhone}</p>
                                                        <p className="address">{addressCustomer.addressFull}</p>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                }
                            </Card>
                            <Card title="Thông tin đơn hàng">
                                <div className='staff-info px-4 mb-3'>
                                    <div className="row">
                                        <div className="col-12">
                                            <div>
                                                <span>Mã đơn hàng: </span>
                                                <span style={{ marginLeft: '6px', color: "blue" }}>{ _.get(values, "orderCode") }</span>
                                            </div>
                                            <div>
                                                <span>Bán bởi: </span>
                                                <span style={{ marginLeft: '6px', color: "blue" }}>{ props.accountInfo.fullName || "Gene Russell" }</span>
                                            </div>
                                            <div>
                                                <span>Nguồn: </span>
                                                <span style={{ marginLeft: '6px', color: "blue" }}>Tại cửa hàng</span>
                                            </div>
                                            <div>
                                                <span>Ngày bán: </span>
                                                <span style={{ marginLeft: '6px', color: "blue" }}>{ CommonUtil.renderDateToData(_.get(values, 'createDate'), "DD-MM-YYYY HH:mm:ss") }</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="p-card page-info flex justify-content-between align-items-center">
                            <div className="page-info-title">
                                <i className="bx bx-refresh"></i>
                                <span>Đổi hàng</span>
                            </div>
                            <div className="zunexz-switch">
                                <InputSwitch inputId="has-return" checked={hasReturn} onChange={(event) => setHasReturn(event.value)} />
                                <label className="label-title" htmlFor="has-return">Đơn hàng có đổi hàng</label>
                            </div>
                        </div>
                        <div className="p-card page-info flex align-items-center" style={{ flexDirection: "column" }}>
                            <div className="page-info-title w-100">
                                <i className="bx bx-cube-alt"></i>
                                <span>Thông tin sản phẩm trả</span>
                            </div>
                            <div className="page-info-body" style={{ display: 'inline-block' }}>
                                <div className="list-line-item">
                                    <DataTable className="data-table-product" value={_.get(values, "lstOrderDetail") ?? []} responsiveLayout="scroll" stripedRows size="small" scrollable>
                                        <Column header="STT" body={renderSTT} style={{ maxWidth: '70px' }}  alignHeader="center" align="center"></Column>
                                        <Column header="Hình ảnh" alignHeader="center" align="center" body={renderImg} style={{ maxWidth: '70px' }}></Column>
                                        <Column field="productName" header="Tên sản phẩm"></Column>
                                        <Column field="colorName" header="Màu sắc" alignHeader="center" align="center" body={editorColorName} style={{ maxWidth: '100px' }}></Column>
                                        <Column field="sizeName" header="Kích cỡ" alignHeader="center" align="center" body={editorSizeName} style={{ maxWidth: '100px' }}></Column>
                                        <Column header="Số lượng trả" alignHeader="center" align="center" body={editorQuantity} style={{ maxWidth: '150px' }}></Column>
                                        <Column header="Giá" alignHeader="center" align="center" body={renderFinalPrice} style={{ maxWidth: '100px' }}></Column>
                                        <Column header="Tổng" body={renderTotalPriceItems} alignHeader="center" align="center" style={{ maxWidth: '100px' }}></Column>
                                        <Column  body={renderActionReturnDelete} alignHeader="center" align="center" style={{ maxWidth: '40px' }}></Column>
                                    </DataTable>
                                </div>
                                <div className="row">
                                    <div className="col-3">
                                        <BaseDropdownControl
                                            property="reason"
                                            labelKey="Lý do trả hàng"
                                            options={REASON_OPTION}
                                            optionValue="id"
                                            optionLabel="name"
                                            required={true}
                                            errors={errors}
                                            touched={touched}
                                            initialValue={_.get(values, 'reason')}
                                            callbackValueChange={onChange}
                                        />
                                    </div>
                                    <div className="col-9">
                                        <div className="list-info-money">
                                        <div className="item-info-money">
                                            <div className="label">Số lượng</div>
                                            <div className="value">{ calTotalQuantity }</div>
                                        </div>
                                        <div className="item-info-money">
                                            <div className="label"><b>Tổng tiền trả khách</b></div>
                                            <div className="value"><b>{ CommonUtil.formatMoney(calTotalPriceProduct) }</b></div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        { hasReturn &&
                            <>
                                <div className="product-info-container">
                                    <Card title={renderProductTitle}>
                                        <TextSelectControl
                                            labelKey="Thông tin sản phẩm"
                                            showLabel={false}
                                            labelAdd="Thêm mới sản phẩm"
                                            property="idProductDetails"
                                            initialValue={_.get(values, "idProductDetails")}
                                            placeholder="Tìm theo tên , mã sản phẩm ..."
                                            callbackValueChange={onChange}
                                            onAdd={onAddProduct}
                                            temlateBody={renderDropdownProduct}
                                        />
                                        { hasProduct ?
                                            <DataTable className="data-table-product" value={_.get(values, "lstProductDetail") ?? []} responsiveLayout="scroll" stripedRows size="small" scrollable>
                                                <Column header="STT" body={renderSTT} style={{ maxWidth: '70px' }}  alignHeader="center" align="center"></Column>
                                                <Column header="Hình ảnh" alignHeader="center" align="center" body={renderImg} style={{ maxWidth: '70px' }}></Column>
                                                <Column field="productName" header="Tên sản phẩm"></Column>
                                                <Column field="colorName" header="Màu sắc" alignHeader="center" align="center" body={editorColorName} style={{ maxWidth: '100px' }}></Column>
                                                <Column field="sizeName" header="Kích cỡ" alignHeader="center" align="center" body={editorSizeName} style={{ maxWidth: '100px' }}></Column>
                                                <Column header="Số lượng" alignHeader="center" align="center" body={editorQuantityBuy} style={{ maxWidth: '120px' }}></Column>
                                                <Column header="Giá" alignHeader="center" align="center" body={renderFinalPriceBuy} style={{ maxWidth: '100px' }}></Column>
                                                <Column header="Tổng" body={renderTotalPriceItemsBuy} alignHeader="center" align="center" style={{ maxWidth: '100px' }}></Column>
                                                <Column  body={renderActionDelete} alignHeader="center" align="center" style={{ maxWidth: '40px' }}></Column>
                                            </DataTable> :
                                            <div className="p-empty">
                                                <img src={require('../../../../../assets/img/empty-list.png')} alt="product-empty" />
                                                <p>Chưa có thông tin sản phẩm</p>
                                                <Button
                                                    className="p-button-text"
                                                    label="Thêm sản phẩm"
                                                />
                                            </div>
                                        }
                                        <div className="data-table-footer">
                                            <span className="service">
                                            </span>
                                            <span className="vorcher">
                                                <i className='bx bxs-gift'></i>
                                                Áp dụng chưa trình khuyến mãi
                                            </span>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <BaseTextarea
                                                    labelKey="Ghi chú đơn hàng"
                                                    property="note"
                                                    initialValue={_.get(values, "note")}
                                                    placeholder="Vd: Hàng tặng gói riêng"
                                                    callbackValueChange={onChange}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <ul className="price-list">
                                                    <li className="price-item">
                                                        <span>Tổng tiền ({calQuantityProduct} sản phẩm)</span>
                                                        <span className="price">{CommonUtil.formatMoney(calTotalPriceProductBuy)}</span>
                                                    </li>
                                                    <li className="price-item">
                                                        <span>Phí giao hàng</span>
                                                        <span className="price">{CommonUtil.formatMoney(calFeeShip)}</span>
                                                    </li>
                                                    <li className="price-item">
                                                        <span>Mã giảm giá</span>
                                                        <span className="price">0</span>
                                                    </li>
                                                    <span className="line-thogth"></span>
                                                    <li className="price-item">
                                                        <span>Tổng tiền mua hàng</span>
                                                        <span className="price">{CommonUtil.formatMoney(calTotalPriceProductBuy)}</span>
                                                    </li>
                                                    <li className="price-item">
                                                        <span>Tổng tiền hàng trả</span>
                                                        <span className="price">{CommonUtil.formatMoney(calTotalPriceProduct)}</span>
                                                    </li>
                                                    <span className="line-thogth"></span>
                                                    <li className="price-item">
                                                        { calCustomerMustPay > 0 ?
                                                            <span style={{ fontWeight: 600 }}>Khách cần trả</span> : <span style={{ fontWeight: 600 }}>Cần trả khách</span> }
                                                        <span className="price">{CommonUtil.formatMoney(Math.abs(calCustomerMustPay))}</span>
                                                    </li>
                                                    <span className="line-thogth"></span>
                                                    {/* <li className="price-item">
                                                        <span>Xác nhận thanh toán</span>
                                                        <div className="confirm-button">
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsPaidBuy(true)}
                                                                className={classNames("btn", { "active": isPaidBuy })}
                                                                disabled={!hasProduct || !customerSelected}
                                                            >
                                                                Đã thanh toán
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsPaidBuy(false)}
                                                                className={classNames("btn", { "active": !isPaidBuy })}
                                                                disabled={!hasProduct || !customerSelected}
                                                            >
                                                                Thanh toán sau
                                                            </button>
                                                        </div>
                                                    </li> */}
                                                </ul>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                                <div className="packing-delivery-container">
                                    <Card title="Đóng gói và giao hàng">
                                        <div className="row">
                                            <div className="control-button">
                                                <span className={classNames("btn", { 'active': deliveryType == DELIVERY_TYPE.GHN })} onClick={() => setDeliveryType(DELIVERY_TYPE.GHN)}>
                                                    <i className="fa-solid fa-truck-fast"></i>
                                                    Vận chuyển qua GHN
                                                </span>
                                                <span className={classNames("btn", { 'active': deliveryType == DELIVERY_TYPE.PICK_UP_SHOP })} onClick={() => setDeliveryType(DELIVERY_TYPE.PICK_UP_SHOP)}>
                                                    <i className="fa-solid fa-store"></i>
                                                    Nhận tại cửa hàng
                                                </span>
                                            </div>
                                        </div>
                                        { addressCustomer && deliveryType == DELIVERY_TYPE.GHN && <div className="row address-transport">
                                            <div className="col-4">
                                                <div className="wrap-delivery-address">
                                                    <div className="address-info">
                                                        <p>
                                                            Địa chỉ giao hàng
                                                            <span>Thay đổi</span>
                                                        </p>
                                                        <div className="delivery-address">
                                                            { addressCustomer &&
                                                                <div className="body-content">
                                                                    <p className="name-phone">{renderNameOrPhone}</p>
                                                                    <p className="address">{addressCustomer.addressFull}</p>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="invoice-info">
                                                        <p>Thông tin giao hàng</p>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <BaseNumberControl
                                                                    labelKey="Tiền thu hộ (CO)"
                                                                    property="totalPrice"
                                                                    disabled={true}
                                                                    initialValue={calTotalPriceProductBuy}
                                                                />
                                                            </div>
                                                            <div className="col-12">
                                                                <BaseNumberControl
                                                                    labelKey="Khối lượng (g)"
                                                                    property="totalPrice"
                                                                    disabled={true}
                                                                    initialValue={calMassProduct}
                                                                />
                                                            </div>
                                                            <div className="col-12">
                                                                <BaseDropdownControl
                                                                    labelKey="Yêu cầu giao hàng"
                                                                    property="requestNote"
                                                                    initialValue={_.get(values, "requestNote")}
                                                                    optionValue="code"
                                                                    optionLabel="label"
                                                                    options={DELIVERY_ORDER}
                                                                    callbackValueChange={onChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-8">
                                            </div>
                                        </div> }
                                    </Card>
                                </div>
                            </>
                        }

                        <div className="p-card page-info flex justify-content-between align-items-center">
                            <div className="page-info-title">
                                <i className='bx bxs-credit-card-alt'></i>
                                <span>Hoàn tiền</span>
                            </div>
                            <div className="zunexz-checkbox">
                                { calCustomerMustPay < 0 &&
                                    <>
                                        <Checkbox inputId="has-paid" checked={isPaid} onChange={e => setIsPaid(e.checked)} />
                                        <label className="label-title" htmlFor="has-paid">Đã hoàn tiền</label>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="p-card page-info flex justify-content-between align-items-center">
                            <div className="page-info-title">
                                <i className="fa-solid fa-truck-fast" style={{ fontSize: "18px" }}></i>
                                <span>Nhận hàng</span>
                            </div>
                            <div className="zunexz-checkbox">
                                <Checkbox inputId="has-received" checked={isReceived} onChange={e => setIsReceived(e.checked)} />
                                <label className="label-title" htmlFor="has-received">Đã nhận hàng trả lại</label>
                            </div>
                        </div>
                    </form>
                </section>
            </main>
            {
                showSelectProductDetail &&
                    <DialogProductDetail
                        productId={productId}
                        onHide={() => setShowSelectProductDetail(false)}
                        onSelected={onSelected}
                    />
            }
            {
                showAddProduct &&
                <ProductForm onHide={() => setShowAddProduct(false)} />
            }
        </>
    )
}

const mapStateToProps = ({authentication }: IRootState) => ({
    accountInfo: authentication.accountInfo,
});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
    // @ts-ignore
)(OrderReturnForm);
