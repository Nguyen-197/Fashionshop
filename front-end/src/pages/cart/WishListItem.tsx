import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { setLoading } from 'src/reducers/authentication';
import * as FaIcon from "react-icons/fa";
import { useContext } from 'react';
import { CartContext } from 'src/context/cart';
import { CommonUtil } from 'src/utils/common-util';
import { Button } from 'primereact/button';
type IWishListItemProps = StateProps & DispatchProps & {
    onShowDeleteModel?: Function;
}

const WishListItem = (props: IWishListItemProps) => {
    const { wishListItems, removeFromWishList, addToCart } = useContext(CartContext);
    const renderMinPrice = (item) => {
        const mapPrice = [];
        if (item.minSalePrice < item.maxSalePrice) {
            mapPrice.push(CommonUtil.formatMoney(item.minSalePrice));
            mapPrice.push(CommonUtil.formatMoney(item.maxSalePrice));
            return mapPrice.join(' - ');
        } else if (item.minPrice < item.maxPrice) {
            mapPrice.push(CommonUtil.formatMoney(item.minPrice));
            mapPrice.push(CommonUtil.formatMoney(item.maxPrice));
            return mapPrice.join(' - ');
        } else if (item.minSalePrice == item.maxSalePrice) {
            return CommonUtil.formatMoney(item.minSalePrice);
        } else if (item.minPrice == item.maxPrice) {
            return CommonUtil.formatMoney(item.minPrice);
        }
    }
    const onAddToCart = () => {

    }
    return (
        <>
            <div className="search-form login-form fadeToRight" style={{width: '100%'}}>
                <div className="cart-list">
                    {
                        wishListItems.length === 0 &&
                        <div style={{textAlign: 'center', color: '#777'}}>
                            Danh sách sản phẩm yêu thích trống
                        </div>
                    }
                    { wishListItems.length > 0 && (
                        <div className="cate-list__heading flex">
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
                                <div className="favories-product-price flex" style={{ alignItems: "center", justifyContent: "center" }}>
                                    Giá/sản phẩm
                                </div>
                                <div className="category-product-name flex" style={{ alignItems: "center", justifyContent: "center" }}>
                                    Danh mục sản phẩm
                                </div>
                                <div className="favories-action"></div>
                                <div className="cart-product-delete"></div>
                            </div>
                        </div>
                    )}
                    {
                        wishListItems.map((item, index) => {
                            return (
                                <div className="cart-item flex" key={index}>
                                    <div className="cart-product-img">
                                        {item.image && <img src={item.image.split(";")[0]} width="80px" height="100%" alt="" />}
                                    </div>
                                    <div className="cart-product-mobile flex">
                                        {item.productName &&
                                            <div className="cart-product-name flex" style={{ alignItems: "center",justifyContent: "flex-start" }}>
                                                {item.productName}
                                            </div>
                                        }
                                        <div className="favories-product-price flex"style={{ alignItems: "center", justifyContent: "center" }}>
                                            { renderMinPrice(item) }
                                        </div>
                                        <div className="category-product-name flex"style={{ alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ color: '#909097', textTransform: 'uppercase' }}>{ item.categoryName }</span>
                                        </div>
                                        <div className="favories-action flex"style={{ alignItems: "center", justifyContent: "center" }}>
                                            <Button
                                                className="btn"
                                                label="Add to cart"
                                                onClick={onAddToCart}
                                            />
                                        </div>
                                        <div id={item.id} className="cart-product-delete" onClick={() => removeFromWishList(item)}>
                                            <FaIcon.FaTimes style={{ cursor: "pointer", display: "flex !important" }} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
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
)(WishListItem);
