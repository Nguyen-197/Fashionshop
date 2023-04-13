import { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { setLoading } from 'src/reducers/authentication';
import * as IoIcon from "react-icons/io";
import { CartContext } from 'src/context/cart';
import { CommonUtil } from 'src/utils/common-util';
import CartItem from './CartItem';
import WishListItem from './WishListItem';
type IQuickCartProps = StateProps & DispatchProps & {
    clickToClose?: Function;
}

const QuickCart = (props: IQuickCartProps) => {
    const { opendCart, setOpendCart } = useContext(CartContext);
    const [tabId, setTabId] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <>
            <div className={opendCart ? "header-search fadeGrow" : "header-search displayNone"}>
                <div className="search-heading flex">
                    <div className="search-title">Giỏ hàng của tôi</div>
                    <div className="search-close">
                        <IoIcon.IoMdClose
                            onClick={() => setOpendCart(false)}
                            className="close"
                        />
                    </div>
                </div>
                <div className={opendCart === false ? "" : "fadeIn"}>
                    <div className="cart-category flex">
                        <div onClick={() => setTabId(0)} className={ tabId === 0 ? "cart-category-tab cart-category-tab_active" : "cart-category-tab" }>
                            Giỏ hàng
                        </div>
                        <div onClick={() => setTabId(1)} className={ tabId === 1 ? "cart-category-tab cart-category-tab_active" : "cart-category-tab" }>
                            Yêu thích
                        </div>
                    </div>
                    { tabId === 0 && <CartItem onShowDeleteModel={() => setShowDeleteModal(true)} /> }
                    { tabId === 1 && <WishListItem /> }
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
)(QuickCart);
