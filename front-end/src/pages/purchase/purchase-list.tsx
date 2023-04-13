import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Link } from 'react-router-dom';
import { CommonUtil } from 'src/utils/common-util';
import { STATUS_ORDERS } from 'src/constants';
import { Button } from 'primereact/button';
import { RESPONSE_TYPE, STATUS_ORDER } from 'src/@types/enums';
import orderServices from 'src/services/order.services';
import { useContext, useMemo } from 'react';
import { MAP_TAB_VIEW } from 'src/@types/constants';
import { CartContext } from 'src/context/cart';
import cartServices from 'src/services/cart.services';

type IPurchaseListProps = StateProps & DispatchProps & {
    purchases: any;
    state: any;
    afterSaveSuccess?: any
}

const PurchaseList = (props: IPurchaseListProps) => {
    const { fetchDataCart, setOpendCart, setListSelected } = useContext(CartContext);
    const purchases = props.purchases;
    const isAccepCancel = useMemo(() => {
        if (!props.state) return false;
        const key = MAP_TAB_VIEW[props.state];
        return STATUS_ORDER.ORDER == Number(key);
    }, [props.state]);
    const isAccepRepurchase = useMemo(() => {
        if (!props.state) return false;
        const key = MAP_TAB_VIEW[props.state];
        return STATUS_ORDER.CANCEL_ORDER == Number(key);
    }, [props.state]);
    const isSale = (item) => {
        return item.salePrice && item.salePrice < item.finalPrice;
    }
    const totalPrice = (item) => {
        const total = isSale(item) ? item.salePrice * item.quantity : item.finalPrice * item.quantity;
        return CommonUtil.formatMoney(total);
    }
    const renderStatus = (item) => {
        const orderItem = STATUS_ORDERS.find(ele => ele.id == item.status);
        return orderItem ? orderItem.name : null;
    }

    const onCancelOrder = async (order) => {
        await CommonUtil.confirmDeleteCartItem(async () => {
            const rest = await orderServices.cancelOrder(order.id);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                props.afterSaveSuccess && props.afterSaveSuccess(STATUS_ORDER.CANCEL_ORDER);
            }
        }, null, "Bạn có chắc chắn muốn hủy đơn hàng này không ?");
    }
    const onRePurchase = async (order) => {
        await CommonUtil.confirmSaveOrUpdate(async () => {
            const formData = { idProductDetails: order.productDetailId, quantity: order.quantity };
            const rest = await cartServices.addCartItem(formData);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                await fetchDataCart();
                const timer = setTimeout(() => {
                    setOpendCart(true);
                    setListSelected([rest.data.data]);
                    clearTimeout(timer);
                }, 1000);
            }
        }, null, "Bạn có chắc muốn mua lại sản phẩm này không ?");
    }
    const renderCategory = (item) => {
        const _temp = [];
        if (!CommonUtil.isNullOrEmpty(item.productCategory)) {
            _temp.push(item.productCategory);
        }
        if (!CommonUtil.isNullOrEmpty(item.sizeName)) {
            _temp.push(item.sizeName);
        }
        return _temp.join(" - ");
    }
    return (
        <>
            <div className="row purchase-list">
                { purchases.map((item, index) => {
                    return (
                        <div key={index} className="purchase-item">
                            <Link className="col-12 product-detail" to={`/products/${decodeURIComponent(`${item.productName}?code=${item.productCode}&&uuid=${item.productId}`)}`}>
                                <div className="d-flex">
                                    <div className="zune-image__wrap">
                                        <div style={{ backgroundImage: `url(${item.images.split(";")[0]})` }} className="zune-image__content"></div>
                                    </div>
                                    <div className="zune-info">
                                        <div className="product-name">{item.productName}</div>
                                        <div className="product-des">
                                            <span className="product-cate">
                                                Phân loại sản phẩm: {renderCategory(item)}
                                            </span>
                                            <span className="product-quantity">x{item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-wrap">
                                    { isSale(item) ? <>
                                        <del className="del">{CommonUtil.formatMoney(item.finalPrice)}</del>
                                        <span className="primary">{CommonUtil.formatMoney(item.salePrice)}</span>
                                    </> : <span className="primary">{CommonUtil.formatMoney(item.finalPrice)}</span> }
                                </div>
                            </Link>
                            <div className="total-price">
                                Tổng số tiền: { CommonUtil.formatMoney(item.totalPrice) }
                            </div>
                            <div className="purchase-status">
                                <span className="status-name">{ renderStatus(item) }</span>
                                <div>
                                    { isAccepCancel && <Button onClick={() => onCancelOrder(item)} className="btn btn-primary" label="Hủy mua hàng" /> }
                                    { isAccepRepurchase && <Button onClick={() => onRePurchase(item)} className="btn btn-primary" label="Mua lại" /> }
                                    {/* <Button className="btn" label="Hủy mua hàng" /> */}
                                </div>
                            </div>
                        </div>
                    )
                }) }
                { CommonUtil.isEmpty(purchases) && <>
                    <div className="empty-wrap">
                        <div className="box-shadow">
                            <div className="empty-image"></div>
                            <span className="text-empty">Chưa có đơn hàng</span>
                        </div>
                    </div>
                </>}
            </div>
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
)(PurchaseList);
