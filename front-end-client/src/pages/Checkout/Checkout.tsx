import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { setLoading } from 'src/reducers/authentication';
import LayoutCheckout from 'src/components/layouts/LayoutCheckout';
import * as MdIcon from 'react-icons/md';
import * as AiIcon from 'react-icons/ai';
import { Button } from 'primereact/button';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UserContext } from 'src/context/user';
import addressServices from 'src/services/address.services';
import { PAYMENT_METHOD, RESPONSE_TYPE, STATUS_ORDER } from 'src/@types/enums';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { useLocation, useHistory } from 'react-router-dom';
import { CommonUtil } from 'src/utils/common-util';
import cartServices from 'src/services/cart.services';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import shipGhnServices from 'src/services/ship-ghn.services';
import { SHOP_ID } from 'src/@types/constants';
import AddressForm from './AddressForm';
import { Crypto } from 'src/utils/crypto';
import { Toast } from 'src/components/toast/toast.utils';
import orderServices from 'src/services/order.services';
import paymentServices from 'src/services/payment.services';
import _ from 'lodash';

type ICheckoutIndexProps = StateProps & DispatchProps & {
}

const CheckoutIndex = (props: ICheckoutIndexProps) => {
    const history = useHistory();
    const addressSelector = useRef<any>(null);
    const { search } = useLocation();
    const state = new URLSearchParams(search).get('state');
    const { userInfo } = useContext(UserContext);
    const [addressList, setAddressList] = useState([]);
    const [addressSelected, setAddressSelected] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [feeShip, setfeeShip] = useState(null);
    const [feeSale, setFeeSale] = useState(0);
    const [serviceTypeId, setServiceTypeId] = useState(2);
    const [paymentSelect, setPaymentSelect] = useState(PAYMENT_METHOD.DELIVERY);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [addressId, setAddressId] = useState(null);

    const getAddressUser = async () => {
        const rest = await addressServices.getAddressUser();
        if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
            const restData = rest.data.data;
            const addressSelect = restData.find(item => item.isDefault);
            setAddressList(restData);
            if (addressSelect) {
                console.log("addressSelect", addressSelect);

                setAddressSelected(addressSelect);
                setShowAddress(true);
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            let payload = [];
            try {
                if (!CommonUtil.isNullOrEmpty(state)) {
                    const _state = decodeURIComponent(state);
                    payload = CommonUtil.getLocalStorage(Crypto.decr(atob(_state)));
                }
            } catch (e) {}
            if (CommonUtil.isEmpty(payload)) {
                // show cảnh báo không có sản phẩm
                Toast.show(RESPONSE_TYPE.WARNING, null, "Đơn hàng của bạn chưa có sản phẩm, vui lòng chọn sản phẩm trong giỏ hàng");
                return;
            }
            if (userInfo) {
                try {
                    const checkoutItems = payload.map(item => item.id);
                    const restCart = await cartServices.findByIds(checkoutItems);
                    if (restCart.data.type == RESPONSE_TYPE.SUCCESS) {
                        setCartItems(restCart.data.data);
                    }
                    await getAddressUser();
                } catch (e) {
                    console.log(">>> e: ", e);
                }
            } else {
                setCartItems(payload);
            }
        }
        fetchData();
    }, [userInfo, state]);

    const onSelectAddress = (event) => {
        setAddressSelected(event.value);
    }

    const calQuantityProduct = useMemo(() => {
        return cartItems.reduce((cur, item) => cur += item.quantity, 0);
    }, [cartItems]);

    const calMassProduct = useMemo(() => {
        return cartItems.reduce((cur, item) => {
            const mass = item.mass || 0;
            const quantity = item.quantity || 0;
            return cur += mass * quantity;
        }, 0);
    }, [cartItems]);

    const buildFormSaveGHN = () => {
        const formData = {
            shop_id: SHOP_ID,
            payment_type_id: 2,
            to_name: addressSelected.fullName,
            to_phone: addressSelected.phoneNumber,
            to_address: addressSelected.addressFull,
            to_ward_code: addressSelected.ward,
            to_district_id: addressSelected.district,
            weight: calMassProduct,
            length: 15,
            width: 15,
            height: 15,
            insurance_value: cartItems.reduce((item, preItem) => { return item + (preItem.salePrice * preItem.quantity) }, 0) ,
            service_id: 0,
            service_type_id: 2,
            pick_shift:[2],
            items: cartItems.map(item => ({
                name: item.productName,
                quantity: item.quantity,
                price: item.finalPrice,
            })),
            quantity: calQuantityProduct,
            required_note: 'KHONGCHOXEMHANG',
        };
        return formData;
    }

    useEffect(() => {
        const fetchFeeShip = async () => {
            if (addressSelected && showAddress) {
                const previewCheckout = await shipGhnServices.previewCheckout(buildFormSaveGHN());
                if (previewCheckout.data.code == 200) {
                    setfeeShip(previewCheckout.data.data);
                } else {
                    setfeeShip(null);
                }
            }
        };
        fetchFeeShip();
    }, [addressSelected, showAddress]);

    const confirmAdressChange = () => {
        setShowAddressModal(false);
        setShowAddress(true);
    }

    const onEditAddress = (item) => {
        setAddressId(item.id);
        setShowAddressForm(true);
    }

    const handleValidateBeforeSave = () => {
        if (!addressSelected) {
            setTimeout(() => {
                const element = document.querySelector('.address-selector input');
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            Toast.show(RESPONSE_TYPE.WARNING, null, "Vui lòng chọn địa chỉ nhận hàng");
            return false;
        }
        if (!cartItems.length) {
            setTimeout(() => {
                const element = document.querySelector('.product-box input');
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            Toast.show(RESPONSE_TYPE.WARNING, null, "Đơn hàng của bạn chưa có sản phẩm, vui lòng chọn sản phẩm trong giỏ hàng");
            return false;
        }
        if (!paymentSelect) {
            setTimeout(() => {
                const element = document.querySelector('.payment-methods input');
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            Toast.show(RESPONSE_TYPE.WARNING, null, "Vui lòng chọn phương thức thanh toán");
            return false;
        }
        return true;
    }

    const onCheckout = async () => {
        const isValid = handleValidateBeforeSave();
        if (!isValid) {
            return;
        }
        const formData = {
            orderCode: CommonUtil.generateUniqueId(),
            idAddress: addressSelected.id,
            fullName: userInfo.fullName,
            paymentType: paymentSelect,
            phoneNumber: addressSelected.phoneNumber,
            status: STATUS_ORDER.ORDER,
            totalPrice: renderTotalOutFee,
            detailOrdersList: cartItems.map(item => {
                const _price = item.salePrice ? item.salePrice : item.finalPrice;
                const total = _price * item.quantity;
                return {
                    productDetailId: item.idProductDetail,
                    quantity: item.quantity,
                    totalPrice: total * 1,
                    unitPrice: _price * 1
                }
            })
        };
        await CommonUtil.confirmSaveOrUpdate(async () => {
            try {
                const restSaveGHN = await shipGhnServices.saveOrder(buildFormSaveGHN());
                console.log(">>> restSaveGHN: ", restSaveGHN);
                if (restSaveGHN.data.code == 200) {
                    const restData = restSaveGHN.data.data;
                    formData['codeLading'] = restData['order_code'];
                    if (paymentSelect == PAYMENT_METHOD.DELIVERY) {
                        formData['deliveryCost'] = restData['total_fee'];
                    }
                    formData['estimatedDeliveryTime'] = restData['expected_delivery_time'];
                }
            } catch (error) {
                console.log(">>>> error: ", error);
            }
            const restOrder = await orderServices.createOrder(formData);
            if (restOrder.data.type == RESPONSE_TYPE.SUCCESS) {
                const restOrderData = restOrder.data.data;
                if (paymentSelect == PAYMENT_METHOD.CARD) {
                    const formData = {
                        orderId: restOrderData.id,
                        amount: restOrderData.customerPay,
                        description: '>>>>> KhaiNQ...',
                        bankCode: 'NCB'
                    }
                    const paymentRest = await paymentServices.processPayment(formData);
                    if (paymentRest.data.type == RESPONSE_TYPE.SUCCESS) {
                        const { url } = paymentRest.data.data;
                        window.open(url, 'Cổng thanh toán trực tuyến', "height=600,width=600");
                        const timer = setTimeout(() => {
                            Toast.show(RESPONSE_TYPE.SUCCESS, null, "Đặt đơn hàng thành công !");
                            history.push(`/purchase?state=0`);
                            clearTimeout(timer);
                        }, 500);
                    }
                } else {
                    Toast.show(RESPONSE_TYPE.SUCCESS, null, "Đặt đơn hàng thành công !");
                    history.push(`/purchase?state=0`);
                }
            }
        }, null, 'Bạn có chắc muốn đặt đơn hàng này không ?');
    }

    const footer = () => {
        return (
            <div className="btn-group">
                <Button
                    onClick={() => setShowAddressModal(false)}
                    className="p-button-text"
                    label="Hủy"
                />
                <Button
                    className="p-button-danger"
                    label="Xác nhận"
                    onClick={confirmAdressChange}
                />
            </div>
        );
    }
    const renderAddressDetails = (item) => {
        const mapAddress = [];
        item.addressDetail &&  mapAddress.push(item.addressDetail);
        item.ward && mapAddress.push(item.ward);
        item.district && mapAddress.push(item.district);
        item.province && mapAddress.push(item.province);
        return mapAddress.join(', ');
    }
    const renderProductProperties = (item) => {
        const mapProperties = [];
        item.colorName && mapProperties.push(item.colorName);
        item.sizeName && mapProperties.push(item.sizeName);
        return mapProperties.join(', ');
    }
    const renderPrice = (item) => {
        return item.salePrice ? CommonUtil.formatMoney(item.salePrice) : CommonUtil.formatMoney(item.finalPrice);
    }
    const renderTotal = (item) => {
        return item.salePrice ? CommonUtil.formatMoney(item.salePrice * item.quantity) : CommonUtil.formatMoney(item.finalPrice * item.quantity);
    }

    const renderTotalOutFee = useMemo(() => {
        const total = cartItems.reduce((item, preItem) => {
            const _price = preItem.salePrice ? preItem.salePrice * preItem.quantity : preItem.finalPrice * preItem.quantity;
            return item + _price;
         }, 0);
        return total;
    }, [cartItems]);

    const renderTotalFee = useMemo(() => {
        return feeShip?.total_fee || 0;
    }, [feeShip]);

    const renderTotalWithFee = useMemo(() => {
        const totalOutFee = renderTotalOutFee || 0;
        return totalOutFee + renderTotalFee;
    }, [renderTotalOutFee, feeShip]);

    const totalPayment = useMemo(() => {
        return renderTotalWithFee - feeSale;
    }, [renderTotalWithFee, feeSale]);

    return (
        <>
            <div style={{ paddingTop: 100 }}>
                <LayoutCheckout>
                    <section className="checkout-main">
                        <main className="container">
                            <div className="row">
                                <div className="address-box col-12">
                                    <div className="line-top"></div>
                                    <div ref={addressSelector} id="address-selector" className="address-selector">
                                        <div className="title">
                                            <MdIcon.MdLocationOn />
                                            <span style={{ marginLeft: '8px' }}>Địa chỉ nhận hàng</span>
                                        </div>
                                        { showAddress && addressSelected &&
                                            <>
                                                <div>{addressSelected?.fullName + ' - ' + addressSelected.phoneNumber}</div>
                                                <span>{addressSelected?.addressFull || renderAddressDetails(addressSelected)}</span>
                                            </>
                                        }
                                        <div className="select-label" onClick={() => setShowAddressModal(true)}>
                                            { (!addressSelected || showAddressModal) &&  <span>Chọn địa chỉ</span> }
                                            { addressSelected && !showAddressModal && <span>Thay đổi</span> }
                                        </div>
                                        <input type="text" style={{ position: 'absolute', zIndex: -9999, visibility: 'hidden' }} />
                                    </div>
                                </div>
                                <div id="product-box" className="product-box col-12">
                                    <input type="text" style={{ position: 'absolute', zIndex: -9999, visibility: 'hidden' }} />
                                    <div className="product-list__header">
                                        <div className="product-name f-4">
                                            Sản phẩm
                                        </div>
                                        <div className="product-properties"></div>
                                        <div className="product-amount">
                                            Đơn giá
                                        </div>
                                        <div className="product-quantity">
                                            Số lượng
                                        </div>
                                        <div className="product-total">
                                            Thành tiền
                                        </div>
                                    </div>
                                    <div className="product-list__body">
                                        {
                                            cartItems.map(item => {
                                                return (
                                                    <div key={item.id} className="product-items">
                                                        <div className="product-name">
                                                            {item.image && (
                                                                <img className="flex-center" src={item.image.split(";")[0]} width="60px" height="60px" alt="" />
                                                            )}
                                                            { item.productName && (
                                                                <span className="product-item__name flex-center">{item.productName}</span>
                                                            ) }
                                                        </div>
                                                        <div className="product-properties flex-center">
                                                            Loại: {renderProductProperties(item)}
                                                        </div>
                                                        <div className="product-amount flex-center">
                                                            {renderPrice(item)}
                                                        </div>
                                                        <div className="product-quantity flex-center">{item.quantity}</div>
                                                        <div className="product-total flex-center">{renderTotal(item)}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="ship-wrap">
                                        <div className="note">
                                            <label htmlFor="note">Lời nhắn: </label>
                                            <InputText id='note' />
                                        </div>
                                        <div className="fee-ship">
                                            <div className="org-reverse">Đơn vị nhận hàng</div>
                                            <div className="method-name">Nhanh</div>
                                            <div className="space"></div>
                                            <div className="leadtime">Nhận hàng vào { feeShip?.expected_delivery_time &&CommonUtil.convertDateToString(feeShip.expected_delivery_time) }</div>
                                            <div className="vorcher">Nhanh tay vào ngay "Yuno Voucher" để săn mã Miễn phí vận chuyển nhé!</div>
                                            {/* <div className="change-method" onClick={() => setShowServiceModal(true)}>Thay đổi</div> */}
                                            <div className="fee-money">{ CommonUtil.formatMoney(renderTotalFee) }</div>
                                        </div>
                                    </div>
                                    <div className="total-products">
                                        <span className="label">Tổng số tiền ({cartItems.length} sản phẩm):</span>
                                        <span className="total-price">{ CommonUtil.formatMoney(renderTotalWithFee) }</span>
                                    </div>
                                </div>
                                <div id="payment-methods" className="payment-methods">
                                    <input type="text" style={{ position: 'absolute', zIndex: -9999, visibility: 'hidden' }} />
                                    <div className="payment-header">
                                        <h3 className="title">Phương thức thanh toán</h3>
                                        <div className="payment-methods-tabs">
                                            <div className={classNames("tabs-item", { 'product-variation--selected': PAYMENT_METHOD.CARD == paymentSelect})} onClick={() => setPaymentSelect(PAYMENT_METHOD.CARD)}
                                            >
                                                Thẻ tín dụng/Chuyển khoản
                                                { PAYMENT_METHOD.CARD == paymentSelect && <div className="product-variation__tick">
                                                    <AiIcon.AiOutlineCheck className="icon" />
                                                </div> }
                                            </div>
                                            <div className={classNames("tabs-item", { 'product-variation--selected': PAYMENT_METHOD.DELIVERY == paymentSelect})} onClick={() => setPaymentSelect(PAYMENT_METHOD.DELIVERY)}
                                            >
                                                Thanh toán khi nhận hàng
                                                { PAYMENT_METHOD.DELIVERY == paymentSelect && <div className="product-variation__tick">
                                                    <AiIcon.AiOutlineCheck className="icon" />
                                                </div> }
                                            </div>
                                        </div>
                                    </div>
                                   <div className="payment-body">
                                        { paymentSelect == PAYMENT_METHOD.DELIVERY && (
                                            <div className="payment-delivery">
                                                <div className="title">Thanh toán khi nhận hàng</div>
                                                <div className="desc">Phí thu hộ: ₫0 VNĐ. Ưu đãi về phí vận chuyển (nếu có) áp dụng cả với phí thu hộ.</div>
                                            </div>
                                        )}
                                        <div className="checkout-payment-setting__payment-method-options">
                                            { paymentSelect == PAYMENT_METHOD.CARD && (
                                                <div className="credit-card-subcategory">
                                                    <span className="label">Chọn</span>
                                                    <div className="credit-card-subcategory__body">
                                                        <Button
                                                            icon="pi pi-plus"
                                                            label="Thẻ khác"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="payment-total">
                                            <div className="text-title Exv9ow c5Dezq">Tổng tiền hàng</div>
                                            <div className="text-title Uu2y3K c5Dezq">{ CommonUtil.formatMoney(renderTotalOutFee) }</div>
                                            <div className="text-title Exv9ow B6k-vE">Phí vận chuyển</div>
                                            <div className="text-title Uu2y3K B6k-vE">{ CommonUtil.formatMoney(renderTotalFee) }</div>
                                            <div className="text-title Exv9ow JDc3FO">Combo khuyến mãi</div>
                                            <div className="text-title Uu2y3K JDc3FO">-{ CommonUtil.formatMoney(feeSale) }</div>
                                            <div className="text-title Exv9ow lvfiUV">Tổng thanh toán:</div>
                                            <div className="text-title Uu2y3K lvfiUV final-title">{ CommonUtil.formatMoney(totalPayment) }</div>
                                            <div className="footer">
                                                <div className="rules">
                                                    Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo
                                                    <span className="link">Điều khoản Yuno</span>
                                                </div>
                                                <Button
                                                    className="btn btn-order"
                                                    label="Đặt hàng"
                                                    onClick={onCheckout}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </section>
                </LayoutCheckout>
            </div>
            { showAddressModal &&
                <Dialog
                    className="address-modal"
                    style={{ width: '500px', height: '60vh' }}
                    visible={showAddressModal}
                    header="Địa chỉ của tôi"
                    footer={footer}
                    onHide={() => setShowAddressModal(false)}
                >
                    <div className="address-body">
                        { addressList.map(item => {
                            return (
                                <div className="address-item" key={item.id}>
                                    <div className="radio">
                                        <RadioButton inputId={`${item.id}`} name={`${item.nida}`} value={item} onChange={(event) => onSelectAddress(event)} checked={item.id == addressSelected?.id} />
                                    </div>
                                    <label htmlFor={`${item.id}`}>
                                        <div className="heading">
                                            <div className="info">
                                                <div className="flex">
                                                    <span className="name">{item.fullName}</span>
                                                    <span className="driver"></span>
                                                    <span className="phone">{item.phoneNumber}</span>
                                                </div>
                                                <span className="address">{item?.addressFull || renderAddressDetails(item)}</span>
                                            </div>
                                        </div>
                                    </label>
                                    <div className="action" onClick={() => onEditAddress(item)}>Cập nhật</div>
                                </div>
                            )
                        }) }
                        <Button
                            className="p-button-text btn-normal"
                            icon="pi pi-plus"
                            label="Thêm địa chỉ mới"
                            onClick={() => { setAddressId(null); setShowAddressForm(true) }}
                        />
                    </div>
                </Dialog>
            }
            {
                showServiceModal && (
                    <Dialog
                        className="service-modal"
                        style={{ width: '500px', height: '60vh' }}
                        visible={showAddressModal}
                        header="Chọn đơn vị vận chuyển"
                        footer={footer}
                        onHide={() => setShowServiceModal(false)}
                    >

                    </Dialog>
                )
            }
            {
                showAddressForm &&
                    <AddressForm
                        addressId={addressId}
                        onHide={() => setShowAddressForm(false) }
                        afterSaveSuccess={getAddressUser}
                    />
            }
        </>
    )
}

const mapStateToProps = ({  }: IRootState) => ({

});

const mapDispatchToProps = {
    setLoading
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(CheckoutIndex);
