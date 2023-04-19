import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { useEffect, useLayoutEffect, useState } from 'react';
import productServices from 'src/services/product.services';
import { RESPONSE_TYPE } from 'src/@types/enums';
import { ProductItem } from 'src/models/Product';
import { useLocation } from 'react-router-dom';
import Banner from '../home/Banner';
import HomeTabContent from "../home/HomeTabContent";
import useDebounce from 'src/utils/useDebounce';
import BaseLayout from 'src/components/layouts/BaseLayout';
type IMenProps = StateProps & DispatchProps & {
}

const Men = (props: IMenProps) => {
    const { search } = useLocation();
    const productId = new URLSearchParams(search).get('uuid');
    const [product, setProduct] = useState<ProductItem>();
    const [products, setProducts] = useState([]);
    const [formSearch, setFormSearch] = useState({});
    const debouncedSearch = useDebounce(formSearch, 1000);
    const height = 500;
    useEffect(() => {
        const fetchData = async () => {
            const data = {
                listProductGender : [1, 3],
                isDelete: 0
            }
            await getAllProductMen(data)
        }
        fetchData();
    }, []);
    const getAllProductMen = async (formData?: any, event?: any) => {
        // event.rows = 8
        try {
            const rest = await productServices.search(formData, event);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = rest.data.data;
                setProducts(restData);
            }
        } catch (error) {
            console.log(">>>> getAllProductMen error: ", error);
        }
    }
    const renderFormSearch = (newlist) =>
    {
        if(Object.keys(newlist).length > 0) {
            const form = Object.assign({} , newlist, { listProductGender : [1, 3]})
            setFormSearch(form)
        }
    }
    useEffect(() => {
        if (!debouncedSearch || Object.keys(debouncedSearch).length == 0) {
          return;
        }
        getAllProductMen(formSearch );
    }, [debouncedSearch]);
    return (
        <>
            <BaseLayout>
                <div>
                    <Banner />
                    <div className="my-4 text-center">
                        <h2>FOR MEN</h2>
                    </div>
                    <HomeTabContent
                        products={products}
                        formSearch={renderFormSearch}
                        height={height}
                        onChangePage={getAllProductMen}
                    />
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
)(Men);
