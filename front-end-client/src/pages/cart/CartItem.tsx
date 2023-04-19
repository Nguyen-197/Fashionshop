import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { setLoading } from 'src/reducers/authentication';
import * as FaIcon from "react-icons/fa";
import { useContext, useEffect, useMemo, useState } from 'react';
import { CartContext } from 'src/context/cart';
import { CommonUtil } from 'src/utils/common-util';
import { InputNumber, InputNumberChangeParams } from 'primereact/inputnumber';
import { CartItemModel } from 'src/models/CartModel';
import _ from 'lodash';
import { Toast } from 'src/components/toast/toast.utils';
import { RESPONSE_TYPE } from 'src/@types/enums';
import { useHistory } from 'react-router-dom';
import { Crypto } from 'src/utils/crypto';
type ICartItemProps = StateProps & DispatchProps & {
    onShowDeleteModel?: Function;
}

const CartItem = (props: ICartItemProps) => {
    const history = useHistory();
    const { cartItems, updateQuantity, removeCart, reductAmount, increaseAmount, listSelected, setListSelected } = useContext(CartContext);
    const [selectedAll, setSelectedAll] = useState(false);
    useEffect(() => {
        if (CommonUtil.isEmpty(listSelected)) {
            return;
        }
        let isSelectAll = true;
        for (let i = 0; i < cartItems.length; i++) {
            const index = listSelected.findIndex(ele => ele.id == cartItems[i].id);
            if (index == -1) {
                isSelectAll = false;
                break;
            }
        };
        setSelectedAll(isSelectAll);
    }, [listSelected, cartItems]);

    const getTotal = useMemo(() => {
        const mapSelected = {};
        listSelected.forEach(item => mapSelected[item.id] = item);
        const _list = cartItems.filter(item => mapSelected[item.id]);
        return _list.reduce((total, item) => {
            if (item.salePrice > 0) {
                return total += item.quantity * item.salePrice;
            } else {
                return total += item.quantity * item.finalPrice;
            }
        }, 0);
    }, [cartItems, listSelected]);
    const renderPrice = (item) => {
        return item.salePrice ? CommonUtil.formatMoney(item.salePrice) : CommonUtil.formatMoney(item.finalPrice);
    }
    const renderTotal = (item) => {
        return item.salePrice ? CommonUtil.formatMoney(item.salePrice * item.quantity) : CommonUtil.formatMoney(item.finalPrice * item.quantity);
    }
    const onUpdateQuantity = async (event: InputNumberChangeParams, item: CartItemModel) => {
        if (event.value <= 0) {
            CommonUtil.confirmDeleteCartItem(async () => {
                try {
                    await removeCart(item.id);
                } catch (error) {
                    console.log(">>>> delete cart item error: ", error);
                }
            }, () => {
                const element = document.querySelector(`input[id='${item.id}']`) as HTMLInputElement;
                if (element) element.value = `${item.quantity}`;
             }, `${item.productName}`);
            return;
        }
        await updateQuantity(event, item)
    }
    const renderCheckItem = (item) => {
        const checked = listSelected.some(ele => ele.id == item.id);
        return <input id={`${item.id}`} type="checkbox" checked={checked} onChange={(event) => onSelected(event, item)} />;
    }
    const onSelected = (event, item) => {
        const checked = event.target.checked;
        const mapSelected = {};
        listSelected.forEach(item => {
            mapSelected[item.id] = item;
        });
        if (checked) {
            if (!mapSelected[item.id]) {
                listSelected.push(item);
            }
        } else {
            const index = listSelected.findIndex(ele => ele.id == item.id);
            if (index != -1) {
                listSelected.splice(index, 1);
            }
        }
        setListSelected(_.cloneDeep(listSelected));
    }
    const onSelectAll = (event) => {
        const checked = event.target.checked;
        setSelectedAll(checked);
        setListSelected(_.cloneDeep(checked ? cartItems : []));
    }
    const onCheckout = () => {
        if (listSelected.length == 0) {
            Toast.show(RESPONSE_TYPE.WARNING, '', 'Bạn vẫn chưa chọn sản phẩm nào để mua.');
            return;
        }
        CommonUtil.confirmSaveOrUpdate(() => {
            CommonUtil.setLocalStorage('CHECKOUT_REPORTER_LOGS', listSelected);
            window.location.href = `/checkout?state=${btoa(Crypto.encr('CHECKOUT_REPORTER_LOGS'))}`;
            document.body.style.overflow = 'hidden auto';
        }, null, "Bạn có chắc chắn muốn thanh toán đơn hàng này không ?");
    }
    return (
        <>
            <div className="cart-container__body">
                <div className="cart-list">
                    { cartItems.length === 0 && (
                        <div className="cart-list__empty">
                            Your shopping cart is empty
                        </div>
                    )}
                    { cartItems.length > 0 && (
                        <div className="cate-list__heading flex">
                            <div className="cart-product-selected"></div>
                            <div
                                className="cart-product-img flex"
                                style={{ alignItems: "center", justifyContent: "flex-start" }}
                            >
                                Hình ảnh
                            </div>
                            <div className="cart-product-mobile flex">
                                <div className="cart-product-name flex-center" style={{ alignItems: "center", justifyContent: "flex-start" }}>
                                    Tên sản phẩm
                                </div>
                                <div className="cart-product-amount flex-center" style={{ alignItems: "center", justifyContent: "center" }}>
                                    Số lượng
                                </div>
                                <div className="cart-product-size flex-center" style={{ alignItems: "center", justifyContent: "center" }}>
                                    Kích cỡ
                                </div>
                                <div className="cart-product-color flex-center" style={{ alignItems: "center", justifyContent: "center" }}>
                                    Màu sắc
                                </div>
                                <div className="cart-product-price flex" style={{ alignItems: "center", justifyContent: "center" }}>
                                    Giá/sản phẩm
                                </div>
                                <div className="cart-product-totalprice flex" style={{ alignItems: "center", justifyContent: "center" }}>
                                    Tổng
                                </div>
                                <div className="cart-product-delete"></div>
                            </div>
                        </div>
                    )}
                    { cartItems.map((item, index) => {
                        return (
                            <div className="cart-item flex" key={index}>
                                <div className="cart-product-selected">
                                    { renderCheckItem(item) }
                                </div>
                                <div className="cart-product-img">
                                    {item.image && (
                                        <img src={item.image.split(";")[0]} width="80px" height="100%" alt="" />
                                    )}
                                </div>
                                {item.productName && (
                                    <div className="cart-product-mobile flex">
                                        <div
                                            className="cart-product-name flex"
                                            style={{
                                                alignItems: "center",
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            {item.productName}
                                        </div>
                                        <div className="cart-product-amount flex-center">
                                            <div className="count-cart noselect">
                                                <div
                                                    id={item.id}
                                                    className="count-cart-item left flex-center"
                                                    onClick={(e) => { reductAmount(e, item); }}
                                                >
                                                    <FaIcon.FaMinus style={{ pointerEvents: "none" }} />
                                                </div>
                                                <div className="count-cart-item text flex-center">
                                                    <form onSubmit={(event) => event.preventDefault()}
                                                        style={{ width: "100%", margin: "0", height: "30px" }}
                                                    >
                                                        <InputNumber id={item.id} min={0} inputId={item.id} mode="decimal" useGrouping={false} value={item.quantity} onValueChange={(event) => onUpdateQuantity(event, item)} />
                                                    </form>
                                                </div>
                                                <div
                                                    id={item.id}
                                                    className="count-cart-item right flex-center"
                                                    onClick={(e) => increaseAmount(e, item)}
                                                >
                                                    <FaIcon.FaPlus style={{ pointerEvents: "none" }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="cart-product-size flex" style={{ alignItems: "center", justifyContent: "center" }}>
                                            { item.sizeName }
                                        </div>
                                        <div className="cart-product-color flex" style={{ alignItems: "center", justifyContent: "center" }}>
                                            { item.colorName }
                                        </div>
                                        <div className="cart-product-price flex"style={{ alignItems: "center", justifyContent: "center" }}>
                                            { renderPrice(item) }
                                        </div>
                                        <div className="cart-product-totalprice flex" style={{ alignItems: "center", justifyContent: "center" }}>
                                            { renderTotal(item) }
                                        </div>
                                        <div id={item.id} className="cart-product-delete" onClick={() => removeCart(item.id)}>
                                            <FaIcon.FaTimes style={{ cursor: "pointer", display: "flex !important" }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="cart-checkout-box flex-center">
                <div className="flex" style={{ alignItems: "center" }}>
                    <input id="selected-all" type="checkbox" checked={selectedAll} onChange={onSelectAll}/>
                    <label htmlFor="selected-all" style={{ marginLeft: '8px' }}>Chọn tất cả ({listSelected.length}) sản phẩm</label>
                </div>
                <div className="flex" style={{ alignItems: "center" }}>
                    <div className="cart-checkout-text flex">
                        <p>Tổng thanh toán ({listSelected.length} sản phẩm): </p>
                        <span style={{ marginLeft: '8px' }}>{ CommonUtil.formatMoney(getTotal) }</span>
                    </div>
                    <div className="cart-checkout-btn btn" onClick={onCheckout}>
                        Mua hàng
                    </div>
                </div>
            </div>
        </>
    );
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
)(CartItem);
