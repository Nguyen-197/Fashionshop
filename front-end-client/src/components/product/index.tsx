import { useLayoutEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Link, useHistory } from 'react-router-dom';
import { ProductItem } from 'src/models/Product';
import { CommonUtil } from 'src/utils/common-util';
import ProductOverlay from './ProductOverlay';
import ProductQuickView from './ProductQuickView';
import StarRatingComponent from 'react-star-rating-component';

type IProductProps = StateProps & DispatchProps & {
    product: ProductItem
}

const Product = (props: IProductProps) => {
    const history = useHistory();
    const [hover, setHover] = useState(false);
    const [view, setView] = useState(false);
    const [rating, setRating] = useState(5);
    const product = props.product;
    const images = product.image.split(";");
    const domain = `${product.name}?code=${product.code}&&uuid=${product.id}`;
    const onChangeRating = (nextValue, prevValue, name) => {
        setRating(nextValue);
    }
    const onView = () => {
        setView(true);
    }
    const closeView = () => {
        setView(false);
    }
    const onRedirect = () => {
        history.push(`/products/${decodeURIComponent(domain)}`);
    }
    useLayoutEffect(() => {
        if (view) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'hidden auto';
        }
    }, [view]);
    return (
        <>
            <div key={product.id} className="product-item" onMouseOver={()=> setHover(true)} onMouseOut={()=> setHover(false)}>
                <div className="img">
                    <Link to={`/products/${decodeURIComponent(domain)}`}>
                        <img className="img-responsive main-img main" src={images[0]} alt={`${product.name}-image-0`} />
                    </Link>
                    { images[1] ? <Link to={`/products/${decodeURIComponent(domain)}`}>
                        <img className="img-responsive sub-img" src={images[1]} alt={`${product.name}-image-1`} />
                    </Link> : <Link to={`/products/${decodeURIComponent(domain)}`}>
                        <img className="img-responsive sub-img" src={images[0]} alt={`${product.name}-image-0`} />
                    </Link>
                    }
                    <ProductOverlay
                        product={product}
                        onRedirect={onRedirect}
                        onView={onView}
                    />
                </div>
                <div className="info">
                    <p>
                        <Link to={`/products/${decodeURIComponent(domain)}`}>{product.name}</Link>
                    </p>
                </div>
                <div className="product-rating">
                    <StarRatingComponent
                        name="product-rating"
                        starCount={5}
                        value={rating}
                        onStarClick={onChangeRating}
                    />
                    <span className="info">12k đánh giá</span>
                    <span className="info">{product.sellNumber | 0} đã bán</span>
                </div>
                <div className="product-info">
                    <div className="product-info-price">
                        { product.minPrice == product.maxPrice && (
                            <>
                                <span className="price">{ CommonUtil.formatMoney(product.maxPrice) }</span>
                            </>
                        )}
                        {
                            product.minPrice < product.maxPrice && (
                                <>
                                    <span className="price">{ CommonUtil.formatMoney(product.minPrice) }</span>
                                    { product.minPrice && product.maxPrice && <span className="split">-</span> }
                                    <span className="price">{ CommonUtil.formatMoney(product.maxPrice) }</span>
                                </>
                            )
                        }
                    </div>
                    {
                        product.sellNumber && <span className="discount">${product.sellNumber}% giảm</span>
                    }
                </div>
            </div>
            { view && <ProductQuickView
                    view={view}
                    closeView={closeView}
                    product={product}
                />
            }
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
)(Product);
