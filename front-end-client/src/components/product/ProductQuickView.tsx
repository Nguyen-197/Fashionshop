import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { ProductItem } from 'src/models/Product';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CommonUtil } from 'src/utils/common-util';
import { Toast } from 'src/components/toast/toast.utils';
import * as AiIcon from 'react-icons/ai';
import * as IoIcon from "react-icons/io5";
import { GENDER, RESPONSE_TYPE } from 'src/@types/enums';
import { InputNumber } from 'primereact/inputnumber';
import { useContext, useEffect, useState } from 'react';
import { Storage } from 'react-jhipster';
import productDetailServices from 'src/services/product-detail.services';
import _ from 'lodash';
import { ProductDetailModel } from 'src/models/ProductDetailModel';
import { CartContext } from 'src/context/cart';
type IProductQuickViewProps = StateProps & DispatchProps & {
    product: ProductItem;
    view: boolean;
    closeView: Function;
}

const ProductQuickView = (props: IProductQuickViewProps) => {
    const { addToCart, addToWishlist } = useContext(CartContext);
    const [countCart, setCountCart] = useState(1);
    const [sizeList, setSizeList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [activeSize, setActiveSize] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetailModel>(null);
    const product = props.product;
    const images = product.image.split(";");
    const history = useHistory();
    const settings = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    }

    useEffect(() => {
        const productId = product.id;
        console.log("product", product);
        
        if (!productId || !props.view) return;
        const fetchProductDetail = async () => {
            const restDetail = await productDetailServices.getProductDetail(productId);
            if (restDetail.data.type == RESPONSE_TYPE.SUCCESS) {
                const restDataDetail = restDetail.data.data;
                const mapSize = {};
                const mapColor = {};
                sizeList.splice(0);
                colorList.splice(0);
                restDataDetail.forEach(item => {
                    const sizeTemp = item.size;
                    const colorTemp = item.color;
                    if (!mapSize[sizeTemp.id]) {
                        mapSize[sizeTemp.id] = sizeTemp;
                        sizeList.push(sizeTemp);
                    }
                    if (!mapColor[colorTemp.id]) {
                        mapColor[colorTemp.id] = colorTemp;
                        colorList.push(colorTemp);
                    }
                });
                setSizeList(_.cloneDeep(sizeList));
                setColorList(_.cloneDeep(colorList));
                setProductDetails(restDataDetail);
            }
        }
        fetchProductDetail();
        
        // setSelectedProduct(product);
    }, [product, props.view]);

    useEffect(() => {
        if (!activeSize || !activeColor) return;
        const fetchSelectProduct = async () => {
            const formData = { idProduct: product.id, idSize: activeSize, idColor: activeColor};
            const rest = await productDetailServices.getProductByCondition(formData);
            if (rest?.data?.type == RESPONSE_TYPE.SUCCESS && rest?.data?.data) {
                setSelectedProduct(rest.data.data);
            } else {
                setSelectedProduct({});
            }
        }
        fetchSelectProduct();
    }, [activeSize, activeColor]);

    const onRedirect = () => {
        props.closeView && props.closeView();
        history.push(`/product/${product.code}`);
    }

    const onRedirectCategory = () => {
        history.push(`/${product.productGender === GENDER.MEN ? 'men' : 'women'}/${product.categoryName.toLowerCase().split(' ').join('-')}`)
    }

    const onIncrease = () => {
        setCountCart(prevalue => prevalue + 1);
    }
    const onReduced = () => {
        if (countCart <= 1) return;
        setCountCart(prevalue => prevalue - 1);
    }

    const onAddToCart = async () => {
        const token = Storage.local.get('token');
        if (token) {
            await addToCart(selectedProduct, countCart);
            props.closeView();
        } else {
            Toast.show(RESPONSE_TYPE.WARNING, null, "Vui lòng đăng nhập để có thể tiếp tục mua hàng !");
            history.push('/login');
        }
    }

    const onAddToWishList = async () => {
        const token = Storage.local.get('token');
        if (token) {
            await addToWishlist(selectedProduct);
        } else {
            Toast.show(RESPONSE_TYPE.WARNING, null, "Vui lòng đăng nhập để có thể tiếp tục mua hàng !");
            history.push('/login');
        }
    }

    return (
        <>
            <div className={classNames("yuno-modal quick-view-modal", { "modal-opend": props.view })}>
                <div className="productquickview-container flex">
                    <div className="view-close flex-center" onClick={() => props.closeView()}>
                        <i className="ic-close"></i>
                    </div>
                    <div className="productquickview-slide">
                        { props.view &&
                            <Slider {...settings}>
                                {images.map((item, index) => {
                                    return (
                                        <img key={index} src={item} alt={`image-${index}`} className="view-img"/>
                                    )
                                })}
                            </Slider>
                        }
                    </div>
                    <div className="product-info-detail" style={{padding: '70px 40px 0'}}>
                        <div className="product-info-title" onClick={()=> onRedirect()}>
                            { product.name }
                        </div>
                        <div className="product-info-price">
                            
                            { product.minPrice == product.maxPrice && !selectedProduct && (
                                <>
                                    <span className="price">
                                        { CommonUtil.formatMoney(product.maxPrice) }
                                    </span>
                                </>
                            )}
                            {
                                product.minPrice < product.maxPrice && !selectedProduct &&(
                                    <>
                                        <span className="price">
                                            { CommonUtil.formatMoney(product.minPrice) }
                                        </span>
                                        { product.minPrice && product.maxPrice && <span className="split">-</span> }
                                        <span className="price">
                                            { CommonUtil.formatMoney(product.maxPrice) }
                                        </span>
                                    </>
                                )
                            }
                            {
                                selectedProduct && (
                                    <span className="price">
                                        { CommonUtil.formatMoney(selectedProduct.finalPrice) }
                                    </span>
                                )
                            }
                        </div>
                        <div className="product-size">
                            <span className="label">Size</span>
                            <div className="list-item">
                                { sizeList.map(item => {
                                    return (
                                        <div className={classNames("item", { 'active': activeSize == item.id })} key={item.code} onClick={() => {setActiveSize(item.id); setCountCart(1)}}>
                                            {item.name}
                                            { activeSize == item.id && <div className="product-variation__tick">
                                                <AiIcon.AiOutlineCheck className="icon" />
                                            </div> }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="product-color">
                            <span className="label">Màu</span>
                            <div className="list-item">
                                { colorList.map(item => {
                                    return (
                                        <div className={classNames("item", { 'active': activeColor == item.id })} key={item.code} onClick={() => {setActiveColor(item.id); setCountCart(1)}}>
                                            {item.name}
                                            { activeColor == item.id && <div className="product-variation__tick">
                                                <AiIcon.AiOutlineCheck className="icon" />
                                            </div> }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="product-info-cart flex">
                            <span className="label">Số lượng</span>
                            <div className="count-cart noselect">
                                <div className="count-cart-item left flex-center" onClick={() => onReduced()}>
                                    <AiIcon.AiOutlineMinus />
                                </div>
                                <div className="count-cart-item text flex-center">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <InputNumber mode="decimal" min={1} max={selectedProduct?.quantity || 1000} useGrouping={false} value={countCart} onValueChange={(e) => setCountCart(e.value)} />
                                    </form>
                                </div>
                                <div className="count-cart-item right flex-center"onClick={() => onIncrease()}>
                                    <AiIcon.AiOutlinePlus />
                                </div>
                            </div>
                            { selectedProduct ?
                                <div className="quantity">{ selectedProduct?.quantity || 0 } sản phẩm có sẵn</div> :
                                <div className="quantity">{ product.quantity } sản phẩm có sẵn</div>
                            }
                        </div>
                        <div className="product-action">
                            <div className="product-info-addtocart flex-center btn" onClick={onAddToCart}>
                                <IoIcon.IoCartOutline className="icons" />
                                <p>Add to cart</p>
                            </div>
                            <div className="product-info-addtocart flex-center btn" onClick={onAddToCart}>
                                <AiIcon.AiOutlineShopping className="icons" />
                                <p>Mua hàng</p>
                            </div>
                            <div className="product-info-wishlist flex-center" onClick={onAddToWishList}>
                                <AiIcon.AiOutlineHeart />
                            </div>
                        </div>
                        <div className="product-info-line"></div>
                        <div className="product-info-des" style={{width: '80%'}}>
                            { product.description }
                        </div>
                        <div className="product-info-cate flex">
                            <p>Category:</p>
                            <p onClick={()=> onRedirectCategory}
                            >{product.categoryName}</p>
                        </div>
                        {/* <div className="product-info-line"></div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoginSuccess: authentication.isLoginSuccess,
    isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(ProductQuickView);
