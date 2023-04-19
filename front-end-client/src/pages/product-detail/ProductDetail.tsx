import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import BaseLayout from 'src/components/layouts/BaseLayout';
import Banner from '../home/Banner';
import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import ProductContent from './ProductContent';
import productServices from 'src/services/product.services';
import { RESPONSE_TYPE } from 'src/@types/enums';
import { ProductItem } from 'src/models/Product';
import ProductNotExits from './ProductNotExits';
type IProductDetailProps = StateProps & DispatchProps & {
}

const ProductDetail = (props: IProductDetailProps) => {
    const { search } = useLocation();
    const productId = new URLSearchParams(search).get('uuid');
    const [product, setProduct] = useState<ProductItem>();
    useLayoutEffect(() => {
        if (!productId) return;
        window.scrollTo(0, 0);
        let isCancel = false;
        const fetchData = async () => {
            const rest = await productServices.getById(productId);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS && !isCancel) {
                const restData = rest.data.data;
                setProduct(restData);
            }
        }
        fetchData();
        return () => {
            isCancel = true;
        };
    }, [productId]);
    return (
        <>
            <BaseLayout>
                <div>
                    <Banner />
                    { product ?
                        <ProductContent
                            product={product}
                        /> :
                        <ProductNotExits />
                    }
                    {  }
                </div>
            </BaseLayout>
        </>
    )
}

const mapStateToProps = ({ authentication }: IRootState) => ({
    isLoading: authentication.isLoading,
});

const mapDispatchToProps = {

};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(ProductDetail);
