
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { CommonUtil } from 'src/utils/common-util';
import orderServices from 'src/services/order.services';
import { RESPONSE_TYPE, RETURN_ORDER_STATUS, STATUS_ORDER, STATUS_REFUND } from 'src/enum';
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
import { PAYMENT_TYPE, REASON_OPTION } from 'src/constants/constants';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import orderReturnServices from 'src/services/order-return.services';
import useDebounce from 'src/utils/useDebounce';
import * as yup from 'yup';
type IOrderFormProps = StateProps & DispatchProps & {
}

const OrderReturnForm = (props: IOrderFormProps) => {
    const history = useHistory();
    const { orderReturnId } = useParams();
    const mapStep = { 0: STATUS_ORDER.ORDER, 1: STATUS_ORDER.APPROVE_ORDER, 2: STATUS_ORDER.PACK_ORDER, 3: STATUS_ORDER.DELIVERING, 4: STATUS_ORDER.COMPLETE_ORDER, 5: STATUS_ORDER.CANCEL_ORDER }
    const [customerSelected, setCustomerSelected] = useState(null);
    const [addressCustomer, setAddressCustomer] = useState(null);
    const [hasReturn, setHasReturn] = useState(false);
    const [isReceived, setIsReceived] = useState(false);
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
            lstOrderDetail: []
        },
        onSubmit: async (data) => {
        }
    });

    const lstOrderDetail = useDebounce(_.get(values, 'listDetailReturn') ?? [], 100);

    const goBack = () => {
        history.push('/admin/order-returns');
    }

    const memoStepItem = useMemo(() => {
        const stepItem = [
            {
                label: "Trả hàng"
            },
            {
                label: "Đổi hàng"
            },
            {
                label: "Duyệt"
            },
            {
                label: "Đóng gói"
            },
            {
                label: "Xuất kho"
            },
            {
                label: "Hoàn thành"
            },
        ];
        return stepItem;
    }, [values]);

    const activeIndex = useMemo(() => {
        const status = _.get(values, 'status');
        const index = CommonUtil.getKeyByValue(mapStep, status);
        return Number(index) || 0;
    } , [values]);

    const fetchDetailReturn = async () => {
        try {
            const detailReturn = await orderReturnServices.getDetailReturn(orderReturnId);
            if (detailReturn.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = detailReturn.data.data;
                setValues(restData);
                console.log(">>> restData: ", restData);
                const restInfo = await addressServices.findById(restData.idAddress);
                if (restInfo.data.type === RESPONSE_TYPE.SUCCESS) {
                    const restInfoData = restInfo.data.data;
                    setAddressCustomer(restInfoData);
                    setCustomerSelected(restInfoData);
                }
            }
        } catch (error) {
            console.log(">>>> ERROR: ", error);
            // goBack();
        }
    }

    useEffect(() => {
        fetchDetailReturn();
    }, [orderReturnId]);

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
        const _productItem = _.get(values, `listDetailReturn[${extValue.rowIndex}]`);
        const maxPrice = _.get(values, `listDetailReturn[${extValue.rowIndex}].quantity`) || 1;
        const initialValue = _productItem.quantity > 0 ? _.get(values, `listDetailReturn[${extValue.rowIndex}].quantity`) || 1 : 0;
        return (
            <BaseNumberControl
                min={maxPrice}
                disabled={true}
                showButtons
                mode="decimal"
                property={`listDetailReturn[${extValue.rowIndex}].quantity`}
                max={maxPrice}
                errors={errors}
                touched={touched}
                initialValue={initialValue}
                callbackValueChange={onChange}
            />
        );
    }
    const renderFinalPrice = (rowData, extValue) => {
        const _price = _.get(values, `listDetailReturn[${extValue.rowIndex}].price`);
        return <>{CommonUtil.formatMoney(_price)}</>
    }

    const renderTotalPriceItems = (rowData, extValue) => {
        const _quantity = _.get(values, `listDetailReturn[${extValue.rowIndex}].quantity`);
        const _price = _.get(values, `listDetailReturn[${extValue.rowIndex}].price`);
        const _total = _price * _quantity;
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
            const _quantity = item.quantity || 0;
            return cur += _quantity;
        }, 0);
    },[lstOrderDetail]);

    const calTotalPriceProduct = useMemo(() => {
        return lstOrderDetail.reduce((cur, item) => {
            const _price = item.price || 0;
            const _quantity = item.quantity || 0;
            return cur += _price * _quantity;
        }, 0);
    },[lstOrderDetail]);

    const renderReason = useMemo(() => {
        const _temp = CommonUtil.getValueByKey(REASON_OPTION, _.get(values, 'reason'));
        return _.get(_temp, 'name');
    }, [_.get(values, 'reason')]);

    const isReceive = useMemo(() => {
        return _.get(values, 'status') == RETURN_ORDER_STATUS.ITEM_RECEIVED;
    }, [_.get(values, 'status')]);

    const isPaid = useMemo(() => {
        return _.get(values, 'statusRefund') == STATUS_REFUND.PAID;
    }, [_.get(values, 'statusRefund')]);

    const calAmountPaid = useMemo(() => {
        const totalRefund = _.get(values, 'totalRefund');
        return isPaid ? totalRefund : 0;
    }, [values]);

    const calAmountHasPaid = useMemo(() => {
        const totalRefund = _.get(values, 'totalRefund');
        return !isPaid ? totalRefund : 0;
    }, [values]);

    const onNextStepReturn = async () => {
        await CommonUtil.confirmSaveOrUpdate(async () => {

        }, null, "Đơn trả hàng chưa nhận hàng trả lại, bạn có muốn tiếp tục đổi hàng không ?");
    }

    useEffect(() => {
        console.log(">>>> values: ", values)
        console.log(">>>> error: ", errors)
    }, [values]);

    const onConfirmPaid = async () => {
        if (CommonUtil.isNullOrEmpty(orderReturnId)) return;
        await CommonUtil.confirmSaveOrUpdate(async () => {
            const response = await orderReturnServices.changeStatusRefund(orderReturnId);
            if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                await fetchDetailReturn();
            }
        }, null, "Bạn có chắc chắn đơn hàng này đã được thanh toán không ?");
    }

    const onConfirmReceive = async () => {
        if (CommonUtil.isNullOrEmpty(orderReturnId)) return;
        await CommonUtil.confirmSaveOrUpdate(async () => {
            const response = await orderReturnServices.changeStatusReturnOrder(orderReturnId, RETURN_ORDER_STATUS.ITEM_RECEIVED);
            if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                await fetchDetailReturn();
            }
        }, null, "Bạn có chắc chắn muốn đơn hàng này đã được trả không ?");
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
                    <div className={classNames("order-timeline hide-step", { "show-step" : hasReturn })}>
                        <Steps model={memoStepItem} activeIndex={activeIndex} />
                    </div>
                </div>
                <section>
                    <div className="head-action">
                        {
                            !isReceive && <Button
                                label="Nhận hàng"
                                className="p-button-danger"
                                onClick={onConfirmReceive}
                            />
                        }
                        {
                            !isPaid &&  <Button
                                label="Xác nhận thanh toán"
                                className="p-button-success"
                                onClick={onConfirmPaid}
                            />
                        }
                    </div>
                </section>
                <section className='content'>
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
                                            <span>Ngày trả hàng: </span>
                                            <span style={{ marginLeft: '6px', color: "blue" }}>{ CommonUtil.renderDateToData(_.get(values, 'createDate'), "DD-MM-YYYY HH:mm:ss") }</span>
                                        </div>
                                        <div>
                                            <span>Lý do trả hàng: </span>
                                            <span style={{ marginLeft: '6px', color: "blue" }}>{renderReason}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="p-card page-info flex align-items-center" style={{ flexDirection: "column" }}>
                        <div className="page-info-title w-100">
                            <i className="bx bx-cube-alt"></i>
                            <span>Thông tin sản phẩm</span>
                        </div>
                        <div className="page-info-body" style={{ display: 'inline-block' }}>
                            <div className="list-line-item">
                                <DataTable className="data-table-product" value={_.get(values, "listDetailReturn") ?? []} responsiveLayout="scroll" stripedRows size="small" scrollable>
                                    <Column header="STT" body={renderSTT} style={{ maxWidth: '70px' }}  alignHeader="center" align="center"></Column>
                                    <Column header="Hình ảnh" alignHeader="center" align="center" body={renderImg} style={{ maxWidth: '70px' }}></Column>
                                    <Column field="productName" header="Tên sản phẩm"></Column>
                                    <Column field="colorName" header="Màu sắc" alignHeader="center" align="center" body={editorColorName} style={{ maxWidth: '100px' }}></Column>
                                    <Column field="sizeName" header="Kích cỡ" alignHeader="center" align="center" body={editorSizeName} style={{ maxWidth: '100px' }}></Column>
                                    <Column header="Số lượng trả" alignHeader="center" align="center" body={editorQuantity} style={{ maxWidth: '150px' }}></Column>
                                    <Column header="Giá" alignHeader="center" align="center" body={renderFinalPrice} style={{ maxWidth: '100px' }}></Column>
                                    <Column header="Tổng" body={renderTotalPriceItems} alignHeader="center" align="center" style={{ maxWidth: '100px' }}></Column>
                                </DataTable>
                            </div>
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
                    {/* <div className="p-card page-info flex align-items-center">
                        <div className="page-info-title w-100">
                            <i className="bx bx-cube-alt"></i>
                            <span>Thông tin sản phẩm đổi</span>
                        </div>
                    </div> */}
                    <div className="p-card page-info">
                        <div className="page-info-title flex justify-content-between align-items-center">
                            <div className="flex align-items-center">
                                { !isPaid ?
                                    <>
                                        <i className='bx bxs-credit-card-alt'></i>
                                        <span>Hoàn tiền</span>
                                    </> :
                                    <>
                                        <i className="fa-regular fa-circle-check" style={{ fontSize: '20px', color: '#0fd186' }}></i>
                                        <span>Đơn hàng đã được thanh toán toàn bộ</span>
                                    </>
                                }
                            </div>
                            {
                                !isPaid && (
                                    <div>
                                        <Button
                                            label="Xác nhận thanh toán"
                                            className="p-button-success"
                                            onClick={onConfirmPaid}
                                        />
                                    </div>
                                )
                            }
                        </div>
                        <div className="page-info-body">
                            <div className="info-payment flex w-100">
                                <div className="col-6 no-padding-left">
                                    <label>Đã hoàn tiền: </label>
                                    <span>{CommonUtil.formatMoney(calAmountPaid)}</span>
                                </div>
                                <div className="col-6 no-padding-left">
                                    <label>Cần hoàn trả: </label>
                                    <span className="text-danger">{ CommonUtil.formatMoney(calAmountHasPaid) }</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-card page-info flex justify-content-between align-items-center">
                        <div className="page-info-title">
                            {
                                !isReceive ?
                                <>
                                    <i className="fa-solid fa-truck-fast" style={{ fontSize: "18px" }}></i>
                                    <span>Nhận hàng</span>
                                </> :
                                <>
                                    <i className="fa-regular fa-circle-check" style={{ fontSize: '20px', color: '#0fd186' }}></i>
                                    <span>Đơn hàng đã nhận được hàng</span>
                                </>
                            }
                        </div>
                        {
                            !isReceive && (
                                <div>
                                    <Button
                                        label="Nhận hàng"
                                        className="p-button-danger"
                                        onClick={onConfirmReceive}
                                    />
                                </div>
                            )
                        }
                    </div>
                </section>
            </main>
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
