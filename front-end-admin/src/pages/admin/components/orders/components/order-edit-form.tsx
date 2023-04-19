
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import TextSelectControl from 'src/app/components/BaseTextSelect';
import { useFormik } from 'formik';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import userServices from 'src/services/user.services';
import { PAYMENT_METHOD, PAYMENT_STATUS, PAYMENT_TYPE, RESPONSE_TYPE, STATUS_ORDER } from 'src/enum';
import { Card } from 'primereact/card';
import { CommonUtil } from 'src/utils/common-util';
import CustomerForm from 'src/pages/admin/components/customer/components/user-form';
import ProductForm from 'src/pages/admin/components/product/components/product-form';
import addressServices from 'src/services/address.services';
import productServices from 'src/services/product.services';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import BaseNumberControl from 'src/app/components/BaseNumberControl';
import DialogProductDetail from './DialogProductDetail';
import BaseTextarea from 'src/app/components/BaseTextarea';
import { DELIVERY_ORDER } from 'src/constants/constants';
import useDebounce from 'src/utils/useDebounce';
import { SHOP_ID } from 'src/@types/constants';
import shipGhnServices from 'src/services/ship-ghn.services';
import { SplitButton } from 'primereact/splitbutton';
import orderServices from 'src/services/order.services';
import { useParams, useHistory } from "react-router-dom";
import { Timeline } from 'primereact/timeline';
import { classNames } from 'primereact/utils';
import { Steps } from 'primereact/steps';
type IOrderEditFormProps = StateProps & DispatchProps & {
}

const OrderEditForm = (props: IOrderEditFormProps) => {
    const mapStep = { 0: STATUS_ORDER.ORDER, 1: STATUS_ORDER.APPROVE_ORDER, 2: STATUS_ORDER.PACK_ORDER, 3: STATUS_ORDER.DELIVERING, 4: STATUS_ORDER.COMPLETE_ORDER, 5: STATUS_ORDER.CANCEL_ORDER }
    const { orderId } = useParams();
    const history = useHistory();
    const [customerSelected, setCustomerSelected] = useState(null);
    const [addressCustomer, setAddressCustomer] = useState(null);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showSelectProductDetail, setShowSelectProductDetail] = useState(false);
    const [datasourceCustomer, setDatasourceCustomer] = useState([]);
    const [datasourceProduct, setDatasourceProduct] = useState([]);
    const [productId, setProductId] = useState(null);
    const [feeShip, setfeeShip] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [deliveryType, setDeliveryType] = useState(PAYMENT_METHOD.GHN);
    const optionsSave = [
        {
            label: "Tạo đơn hàng",
            icon: 'pi pi-plus',
            command: async () => {
                await onSaveOrder();
            }
        },
        {
            label: "Tạo đơn và duyệt",
            icon: 'pi pi-check',
            command: async () => {
                await onSaveOrder();
            }
        },
    ];
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
            requestNote: DELIVERY_ORDER[0].code,
            lstProductDetail: []
        },
        onSubmit: async () => {

        }
    });

    const productDebounce = useDebounce(_.get(values, 'lstProductDetail'), 100);

    const hasProduct = useMemo(() => {
        const lst = _.get(values, 'lstProductDetail');
        return !CommonUtil.isEmpty(lst);
    }, [productDebounce]);

    // Tổng số lượng mua
    const calQuantityProduct = useMemo(() => {
        return productDebounce.reduce((cur, item) => cur += item.quantityBuy, 0);
    }, [productDebounce]);

    // Tổng tiền sản phẩm
    const calTotalPriceProduct = useMemo(() => {
        return productDebounce.reduce((cur, item) => {
            const priceItem = item.salePrice > 0 ? item.salePrice : item.finalPrice;
            const quantity = item.quantityBuy || 0;
            return cur += priceItem * quantity;
        }, 0);
    }, [productDebounce]);

    // Phí ship
    const calFeeShip = useMemo(() => {
        return feeShip?.total_fee || 0;
    }, [feeShip]);

    // Số tiền khách phải trả
    const calCustomerMustPay = useMemo(() => {
        return calTotalPriceProduct + calFeeShip;
    }, [calTotalPriceProduct, calFeeShip]);

    const calMassProduct = useMemo(() => {
        return productDebounce.reduce((cur, item) => {
            const mass = item.mass || 0;
            const quantity = item.quantityBuy || 0;
            return cur += mass * quantity;
        }, 0);
    }, [productDebounce]);

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
        const _productItem = _.get(values, `lstProductDetail[${extValue.rowIndex}]`);
        const initialValue = _.get(values, `lstProductDetail[${extValue.rowIndex}].quantityBuy`) || 1;
        return (
            <BaseNumberControl
                min={1}
                showButtons
                mode="decimal"
                property={`lstProductDetail[${extValue.rowIndex}].quantityBuy`}
                max={_productItem.quantity}
                initialValue={initialValue}
                callbackValueChange={onChange}
            />
        );
    }

    const renderFinalPrice = (rowData) => {
        const _price = rowData.salePrice > 0 ? rowData.salePrice : rowData.finalPrice;
        return <>{CommonUtil.formatMoney(_price)}</>
    }

    const renderTotalPriceItems = (rowData, extValue) => {
        const _quantityBuy = _.get(values, `lstProductDetail[${extValue.rowIndex}].quantityBuy`);
        const _price = rowData.salePrice > 0 ? rowData.salePrice : rowData.finalPrice;
        const _total = _price * _quantityBuy;
        return (<span>{CommonUtil.formatMoney(_total)}</span>);
    }

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

    const fetchDetailOrder = async () => {
        const rest = await orderServices.getOrderDetail(orderId);
        if (rest.data.type == RESPONSE_TYPE.SUCCESS && rest?.data?.data) {
            const restData = rest.data.data;
            console.log(">>> restData: ", restData);
            const lstProductDetail = _.get(restData, "lstOrderDetail") || [];
            delete lstProductDetail['lstOrderDetail'];
            restData['lstProductDetail'] = lstProductDetail
            setValues(restData);
            const restInfo = await addressServices.findByUserId(restData.idUser);
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

    useEffect(() => {
        const fetchDataPage = async () => {
            const restCus = await userServices.filterUser({ active: true });
            if (restCus.data.type == RESPONSE_TYPE.SUCCESS) {
                setDatasourceCustomer(restCus.data.data);
            }
            const restProduct = await productServices.filterProduct();
            if (restProduct.data.type == RESPONSE_TYPE.SUCCESS) {
                setDatasourceProduct(restProduct.data.data);
            }
        }
        fetchDataPage();
    }, []);

    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    }

    const onAddCustomer = () => {
        setShowAddCustomer(true);
    }

    const onAddProduct = () => {
        setShowAddProduct(true);
    }

    const onSelectCustomer = async (item) => {
        await setFieldValue('idUser', item.id ?? null);
        setCustomerSelected(item);
    }

    const onShowSelectDetail = (item) => {
        setProductId(item.id);
        setShowSelectProductDetail(true);
    }

    const onClearCustomerSelected = async () => {
        await setFieldValue('idUser', null);
        setCustomerSelected(null);
    }

    const onPrevious = () => {
        history.push(`/admin/orders`);
    }
    const onSaveOrder = async () => {
        if (!CommonUtil.isNullOrEmpty(orderId)) {
            CommonUtil.confirmSaveOrUpdate(async () => {
                const formData = {}
                const rest = await orderServices.saveOrUpdate(formData);
                if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                    await fetchDetailOrder();
                }
            }, null, "Bạn có chắc chắn muốn lưu lại đơn hàng này không ?");
        }
    }

    const renderNameOrPhone = useMemo(() => {
        if (!addressCustomer) return;
        const _temp = [];
        addressCustomer.fullName && _temp.push(addressCustomer.fullName);
        addressCustomer.phoneNumber && _temp.push(addressCustomer.phoneNumber);
        return _temp.join(' - ');
    }, [addressCustomer]);

    const isAllowedUpdate = useMemo(() => {
        const lstIgnore = [STATUS_ORDER.COMPLETE_ORDER, STATUS_ORDER.DELIVERING, STATUS_ORDER.CANCEL_ORDER];
        return !lstIgnore.includes(_.get(values, "status"));
    }, [values]);

    const onSelected = async (listSelected) => {
        const lstProductDetail = _.get(values, 'lstProductDetail');
        const mapItems = {};
        lstProductDetail.forEach((item) => {
            mapItems[item.id] = item;
        });
        listSelected.forEach((item) => {
            if (!mapItems[item.id]) {
                lstProductDetail.push(item);
            }
        });
        await setFieldValue('lstProductDetail', _.cloneDeep(lstProductDetail ?? []));
        setShowSelectProductDetail(false);
    }

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
                        { isAllowedUpdate && <i className="pi pi-times" onClick={onClearCustomerSelected}></i> }
                    </div>
                }
            </>
        );
    };

    const renderDropdownCustom = (
        <ul>
            { datasourceCustomer.map(item => {
                return (
                    <li  className="user-item" key={item.id} onClick={() => onSelectCustomer(item)}>
                        <i className='bx bxs-user-circle'></i>
                        <div className="info">
                            <p className="nowrap">{item.fullName}</p>
                            <p className="nowrap text-bold">{item.phoneNumber}</p>
                        </div>
                    </li>
                )
            }) }
        </ul>
    );

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

    return (
        <>
            <main className="order-form-wrap">
                <div className="order-form-heading">
                    <h4>Chỉnh sửa đơn hàng {_.get(values, 'orderCode')}</h4>
                    <div className="order-timeline">
                        <Steps model={memoStepItem} activeIndex={activeIndex} />
                    </div>
                </div>
                <section>
                    <div className="head-action">
                        <Button
                            label="Hủy"
                            className="p-button-danger"
                            onClick={onPrevious}
                        />
                        {
                            isAllowedUpdate &&
                            <Button
                                label="Lưu thay đổi"
                                className="p-button-success"
                                onClick={onSaveOrder}
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
                                                onAdd={onAddCustomer}
                                                temlateBody={renderDropdownCustom}
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
                                                    { isAllowedUpdate && <span className="text-primary">Thay đổi</span> }
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
                        <Card title="Thông tin bổ sung">
                            <div className='staff-info px-4 mb-3'>
                                <div className="row">
                                    <div className="col-12">
                                        <div className='mb-4 header-card'>Thông tin bổ sung</div>
                                        <div>
                                            <span>Nhân viên bán hàng: </span>
                                            <span style={{ color: "blue" }}>{ props.accountInfo.fullName || "Gene Russell" }</span>
                                        </div>
                                        <div>
                                            <span>Nguồn: </span>
                                            <span style={{ color: "blue" }}>Tại cửa hàng</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="product-info-container">
                        <Card title="Thông tin sản phẩm">
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
                                <DataTable className="data-table-product" value={_.get(values, "lstProductDetail") ?? []} scrollable scrollDirection="both" stripedRows size="small">
                                    <Column header="STT" body={renderSTT} style={{ flexGrow: 1, flexBasis: '50px' }}  alignHeader="center" align="center"></Column>
                                    <Column header="Hình ảnh" alignHeader="center" align="center" body={renderImg} style={{ flexGrow: 1, flexBasis: '70px' }}></Column>
                                    <Column field="productName" header="Tên sản phẩm" style={{ flexGrow: 1, flexBasis: '500px' }}></Column>
                                    <Column field="colorName" header="Màu sắc" alignHeader="center" align="center" body={editorColorName} style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                                    <Column field="sizeName" header="Kích cỡ" alignHeader="center" align="center" body={editorSizeName} style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                                    <Column header="Số lượng" alignHeader="center" align="center" body={editorQuantity} style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                                    <Column header="Giá" alignHeader="center" align="center" body={renderFinalPrice} style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                                    <Column header="Tổng" body={renderTotalPriceItems} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                                    { isAllowedUpdate && <Column  body={renderActionDelete} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '40px' }}></Column> }
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
                                    <i className='bx bx-plus-circle'></i>
                                    Thêm dịch vụ khác
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
                                        <li className="price-item">
                                        <span>Xác nhận thanh toán</span>
                                        <div className="confirm-button">
                                            <button
                                                onClick={() => setIsPaid(true)}
                                                className={classNames("btn", { "active": isPaid })}
                                                disabled={!hasProduct || !customerSelected || !isAllowedUpdate}
                                            >
                                                Đã thanh toán
                                            </button>
                                            <button
                                                onClick={() => setIsPaid(false)}
                                                className={classNames("btn", { "active": !isPaid })}
                                                disabled={!hasProduct || !customerSelected || !isAllowedUpdate}
                                            >
                                                Thanh toán sau
                                            </button>
                                        </div>
                                    </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                    <div className="packing-delivery-container">
                    <Card title="Đóng gói và giao hàng">
                        <div className="row">
                            <div className="control-button">
                                <button disabled={!isAllowedUpdate} className={classNames("btn", { 'active': deliveryType == PAYMENT_METHOD.GHN })} onClick={() => setDeliveryType(PAYMENT_METHOD.GHN)}>
                                    <i className="fa-solid fa-truck-fast"></i>
                                    Vận chuyển qua GHN
                                </button>
                                <button disabled={!isAllowedUpdate} className={classNames("btn", { 'active': deliveryType == PAYMENT_METHOD.PICK_UP_SHOP })} onClick={() => setDeliveryType(PAYMENT_METHOD.PICK_UP_SHOP)}>
                                    <i className="fa-solid fa-store"></i>
                                    Nhận tại cửa hàng
                                </button>
                                {/* <div className="p-group-button">
                                    <Button
                                        className="p-button-text"
                                        label="Thoát"
                                    />
                                    <SplitButton
                                        label="Tạo hóa đơn"
                                        icon="pi pi-plus"
                                        onClick={onSaveOrder}
                                        model={optionsSave}
                                    />
                                </div> */}
                            </div>
                        </div>
                        { addressCustomer && deliveryType == PAYMENT_METHOD.GHN && <div className="row address-transport">
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
                                                    initialValue={calTotalPriceProduct}
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
                            vận chuyển
                            </div>
                        </div> }
                    </Card>
                </div>
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
            { showAddCustomer &&
                <CustomerForm onHide={() => setShowAddCustomer(false)} />
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
)(OrderEditForm);
