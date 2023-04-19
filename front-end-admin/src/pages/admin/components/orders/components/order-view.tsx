
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import TextSelectControl from 'src/app/components/BaseTextSelect';
import { useFormik } from 'formik';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { DELIVERY_TYPE, PAYMENT_METHOD, PAYMENT_STATUS, PAYMENT_TYPE, RESPONSE_TYPE, STATUS_ORDER } from 'src/enum';
import { Card } from 'primereact/card';
import { CommonUtil } from 'src/utils/common-util';
import addressServices from 'src/services/address.services';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';
import BaseNumberControl from 'src/app/components/BaseNumberControl';
import useDebounce from 'src/utils/useDebounce';
import orderServices from 'src/services/order.services';
import { useParams, useHistory } from "react-router-dom";
import { Steps } from 'primereact/steps';
import { classNames } from 'primereact/utils';
import { STATUS_ORDERS } from 'src/@types/constants';
import DialogConfirmPaid from './DialogConfirmPaid';
type IOrderEditFormProps = StateProps & DispatchProps & {
}

const OrderEditForm = (props: IOrderEditFormProps) => {
    const mapStep = { 0: STATUS_ORDER.ORDER, 1: STATUS_ORDER.APPROVE_ORDER, 2: STATUS_ORDER.PACK_ORDER, 3: STATUS_ORDER.DELIVERING, 4: STATUS_ORDER.COMPLETE_ORDER, 5: STATUS_ORDER.CANCEL_ORDER }
    const { orderId } = useParams();
    const history = useHistory();
    const [customerSelected, setCustomerSelected] = useState(null);
    const [addressCustomer, setAddressCustomer] = useState(null);
    const [showConfirmPaid, setShowConfirmPaid] = useState(false);
    const {
        values,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            isUser: '',
            orderCode: '',
            lstOrderDetail: [{}]
        },
        onSubmit: async () => {

        }
    });

    const orderDebounce = useDebounce(_.get(values, 'lstOrderDetail'), 100);
    const memoStepItem = useMemo(() => {
        const stepItem = [
            {
                label: "Đặt hàng",
                icon: 'fa fa-check',
                completeDate: null,
                template: (item, option) => {
                    const showDate = _.get(values, "status") >= STATUS_ORDER.ORDER;
                    return (
                        <a className={option.className} target={item.target} onClick={option.onClick}>
                            <i className={classNames(option.iconClassName)}></i>
                            <span className={option.labelClassName}>{item.label}</span>
                            { !CommonUtil.isNullOrEmpty(item.completeDate) && showDate &&
                                <span>{CommonUtil.renderDateToData(item.completeDate, "DD-MM-YYYY HH:mm:ss")}</span>
                            }
                        </a>
                    );
                }
            },
            {
                label: "Duyệt",
                icon: "fa fa-check",
                completeDate: null,
                template: (item, option) => {
                    const showDate = _.get(values, "status") >= STATUS_ORDER.APPROVE_ORDER;
                    return (
                        <a className={option.className} target={item.target} onClick={option.onClick}>
                            <i className={classNames(option.iconClassName)}></i>
                            <span className={option.labelClassName}>{item.label}</span>
                            { !CommonUtil.isNullOrEmpty(item.completeDate) && showDate &&
                                <span>{CommonUtil.renderDateToData(item.completeDate, "DD-MM-YYYY HH:mm:ss")}</span>
                            }
                        </a>
                    );
                }
            },
            {
                label: "Đóng gói",
                icon: "fa fa-check",
                completeDate: null,
                template: (item, option) => {
                    const showDate = _.get(values, "status") >= STATUS_ORDER.PACK_ORDER;
                    return (
                        <a className={option.className} target={item.target} onClick={option.onClick}>
                            <i className={classNames(option.iconClassName)}></i>
                            <span className={option.labelClassName}>{item.label}</span>
                            { !CommonUtil.isNullOrEmpty(item.completeDate) && showDate &&
                                <span>{CommonUtil.renderDateToData(item.completeDate, "DD-MM-YYYY HH:mm:ss")}</span>
                            }
                        </a>
                    );
                }
            },
            {
                label: "Xuất kho",
                icon: "fa fa-check",
                completeDate: null,
                template: (item, option) => {
                    const showDate = _.get(values, "status") >= STATUS_ORDER.DELIVERING;
                    return (
                        <a className={option.className} target={item.target} onClick={option.onClick}>
                            <i className={classNames(option.iconClassName)}></i>
                            <span className={option.labelClassName}>{item.label}</span>
                            { !CommonUtil.isNullOrEmpty(item.completeDate) && showDate &&
                                <span>{CommonUtil.renderDateToData(item.completeDate, "DD-MM-YYYY HH:mm:ss")}</span>
                            }
                        </a>
                    );
                }
            },
            {
                label: "Hoàn thành",
                icon: "fa fa-check",
                completeDate: null,
                template: (item, option) => {
                    const showDate = _.get(values, "status") == STATUS_ORDER.COMPLETE_ORDER;
                    return (
                        <a className={option.className} target={item.target} onClick={option.onClick}>
                            <i className={classNames(option.iconClassName)}></i>
                            <span className={option.labelClassName}>{item.label}</span>
                            { !CommonUtil.isNullOrEmpty(item.completeDate) && showDate &&
                                <span>{CommonUtil.renderDateToData(item.completeDate, "DD-MM-YYYY HH:mm:ss")}</span>
                            }
                        </a>
                    );
                }
            },
            {
                label: "Hủy",
                icon: "fa fa-times",
                completeDate: null,
                template: (item, option) => {
                    const showDate = _.get(values, "status") == STATUS_ORDER.CANCEL_ORDER;
                    return (
                        <>
                            { showDate &&
                                <a className={option.className} target={item.target} onClick={option.onClick}>
                                    <i className={classNames(option.iconClassName)}></i>
                                    <span className={option.labelClassName}>{item.label}</span>
                                    { !CommonUtil.isNullOrEmpty(item.completeDate) && showDate &&
                                        <span>{CommonUtil.renderDateToData(item.completeDate, "DD-MM-YYYY HH:mm:ss")}</span>
                                    }
                                </a>
                            }
                        </>
                    );
                }
            },
        ];
        stepItem[0].completeDate = _.get(values, "createDate");
        stepItem[1].completeDate = _.get(values, "createDateApprove");
        stepItem[2].completeDate = _.get(values, "createDatePack");
        stepItem[3].completeDate = _.get(values, "createDateDelivering");
        stepItem[4].completeDate = _.get(values, "createDateComplete");
        stepItem[5].completeDate = _.get(values, "createDateCancel");
        return stepItem;
    }, [values]);
    const hasProduct = useMemo(() => {
        const lst = _.get(values, 'lstOrderDetail');
        return !CommonUtil.isEmpty(lst);
    }, [orderDebounce]);

    // Tổng số lượng mua
    const calQuantityProduct = useMemo(() => {
        return orderDebounce.reduce((cur, item) => cur += item.quantity, 0);
    }, [orderDebounce]);

    // Tổng tiền sản phẩm
    const calTotalPriceProduct = useMemo(() => {
        return _.get(values, 'totalPrice') || 0;
    }, [_.get(values, 'totalPrice')]);

    // Phí ship
    const calFeeShip = useMemo(() => {
        return _.get(values, 'deliveryCost') || 0;
    }, [_.get(values, 'deliveryCost')]);

    const calCustomerMustPay = useMemo(() => {
        return _.get(values, 'customerPay') || 0;
    }, [_.get(values, 'customerPay')]);

    const isCustomerPaid = useMemo(() => {
        return _.get(values, 'paymentStatus') || PAYMENT_STATUS.UNPAID;
    }, [_.get(values, 'paymentStatus')]);

    const calCustomerPaid = useMemo(() => {
        return isCustomerPaid == PAYMENT_STATUS.PAID ? calCustomerMustPay : 0;
    }, [values]);

    const calCustomerNeedToPay = useMemo(() => {
        return isCustomerPaid == PAYMENT_STATUS.UNPAID ? calCustomerMustPay : 0;
    }, [values]);

    const renderDelivery = useMemo(() => {
        const deliveryType = _.get(values, 'deliveryType') || PAYMENT_METHOD.PICK_UP_SHOP;
        return PAYMENT_METHOD.PICK_UP_SHOP == deliveryType ? "Nhận tại cửa hàng" : "Giao dịch qua GHN"
    }, [values]);

    const calEstimatedDeliveryTime = useMemo(() => {
        const estimatedDeliveryTime = _.get(values, 'estimatedDeliveryTime');
        return !CommonUtil.isNullOrEmpty(estimatedDeliveryTime) ? estimatedDeliveryTime : null;
    }, [values]);

    const activeIndex = useMemo(() => {
        const status = _.get(values, 'status');
        const index = CommonUtil.getKeyByValue(mapStep, status);
        return Number(index) || 0;
    } , [values]);

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
        const _productItem = _.get(values, `lstOrderDetail[${extValue.rowIndex}]`);
        const initialValue = _.get(values, `lstOrderDetail[${extValue.rowIndex}].quantity`) || 1;
        return (
            <BaseNumberControl
                min={1}
                showButtons
                mode="decimal"
                disabled
                property={`lstOrderDetail[${extValue.rowIndex}].quantity`}
                max={_productItem.quantity}
                initialValue={initialValue}
                callbackValueChange={onChange}
            />
        );
    }

    const renderFinalPrice = (rowData) => {
        const _price = rowData.unitPrice > 0 ? rowData.unitPrice : 0;
        return <>{CommonUtil.formatMoney(_price)}</>
    }

    const renderTotalPriceItems = (rowData, extValue) => {
        return (<span>{CommonUtil.formatMoney(rowData.totalPrice)}</span>);
    }

    const fetchDetailOrder = async () => {
        const rest = await orderServices.getOrderDetail(orderId);
        if (rest.data.type == RESPONSE_TYPE.SUCCESS && rest?.data?.data) {
            const restData = rest.data.data;
            const restInfo = await addressServices.findByUserId(restData.idUser)
            setValues(restData);
            if (restInfo.data.type === RESPONSE_TYPE.SUCCESS) {
                const restInfoData = restInfo.data.data;
                const _addressDefault = restInfoData.find(item => item.isDefault);
                setAddressCustomer(_addressDefault || restInfoData[0]);
                setCustomerSelected(_addressDefault || restInfoData[0]);
            }
        } else {
            history.push(`/admin/orders`);
        }
    };

    useEffect(() => {
        fetchDetailOrder();
    }, [orderId]);

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    }

    useEffect(() => {
        // console.log(">>> values: ", values);
    }, [values]);

    const renderNameOrPhone = useMemo(() => {
        if (!addressCustomer) return;
        const _temp = [];
        addressCustomer.fullName && _temp.push(addressCustomer.fullName);
        addressCustomer.phoneNumber && _temp.push(addressCustomer.phoneNumber);
        return _temp.join(' - ');
    }, [addressCustomer]);

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

    const onPaidOrder = async () => {
        CommonUtil.confirmSaveOrUpdate(async () => {
            const rest = await orderServices.changePaymentStatus(orderId);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                fetchDetailOrder();
            }
        }, null, "Bạn có chắc muốn xác nhận thanh toán đơn hàng này không ?");
    }

    const renderHeader = () => {
        return (
            <div className="card-title">
                <h4>
                    { isCustomerPaid == PAYMENT_STATUS.PAID ?
                        <>
                            <i className="fa-regular fa-circle-check"></i>
                            Đơn hàng đã được thanh toán
                        </> :
                        <>Đơn hàng đang chờ thanh toán</>
                    }
                </h4>
                {
                    !isCancelOrder && isUnpaid && isPickupAtStore &&
                    <div>
                        <Button
                            label="Thanh toán"
                            onClick={onPaidOrder}
                        />
                    </div>
                }
            </div>
        );
    }

    const renderHeaderDelivery = () => {
        return (
            <div className="card-title">
                <h4>
                    <i className="fa-solid fa-truck-fast"></i>
                    Đóng gói và giao hàng
                </h4>
                <div>
                    {
                        isShowDelivery &&
                        <Button
                            label="Hủy đóng gói"
                            className="p-button-danger"
                            onClick={() => conChangeStatusOrder(STATUS_ORDER.APPROVE_ORDER)}
                        />
                    }
                    {
                        isShowPacking &&
                        <Button
                            label="Đóng gói"
                            onClick={() => conChangeStatusOrder(STATUS_ORDER.PACK_ORDER)}
                        />
                    }
                    {
                        isAllowDelivering &&
                        <Button
                            label="Xuất kho"
                            className="p-button-success"
                            onClick={() => conChangeStatusOrder(STATUS_ORDER.DELIVERING)}
                        />
                    }
                    {
                        isShowDelivered &&
                        <Button
                            label="Đã giao hàng"
                            className="p-button-success"
                            onClick={() => conChangeStatusOrder(STATUS_ORDER.COMPLETE_ORDER)}
                        />
                    }
                </div>
            </div>
        );
    }

    const isCancelOrder = useMemo(() => {
        return _.get(values, "status") == STATUS_ORDER.CANCEL_ORDER;
    }, [values]);

    const isUnpaid = useMemo(() => {
        return _.get(values, "paymentStatus") == PAYMENT_STATUS.UNPAID;
    }, [values]);

    const isPickupAtStore = useMemo(() => {
        console.log(">>>> isPickupAtStore: ", _.get(values, "deliveryType") == DELIVERY_TYPE.PICK_UP_SHOP);
        return _.get(values, "deliveryType") == DELIVERY_TYPE.PICK_UP_SHOP;
    }, [values]);

    const isAllowDelivering = useMemo(() => {
        return _.get(values, "status") == STATUS_ORDER.PACK_ORDER;
    }, [values]);

    const isShowApproval = useMemo(() => {
        return _.get(values, "status") == STATUS_ORDER.ORDER;
    }, [values]);

    const isShowPacking = useMemo(() => {
        return _.get(values, "status") == STATUS_ORDER.APPROVE_ORDER;
    }, [values]);

    const isShowDelivery = useMemo(() => {
        return _.get(values, "status") == STATUS_ORDER.PACK_ORDER;
    }, [values]);

    const isShowComplete = useMemo(() => {
        return _.get(values, "status") == STATUS_ORDER.DELIVERING;
    }, [values]);

    const isShowCancelOrder = useMemo(() => {
        return isShowApproval || isShowDelivery || isShowPacking;
    }, [values]);

    const isShowDelivered = useMemo(() => {
        return _.get(values, "status") == STATUS_ORDER.DELIVERING;
    }, [values]);

    const onCancelOrder = async () => {
        if (!CommonUtil.isNullOrEmpty(orderId)) {
            CommonUtil.confirmDelete(async () => {
                const rest = await orderServices.cancelOrder(orderId);
                if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                    await fetchDetailOrder();
                }
            }, null, "Bạn có chắc muốn hủy đơn hàng này không ?");
        }
    }

    const conChangeStatusOrder = async (status) => {
        if (CommonUtil.isNullOrEmpty(status)) return;
        let message = null;
        if (STATUS_ORDER.APPROVE_ORDER == status) {
            if (_.get(values, "status") == STATUS_ORDER.PACK_ORDER) {
                message = "Bạn có chắc chắn muốn hủy đóng gói đơn hàng này không ?";
            } else {
                message = "Bạn có chắc chắn muốn duyệt đơn hàng này không ?";
            }
        } else if (STATUS_ORDER.PACK_ORDER == status) {
            message = "Bạn có chắc chắn muốn đóng gói đơn hàng này không ?";
        } else if (STATUS_ORDER.DELIVERING == status) {
            message = "Bạn có chắc chắn muốn xuất kho đơn hàng này không ?";
        } else if (STATUS_ORDER.COMPLETE_ORDER == status) {
            message = "Bạn có chắc chắn muốn hoàn thành đơn hàng này không ?";
        }

        const isExits = CommonUtil.getValueByKey(STATUS_ORDERS, status, 'id');
        if (CommonUtil.isNullOrEmpty(isExits)) return;

        if (!CommonUtil.isNullOrEmpty(orderId)) {
            CommonUtil.confirmSaveOrUpdate(async () => {
                const rest = await orderServices.changeStatusOrder(orderId, status);
                if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                    await fetchDetailOrder();
                }
            }, null, message);
        }
    }

    const setEditOrder = () => {
        if (!CommonUtil.isNullOrEmpty(orderId)) {
            history.push(`/admin/orders/edit/${orderId}`);
        }
    }

    return (
        <>
            <main className="order-form-wrap">
                <div className="order-form-heading">
                    <h4>Chi tiết đơn hàng {_.get(values, 'orderCode')}</h4>
                    <div className="order-timeline">
                        <Steps model={memoStepItem} activeIndex={activeIndex} />
                    </div>
                </div>
                <section>
                    <div className="head-action">
                        {
                            isShowCancelOrder &&
                            <Button
                                label="Hủy đơn hàng"
                                className="p-button-danger"
                                onClick={onCancelOrder}
                            />
                        }
                        {
                            isShowCancelOrder &&
                            <Button
                                label="Sửa đơn hàng"
                                className="p-button-info"
                                onClick={setEditOrder}
                            />
                        }
                        {
                            isShowApproval &&
                            <Button
                                label="Duyệt đơn hàng"
                                className="p-button-danger"
                                onClick={() => conChangeStatusOrder(STATUS_ORDER.APPROVE_ORDER)}
                            />
                        }
                        {
                            isAllowDelivering &&
                            <Button
                                label="Xuất kho"
                                className="p-button-success"
                                onClick={() => conChangeStatusOrder(STATUS_ORDER.DELIVERING)}
                            />
                        }
                    </div>
                </section>
                <section className='content'>
                    <div className="flex justify-content-between">
                        <div id="customer-order-info" className="customer-order-info">
                            <Card title={renderTitle}>
                                {
                                    !customerSelected ?
                                        <>
                                            <TextSelectControl
                                                labelKey="Thông tin khách hàng"
                                                showLabel={false}
                                                labelAdd="Thêm mới khách hàng"
                                                property="isUser"
                                                initialValue={_.get(values, "isUser")}
                                                placeholder="Tìm tên, SĐT, mã khách hàng ..."
                                                callbackValueChange={onChange}
                                            />
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
                                            <div className="purchase-details">
                                                <div className="items">
                                                    <p>Tổng chi tiêu (5 đơn)</p>
                                                    <p className="text-primary right">{CommonUtil.formatMoney(1557000)}</p>
                                                </div>
                                                <div className="items">
                                                    <p>Trả hàng (5 sản phẩm)</p>
                                                    <p className="text-danger right">{CommonUtil.formatMoney(1557000)}</p>
                                                </div>
                                                <div className="items">
                                                    <p>Giao hàng thất bại (5 sản phẩm)</p>
                                                    <p className="text-danger right">{CommonUtil.formatMoney(1557000)}</p>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </Card>
                        </div>
                        <Card title="Thông tin đơn hàng">
                            <div className='staff-info px-4 mb-3'>
                                <div className="row">
                                    <div className="col-12">
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
                    <div className="panel-for-pay">
                        <Card header={renderHeader}>
                            <div className="card-body">
                                <p className="price-wrap">
                                    Khách phải trả: <span className="price">{CommonUtil.formatMoney(calCustomerMustPay)}</span>
                                </p>
                                <p className="price-wrap">
                                    Đã thanh toán: <span className="price">{CommonUtil.formatMoney(calCustomerPaid)}</span>
                                </p>
                                <p className="price-wrap">
                                    Còn phải trả: <span className="price text-danger">{CommonUtil.formatMoney(calCustomerNeedToPay)}</span>
                                </p>
                            </div>
                        </Card>
                    </div>
                    <div className="packing-delivery-info">
                        <Card header={renderHeaderDelivery}>
                            <div className="card-body">
                                <p className="title-info">
                                    Mã vận đơn: <span className="f-500">{ _.get(values, "codeLading") }</span>
                                </p>
                                <p className="title-info">
                                    Trạng thái: <span className="f-500">{CommonUtil.formatMoney(calCustomerPaid)}</span>
                                </p>
                                <p className="title-info">
                                    Hình thức giao hàng: <span className="f-500 f-500">{renderDelivery}</span>
                                </p>
                                <p className="title-info">
                                    Thời gian dự kiến nhận hàng: <span className="f-500 text-danger">{CommonUtil.renderDateToData(calEstimatedDeliveryTime, "DD/MM/YYYY HH:mm:ss")}</span>
                                </p>
                            </div>
                        </Card>
                    </div>
                    <div className="product-info-container">
                        <Card title="Thông tin sản phẩm">
                            { hasProduct ?
                                <DataTable className="data-table-product" value={_.get(values, "lstOrderDetail") ?? []} scrollable scrollDirection="both" stripedRows size="small">
                                    <Column header="STT" body={renderSTT} style={{ flexGrow: 1, flexBasis: '70px' }} alignHeader="center" align="center"></Column>
                                    <Column header="Hình ảnh" alignHeader="center" align="center" body={renderImg} style={{ flexGrow: 1, flexBasis: '70px' }}></Column>
                                    <Column field="productName" header="Tên sản phẩm" style={{ flexGrow: 1, flexBasis: '500px' }}></Column>
                                    <Column field="colorName" header="Màu sắc" alignHeader="center" align="center" body={editorColorName} style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                                    <Column field="sizeName" header="Kích cỡ" alignHeader="center" align="center" body={editorSizeName} style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                                    <Column header="Số lượng" alignHeader="center" align="center" body={editorQuantity} style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                                    <Column header="Giá" alignHeader="center" align="center" body={renderFinalPrice} style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                                    <Column header="Tổng" body={renderTotalPriceItems} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
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
                            <div className="row">
                            <div className="col-9">
                            </div>
                            <div className="col-3">
                                <ul className="price-list">
                                    <li className="price-item">
                                        <span>Tổng tiền ({calQuantityProduct} sản phẩm)</span>
                                        <span className="price">{CommonUtil.formatMoney(calTotalPriceProduct)}</span>
                                    </li>
                                    <li className="price-item">
                                        <span>Phí giao hàng</span>
                                        <span className="price">{CommonUtil.formatMoney(calFeeShip)}</span>
                                    </li>
                                    <li className="price-item">
                                        <span>Mã giảm giá</span>
                                        <span className="price">0</span>
                                    </li>
                                    <li className="price-item">
                                        <span>Khách phải trả</span>
                                        <span className="price">{CommonUtil.formatMoney(calCustomerMustPay)}</span>
                                    </li>
                                    <span className="line-thogth"></span>
                                </ul>
                            </div>
                        </div>
                        </Card>
                    </div>
                </section>
            </main>
            {
                showConfirmPaid &&
                <DialogConfirmPaid
                    onHide={() => setShowConfirmPaid(false)}
                />
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
)(OrderEditForm);
