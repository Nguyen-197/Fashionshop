import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import BaseLayout from 'src/components/layouts/BaseLayout';
import Banner from './Banner';
import ContentTab from './ContentTab';
import React, { useState } from 'react';
import Product from 'src/components/product';
import { ProductItem } from 'src/models/Product';
import HomeTab from './HomeTab';
type IHomeProps = StateProps & DispatchProps & {
}

const Home = (props: IHomeProps) => {
    return (
        <>
            <BaseLayout>
                <div>
                    <Banner />
                    <ContentTab />
                    <HomeTab />
                </div>
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
