import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Galleria } from 'primereact/galleria';
import { ProductItem } from 'src/models/Product';
import { Rating } from 'primereact/rating';
import classNames from 'classnames';
import { CommonUtil } from 'src/utils/common-util';
import { ProductDetailModel } from 'src/models/ProductDetailModel';
import _ from 'lodash';
import productDetailServices from 'src/services/product-detail.services';
import { RESPONSE_TYPE } from 'src/@types/enums';
import * as AiIcon from 'react-icons/ai';
import * as IoIcon from "react-icons/io5";
import { InputNumber } from 'primereact/inputnumber';
import { CartContext } from 'src/context/cart';
import { Link } from 'react-router-dom';
import { DeferredContent } from 'primereact/deferredcontent';
import productServices from 'src/services/product.services';
import Product from 'src/components/product';
import { Toast } from 'src/components/toast/toast.utils';
import cartServices from 'src/services/cart.services';
import { UserContext } from 'src/context/user';
type IProductContentProps = StateProps & DispatchProps & {
    product: ProductItem;
}

const responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 3
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
];

const ProductContent = (props: IProductContentProps) => {
    const { addToCart, fetchDataCart, setOpendCart, setListSelected } = useContext(CartContext);
    const { userInfo } = useContext(UserContext);
    const [countCart, setCountCart] = useState(1);
    const [images, setImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [rating, setRating] = useState(5);
    const [sizeList, setSizeList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [similarProduct, setSimilarProduct] = useState([]);
    const [activeSize, setActiveSize] = useState(null);
    const [activeColor, setActiveColor] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetailModel>(null);

    const onChangeRating = (event) => {
        setRating(event.value);
    }
    useLayoutEffect(() => {
        let isCancel = false;
        if (props.product) {
            const fetchProductDetail = async () => {
                const restDetail = await productDetailServices.getProductDetail(props.product.id);
                if (restDetail.data.type == RESPONSE_TYPE.SUCCESS && !isCancel) {
                    const images = props.product?.image?.split(';');
                    setImages(_.cloneDeep(images));
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
                const restSimilar = await productServices.getBestSellersProduct({ idCategory: props.product.idCategory });
                if (restSimilar.data.type == RESPONSE_TYPE.SUCCESS && !isCancel) {
                    const restData = restSimilar?.data?.data?.data;
                    setSimilarProduct(restData?.filter(item => item.id != props.product.id));
                }
            }
            fetchProductDetail();
        }
        return () => {
            isCancel = true;
        }
    }, [props.product]);

    useEffect(() => {
        if (!activeSize || !activeColor) return;
        let isCancel = false;
        const fetchSelectProduct = async () => {
            const formData = { idProduct: props?.product?.id, idSize: activeSize, idColor: activeColor};
            const rest = await productDetailServices.getProductByCondition(formData);
            if (rest?.data?.type == RESPONSE_TYPE.SUCCESS && rest?.data?.data && !isCancel) {
                setSelectedProduct(rest.data.data);
            } else {
                setSelectedProduct({});
            }
        }
        fetchSelectProduct();
        return () => {
            isCancel = true;
        }
    }, [activeSize, activeColor]);

    const onError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        return event.currentTarget.src = `https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png`;
    }

    const itemTemplate = (item) => {
        return (
            <img
                alt={item}
                style={{ width: '100%', display: 'block' }}
                src={item}
                onError={onError}
            />
        );
    }

    const thumbnailTemplate = (item) => {
        return (
            <img
                alt={item}
                style={{ display: 'block' }}
                src={item}
                onError={onError}
            />
        );
    }

    const isProductSale = useMemo(() => {
        return props?.product && props?.product?.minSalePrice > 0;
    }, [props.product]);

    const isShowRangeSalePrice = useMemo(() => {
        return isProductSale ? props.product.minSalePrice < props.product.maxSalePrice : false;
    }, [props.product]);

    const isShowRangePrice = useMemo(() => {
        return props?.product?.minPrice < props?.product?.maxPrice;
    }, [props.product]);

    const isValid = () => {
        if (!selectedProduct) {
            Toast.show(RESPONSE_TYPE.WARNING, null, "Vui lòng chọn Phân loại hàng");
            return false;
        } else {
            if (!selectedProduct.quantity) {
                Toast.show(RESPONSE_TYPE.WARNING, null, "Sản phẩm đang hết hàng");
                return false;
            }
        }
        return true;
    }

    const onReduct = () => {
        setCountCart(prevalue => {
            if (prevalue <= 0) {
                prevalue = 1;
            }
            return prevalue - 1;
        });
    }
    const onIncrease = () => {
        setCountCart(prevalue => {
            return prevalue + 1;
        });
    }

    const onAddToCart = async () => {
        if (!isValid()) {
            return;
        };
        await CommonUtil.confirmSaveOrUpdate(async () => {
            if (CommonUtil.isNullOrEmpty(userInfo)) {
                await addToCart(selectedProduct, countCart);
            } else {
                const formData = { idProductDetails: selectedProduct.id, quantity: countCart };
                const rest = await cartServices.addCartItem(formData);
                if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                    await fetchDataCart();
                    setOpendCart(false);
                    document.body.style.overflow = 'hidden';
                    const timer = setTimeout(() => {
                        setOpendCart(true);
                        setListSelected([rest.data.data]);
                        clearTimeout(timer);
                    }, 2000);
                }
            }
        }, null, "Bạn có chắc muốn thêm sản phẩm này vào giỏ hàng không ?");
    }

    const onPurchase = async () => {
        if (!isValid()) {
            return;
        };
        if (CommonUtil.isNullOrEmpty(userInfo)) {
            await addToCart(selectedProduct, countCart);
        } else {
            await CommonUtil.confirmSaveOrUpdate(async () => {
                const formData = { idProductDetails: selectedProduct.id, quantity: countCart };
                const rest = await cartServices.addCartItem(formData);
                if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                    await fetchDataCart();
                    document.body.style.overflow = 'hidden';
                    setOpendCart(false);
                    const timer = setTimeout(() => {
                        setOpendCart(true);
                        setListSelected([rest.data.data]);
                        clearTimeout(timer);
                    }, 2000);
                }
            }, null, "Bạn có chắc muốn mua sản phẩm này không ?");
        }
    }

    return (
        <>
            <div className="container mt-60">
                <div id="content">
                    <div className="row mb-35">
                        <div className="col-xs-12 col-sm-5">
                            <Galleria
                                value={images}
                                activeIndex={activeIndex}
                                onItemChange={(e) => setActiveIndex(e.index)}
                                autoPlay
                                circular
                                transitionInterval={3000}
                                responsiveOptions={responsiveOptions}
                                numVisible={5}
                                item={itemTemplate}
                                thumbnail={thumbnailTemplate}
                                style={{ maxWidth: '640px' }}
                            />
                        </div>
                        <div className="col-xs-12 col-sm-7">
                            <span className="detail-product-name">{props?.product?.name}</span>
                            <div className="detail-product-feedback">
                                <Rating className="feedback" value={rating} cancel={false} onChange={onChangeRating} />
                                <span className="feedback info">12k đánh giá</span>
                                <span className="feedback info">{props?.product?.sellNumber | 0} đã bán</span>
                            </div>
                            {
                                !selectedProduct ?
                                <>
                                    { console.log(selectedProduct) }
                                    <div className="product-info-price">
                                        <div className={classNames("price-main", { 'del': isShowRangeSalePrice || isProductSale })}>
                                            <span className="price-info">{CommonUtil.formatMoney(props?.product?.minPrice)}</span>
                                            { isShowRangePrice && <span className="split">-</span> }
                                            { isShowRangePrice && <span className={classNames("price-info")}>{CommonUtil.formatMoney(props?.product?.maxPrice)}</span> }
                                        </div>
                                        { isProductSale && (
                                            <div className="price-sales">
                                                <span className={classNames("price-info")}>{CommonUtil.formatMoney(props?.product?.minSalePrice)}</span>
                                                { isShowRangeSalePrice && <span className="split">-</span> }
                                                { isShowRangeSalePrice && <span className={classNames("price-info")}>{CommonUtil.formatMoney(props?.product?.maxSalePrice)}</span> }
                                            </div>
                                        )}
                                    </div>
                                </> :
                                <>
                                    <div className="product-info-price">
                                        <div className={classNames("price-main", { 'del': isShowRangeSalePrice || isProductSale })}>
                                            <span className="price-info">{CommonUtil.formatMoney(props?.product?.minPrice)}</span>
                                            { isShowRangePrice && <span className={classNames("price-info")}>{CommonUtil.formatMoney(props?.product?.maxPrice)}</span> }
                                        </div>
                                        { isProductSale && (
                                            <div className="price-sales">
                                                <span className={classNames("price-info")}>{CommonUtil.formatMoney(_.get(selectedProduct, "finalPrice"))}</span>
                                                { isShowRangeSalePrice && <span className={classNames("price-info")}>{CommonUtil.formatMoney(_.get(selectedProduct, "salePrice"))}</span> }
                                            </div>
                                        )}
                                    </div>
                                </>
                            }
                            <div className="detail-product-body">
                                {/* <div className="panel-product ship-location">
                                    <label className="text-label">Vận chuyển</label>
                                    <div className="flex">
                                        <i className="fa-solid fa-truck-fast"></i>
                                        <div>
                                            <div className="location">
                                                <span>Vận chuyển tới</span>
                                            </div>
                                            <div className="fee-ship">
                                                <span>Phí vận chuyển</span>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="panel-product">
                                    <label className="text-label">Màu</label>
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
                                <div className="panel-product">
                                    <label className="text-label">Size</label>
                                    <div className="list-item">
                                        { sizeList.map(item => {
                                            return (
                                                <div className={classNames("item", { 'active': activeSize == item.id })} key={item.code} onClick={() => { setActiveSize(item.id) ; setCountCart(1)}}>
                                                    {item.name}
                                                    { activeSize == item.id && <div className="product-variation__tick">
                                                        <AiIcon.AiOutlineCheck className="icon" />
                                                    </div> }
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="panel-product">
                                    <label className="text-label">Số lượng</label>
                                    <div className="count-cart noselect">
                                        <div className="count-cart-item left flex-center">
                                            <AiIcon.AiOutlineMinus onClick={onReduct} />
                                        </div>
                                        <div className="count-cart-item text flex-center">
                                            <form onSubmit={(e) => e.preventDefault()}>
                                                <InputNumber mode="decimal" min={1} max={selectedProduct?.quantity ?? 1000} useGrouping={false} value={countCart} onValueChange={(e) => setCountCart(e.value)} />
                                            </form>
                                        </div>
                                        <div className="count-cart-item right flex-center">
                                            <AiIcon.AiOutlinePlus onClick={onIncrease} />
                                        </div>
                                    </div>
                                    { selectedProduct ?
                                        <div className="quantity">{ selectedProduct?.quantity || 0 } sản phẩm có sẵn</div> :
                                        <div className="quantity">{ props?.product?.quantity } sản phẩm có sẵn</div>
                                    }
                                </div>
                                <div className="panel-product">
                                    <div className="product-info-addtocart flex-center btn" onClick={onAddToCart}>
                                        <IoIcon.IoCartOutline className="icons" />
                                        <p>Add to cart</p>
                                    </div>
                                    <div className="product-info-addtocart flex-center btn" onClick={onPurchase}>
                                        <AiIcon.AiOutlineShopping className="icons" />
                                        <p>Mua hàng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-detail page-product__detail">
                    <div className="heading">Mô tả sản phẩm</div>
                    <div className="content" dangerouslySetInnerHTML={{ __html: props?.product?.description?.replace(/\n/g, '<br />') }}></div>
                    { similarProduct.length > 0 &&
                        <section className="product-category">
                            <div className="heading">
                                <span>Sản phẩm cùng danh mục</span>
                                <Link to={`/category/${props?.product?.categoryName}?uuid=${props?.product?.idCategory}`}></Link>
                            </div>
                            <div className="main-wrap">
                                <div className="row">
                                    { similarProduct.map((product) => {
                                        return (
                                            <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 ">
                                                <Product key={product.id} product={product}/>
                                            </div>
                                        )
                                    }) }
                                </div>
                            </div>
                        </section>
                    }
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ }: IRootState) => ({

});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(ProductContent);
