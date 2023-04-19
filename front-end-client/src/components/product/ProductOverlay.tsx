import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { ProductItem } from 'src/models/Product';
import { addToCart } from 'src/reducers/cart';
import * as AiIcon from 'react-icons/ai';
import * as IoIcon from "react-icons/io5";
import { CartContext } from 'src/context/cart';
import { useContext } from 'react';
type IProductOverlayProps = StateProps & DispatchProps & {
    product: ProductItem;
    onRedirect?: Function;
    onView?: Function;
}

const ProductOverlay = (props: IProductOverlayProps) => {
    const { addToCart, addToWishList } = useContext(CartContext);
    const onAddWishlist = async () => {
        await addToWishList(props.product);
    }
    const onView = (event) => {
        event.stopPropagation();
        props.onView && props.onView();
    }
    return (
        <>
            <div className="product-overlay" id="overlay" onClick={() => props.onRedirect && props.onRedirect()}>
                {/* <div className="product-icon-box flex-center icon-cart btn" onClick={onAddToCart}>
                    <AiIcon.AiOutlineShoppingCart className="icon" />
                </div> */}
                <div className="product-icon-box flex-center icon-wishlist btn" onClick={onAddWishlist}>
                    <IoIcon.IoHeartOutline className="icon" />
                </div>
                <div className="product-icon-box flex-center icon-view btn" onClick={onView}>
                    <AiIcon.AiOutlineEye className="icon"/>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoading: authentication.isLoading,
});

const mapDispatchToProps = {
    addToCart
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(ProductOverlay);
