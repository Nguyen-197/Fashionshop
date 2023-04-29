import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import HomeTabContent from 'src/pages/home/HomeTabContent';
import BaseLayout from 'src/components/layouts/BaseLayout';
import productServices from "src/services/product.services";
import categoryServices from "src/services/category.services";
import { RESPONSE_TYPE } from "src/@types/enums";
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
type IHomeProps = StateProps & DispatchProps & {
}

const Home = (props: IHomeProps) => {
    const { search } = useLocation();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({name:''});
    const [formSearch, setFormSearch] = useState({});
    const code = new URLSearchParams(search).get('code');
    const height = 500;
    const getAllProductByCategory = async (formData?: any, event?: any) => {
        try {
            const rest = await productServices.search(formData, event);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = rest.data.data;
                setProducts(restData);
            }
        } catch (error) {
            console.log(">>>> getAllProductByCategory error: ", error);
        }
    }
    const findByCode = async (code?: any) => {
        try {
            const rest = await categoryServices.findByCode(code);
            console.log(">>>rest", rest);
            
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = rest.data.data;
                setCategory(restData);
            }
        } catch (error) {
            console.log(">>>> findByCode error: ", error);
        }
    }
    useEffect(() => {
        if(code) {
            const form = {
                listProductCategory:[code]
            }
            getAllProductByCategory(form)
            findByCode(code)
        }
    }, [code]);
    useEffect(() => {
        if(code) {
            const form = {
                listProductCategory:[code]
            }
            getAllProductByCategory(form)
        }
    }, [code]);
    const renderFormSearch = (newlist) =>
    {
        if(Object.keys(newlist).length > 0) {
            const form = Object.assign({} , newlist)
            setFormSearch(form)
        }
    }
    return (
        <>
            <BaseLayout>
                <section id='sectionCategory' className='mt-60'>
                    <div className="container-fluid" style={{padding: '50px'}}>
                        <div className="heading-title text-center">
                            <h1>{category.name}</h1>
                        </div>
                        <HomeTabContent
                            products={products}
                            height={height}
                            formSearch={renderFormSearch}
                            // onChangePage={getBestSellersProduct}
                        />
                    </div>
                </section>
            </BaseLayout>
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
)(Home);
