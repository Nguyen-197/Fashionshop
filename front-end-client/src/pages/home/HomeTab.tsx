import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RESPONSE_TYPE } from "src/@types/enums";
import { IRootState } from 'src/reducers';
import productServices from "src/services/product.services";
import HomeTabContent from "./HomeTabContent";
import useDebounce from 'src/utils/useDebounce';
type HomeTabProps = StateProps & DispatchProps & {
}
const HomeTab = (props: HomeTabProps) => {
    const [currentTab, setCurrentTab] = useState(1);
    const [isActive, setIsActive] = useState(1);
    const [products, setProducts] = useState([]);
    const [formSearch, setFormSearch] = useState({});
    const debouncedSearch = useDebounce(formSearch, 1000);
    const height = 500;

    const getBestSellersProduct = async (formData?: any, event?: any) => {
        try {
            const rest = await productServices.getBestSellersProduct(formSearch, event);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = rest.data.data;
                setProducts(restData);
            }
        } catch (error) {
            console.log(">>>> getBestSellersProduct error: ", error);
        }
    }

    const getProductSales = async (formData?: any, event?: any) => {
        try {
            const rest = await productServices.getProductSales(formSearch, event);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = rest.data.data;
                setProducts(restData);
            }
        } catch (error) {
            console.log(">>>> getProductSales error: ", error);
        }
    }

    const getNewsProduct = async (formData?: any, event?: any) => {
        try {
            const rest = await productServices.getNewsProduct(formSearch, event);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = rest.data.data;
                setProducts(restData);
            }
        } catch (error) {
            console.log(">>>> getNewsProduct error: ", error);
        }
    }
    useEffect(() => {
        if (!debouncedSearch || Object.keys(debouncedSearch).length == 0) {
          return;
        }
        console.log(debouncedSearch);
        const fetchData = async () => {
            if (currentTab == 1) {
                await getBestSellersProduct(formSearch);
            } else if (currentTab == 2) {
                await getNewsProduct(formSearch);
            } else if (currentTab == 3) {
                await getProductSales(formSearch);
            }
        }
        fetchData();
    }, [debouncedSearch]);
    useEffect(() => {
        const fetchData = async () => {
            if (currentTab == 1) {
                await getBestSellersProduct();
            } else if (currentTab == 2) {
                await getNewsProduct();
            } else if (currentTab == 3) {
                await getProductSales();
            }
        }
        fetchData();
    }, [currentTab]);
    const renderFormSearch = (newlist) =>
    {
        if(Object.keys(newlist).length > 0) {
            const form = Object.assign({} , newlist)
            setFormSearch(form)
        }
    }
    return (
        <>
            <section className="product-hometab">
                <div className="home-tab flex-center">
                    <ul className="product-hometabnav__list flex-center">
                        <li className={ isActive === 1 ?
                            "product-hometabnav__item active" : "product-hometabnav__item"}
                            onClick={() => { setCurrentTab(1); setIsActive(1) }}
                        >
                            BÁN CHẠY
                        </li>
                        <li className={ isActive === 2 ?
                            "product-hometabnav__item active" : "product-hometabnav__item"}
                            onClick={() => { setCurrentTab(2); setIsActive(2) }}
                        >
                            SẢN PHẨM MỚI
                        </li>
                        <li className={ isActive === 3 ?
                            "product-hometabnav__item active" : "product-hometabnav__item"}
                            onClick={() => { setCurrentTab(3); setIsActive(3) }}
                        >
                            SẢN PHẨM KHUYẾN MẠI
                        </li>
                    </ul>
                </div>
                {currentTab === 1 && (
                    <HomeTabContent
                        products={products}
                        height={height}
                        formSearch={renderFormSearch}
                        onChangePage={getBestSellersProduct}
                    />
                )}
                {currentTab === 2 && (
                    <HomeTabContent
                        products={products}
                        height={height}
                        formSearch={renderFormSearch}
                        onChangePage={getNewsProduct}
                    />
                )}
                {currentTab === 3 && (
                    <HomeTabContent
                        products={products}
                        height={height}
                        formSearch={renderFormSearch}
                        onChangePage={getProductSales}
                    />
                )}
            </section>
        </>
    );
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
)(HomeTab);