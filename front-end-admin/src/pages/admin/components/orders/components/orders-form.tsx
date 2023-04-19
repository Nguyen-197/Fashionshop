
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import TextSelectControl from 'src/app/components/BaseTextSelect';
import { useFormik } from 'formik';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import userServices from 'src/services/user.services';
import { DELIVERY_TYPE, PAYMENT_STATUS, PAYMENT_TYPE, RESPONSE_TYPE } from 'src/enum';
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
import * as yup from 'yup';
import { classNames } from 'primereact/utils';
import { useHistory } from 'react-router-dom';
type IOrderFormProps = StateProps & DispatchProps & {
}

const OrderForm = (props: IOrderFormProps) => {
    const history = useHistory();
    const productListRef = useRef<any>(null);
    const [datasourceCustomer, setDatasourceCustomer] = useState([]);
    const [datasourceProduct, setDatasourceProduct] = useState([]);
    const [productSelected, setProductSelected] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(null);
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [addressCustomer, setAddressCustomer] = useState(null);
    const [productId, setProductId] = useState(null);
    const [deliveryType, setDeliveryType] = useState(DELIVERY_TYPE.GHN);
    const [showSelectProductDetail, setShowSelectProductDetail] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [isProcess, setisProcess] = useState(false);
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
    const [feeShip, setfeeShip] = useState(null);
    const {
        values,
        errors,
        touched,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            isUser: '',
            requestNote: DELIVERY_ORDER[0].code,
            lstProductDetail: []
        },
        onSubmit: async () => {

        },
        validationSchema: yup.object().shape({
            lstProductDetail: yup.array().of(
                yup.object().shape({
                    quantityBuy: yup.number().min(1).required(),
                })
            ),
        }),
    });
    const isValid = () => {
        return true;
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
            insurance_value: productDebounce.reduce((item, preItem) => { return item + (preItem.salePrice * preItem.quantityBuy) }, 0) ,
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
    const onSaveOrder = async () => {
        if (!isValid()) {
            return;
        }
        await CommonUtil.confirmSaveOrUpdate(async () => {
            const detailOrdersList = _.get(values, 'lstProductDetail');
            const formSave = {
                deliveryType: deliveryType,
                idAddress: addressCustomer.id,
                userId: customerSelected.id,
                totalPrice: calTotalPriceProduct,
                paymentType: PAYMENT_TYPE.COD,
                paymentStatus: isPaid ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.UNPAID,
                detailOrdersList: detailOrdersList.map(item => {
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
        }, null, "Bạn có chắc chắn muốn tạo đơn hàng này không ?");
    }
    const productDebounce = useDebounce(_.get(values, 'lstProductDetail'), 100);
    const isRefreshFeeShip = useDebounce(_.get(values, 'lstProductDetail'), 1500);

    const hasProduct = useMemo(() => {
        const lst = _.get(values, 'lstProductDetail');
        return !CommonUtil.isEmpty(lst);
    }, [_.get(values, 'lstProductDetail')]);
    const onChange = async (fieldName: string, evt: any, value: any) => {
        await setFieldValue(fieldName, value ?? null);
        if (evt) {
            handleChange(evt);
        }
    }

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

    const fetchInfoAddress = async (response) => {
        const restInfo = await addressServices.findByUserId(response?.id);
        if (restInfo.data.type === RESPONSE_TYPE.SUCCESS) {
            const restInfoData = restInfo.data.data;
            const _addressDefault = restInfoData.find(item => item.isDefault);
            const addressDefault = _addressDefault || restInfoData[0];
            setAddressCustomer(addressDefault);
            setCustomerSelected(addressDefault);
            setShowAddCustomer(false);
        }
    }

    useEffect(() => {
        const fetchInfoAddress = async () => {
            let addressDefault = null;
            if (!customerSelected || !isProcess) {
                return;
            }
            const restInfo = await addressServices.findByUserId(customerSelected.id)
            if (restInfo.data.type === RESPONSE_TYPE.SUCCESS) {
                const restInfoData = restInfo.data.data;
                const _addressDefault = restInfoData.find(item => item.isDefault);
                addressDefault = _addressDefault || restInfoData[0];
            }
            setisProcess(false);
            setAddressCustomer(addressDefault);
        }
        fetchInfoAddress();
    }, [customerSelected, isProcess]);

    const onFocusProductList = () => {
        productListRef.current && productListRef.current.focusIn();
    }

    const onSelectCustomer = async (item) => {
        await setFieldValue('idUser', item.id ?? null);
        setisProcess(true);
        setCustomerSelected(item);
    }

    const onClearCustomerSelected = async () => {
        await setFieldValue('idUser', null);
        setisProcess(true);
        setCustomerSelected(null);
        setfeeShip(null);
    }

    const onShowSelectDetail = (item) => {
        setProductId(item.id);
        setShowSelectProductDetail(true);
    }

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
                        <i className="pi pi-times" onClick={onClearCustomerSelected}></i>
                    </div>
                }
            </>
        );
    };
    const onAddCustomer = () => {
        setShowAddCustomer(true);
    }
    const onAddProduct = () => {
        setShowAddProduct(true);
    }
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
    // >>>>> useMemo
    const renderNameOrPhone = useMemo(() => {
        if (!addressCustomer) return;
        const _temp = [];
        addressCustomer.fullName && _temp.push(addressCustomer.fullName);
        addressCustomer.phoneNumber && _temp.push(addressCustomer.phoneNumber);
        return _temp.join(' - ');
    }, [addressCustomer]);

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
        return deliveryType == DELIVERY_TYPE.GHN ? feeShip?.total_fee || 0 : 0;
    }, [feeShip, deliveryType]);

    // Số tiền khách phải trả
    const calCustomerMustPay = useMemo(() => {
        return calTotalPriceProduct + calFeeShip;
    }, [calTotalPriceProduct, calFeeShip]);

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
    const calTotalPriceWithFee = useMemo(() => {
        return calTotalPriceProduct;
    }, [calTotalPriceProduct]);
    const calMassProduct = useMemo(() => {
        return productDebounce.reduce((cur, item) => {
            const mass = item.mass || 0;
            const quantity = item.quantityBuy || 0;
            return cur += mass * quantity;
        }, 0);
    }, [productDebounce]);
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

    return (
        <>
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
                            ref={productListRef}
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
                            <DataTable className="data-table-product" value={_.get(values, "lstProductDetail") ?? []} stripedRows size="small" scrollable scrollDirection="both">
                                <Column header="STT" body={renderSTT} style={{ flexGrow: 1, flexBasis: '70px' }} alignHeader="center" align="center"></Column>
                                <Column header="Hình ảnh" alignHeader="center" align="center" body={renderImg} style={{ flexGrow: 1, flexBasis: '70px' }}></Column>
                                <Column field="productName" header="Tên sản phẩm" style={{ flexGrow: 1, flexBasis: '500px' }}></Column>
                                <Column field="colorName" header="Màu sắc" alignHeader="center" align="center" body={editorColorName} style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                                <Column field="sizeName" header="Kích cỡ" alignHeader="center" align="center" body={editorSizeName} style={{ flexGrow: 1, flexBasis: '100px' }}></Column>
                                <Column header="Số lượng" alignHeader="center" align="center" body={editorQuantity} style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                                <Column header="Giá" alignHeader="center" align="center" body={renderFinalPrice} style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                                <Column header="Tổng" body={renderTotalPriceItems} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '120px' }}></Column>
                                <Column  body={renderActionDelete} alignHeader="center" align="center" style={{ flexGrow: 1, flexBasis: '40px' }}></Column>
                            </DataTable> :
                            <div className="p-empty">
                                <img src={require('../../../../../assets/img/empty-list.png')} alt="product-empty" />
                                <p>Chưa có thông tin sản phẩm</p>
                                <Button
                                    className="p-button-text"
                                    label="Thêm sản phẩm"
                                    onClick={onFocusProductList}
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
                                        <span>Tổng tiền({calQuantityProduct} sản phẩm)</span>
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
                                                disabled={!hasProduct || !customerSelected}
                                            >
                                                Đã thanh toán
                                            </button>
                                            <button
                                                onClick={() => setIsPaid(false)}
                                                className={classNames("btn", { "active": !isPaid })}
                                                disabled={!hasProduct || !customerSelected}
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
                                <span className={classNames("btn", { 'active': deliveryType == DELIVERY_TYPE.GHN })} onClick={() => setDeliveryType(DELIVERY_TYPE.GHN)}>
                                    <i className="fa-solid fa-truck-fast"></i>
                                    Vận chuyển qua GHN
                                </span>
                                <span className={classNames("btn", { 'active': deliveryType == DELIVERY_TYPE.PICK_UP_SHOP })} onClick={() => setDeliveryType(DELIVERY_TYPE.PICK_UP_SHOP)}>
                                    <i className="fa-solid fa-store"></i>
                                    Nhận tại cửa hàng
                                </span>
                                <div className="p-group-button">
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
                                </div>
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
            {
                showSelectProductDetail &&
                    <DialogProductDetail
                        productId={productId}
                        onHide={() => setShowSelectProductDetail(false)}
                        onSelected={onSelected}
                    />
            }
            { showAddCustomer &&
                <CustomerForm onHide={() => setShowAddCustomer(false)} afterSaveSuccess={fetchInfoAddress} />
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
)(OrderForm);
