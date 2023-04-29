import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import BaseLayout from 'src/components/layouts/BaseLayout';
import Banner from './Banner';
import ContentTab from './ContentTab';
import React, { useState } from 'react';
import Product from 'src/components/product';
import { ProductItem } from 'src/models/Product';
import HomeTab from './HomeTab';
import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css';  
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
                    <div className="container-fluid">
                        <div className="heading-title text-center">
                            <h2>Bộ Sưu Tập</h2>
                        </div>
                    </div>
                    <div id="collection-slider">
                        <OwlCarousel className='owl-theme' navText={['','']}  stagePadding={200} items={1} center touchDrag={false} autoplay pullDrag={false} loop margin={40} nav>
                            <div className='item position-relative'>
                                <div className="videoWrapper">
                                    <a href="https://juno.vn/collections/imperfect-perfection-collection">
                                        <iframe width="100%" src="https://www.youtube.com/embed/kWSux5Nw_LI?autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=kWSux5Nw_LI&amp;controls=0&amp;showinfo=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                                    </a>
					            </div>
                                <div className="div-collection-slide">
                                    <a href="https://juno.vn/collections/imperfect-perfection-collection" className="title-collection-slide">
                                        IMPERFECT PERFECTION
                                    </a>
                                    <p className="des-collection-slide">
                                        Một năm 2020 không hoàn hảo, với thật nhiều thử thách, vụn vỡ cuối cùng đã sắp qua đi. Đã đến lúc nàng được nâng ly chúc mừng cho tinh thần mạnh mẽ, lạc quan của bản thân 
                                    </p>
                                    <a className="action-btn-link" data-eventlabel="IMPERFECT PERFECTION" href="https://juno.vn/collections/imperfect-perfection-collection">
                                        <button className="action-btn-collection">
                                            KHÁM PHÁ NGAY
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div className='item position-relative'>
                                <div className="videoWrapper">
                                    <a href="https://juno.vn/collections/imperfect-perfection-collection">
                                        <iframe width="100%" src="https://www.youtube.com/embed/kWSux5Nw_LI?autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=kWSux5Nw_LI&amp;controls=0&amp;showinfo=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                                    </a>
					            </div>
                                <div className="div-collection-slide">
                                    <a href="https://juno.vn/collections/imperfect-perfection-collection" className="title-collection-slide">
                                        IMPERFECT PERFECTION
                                    </a>
                                    <p className="des-collection-slide">
                                        Một năm 2020 không hoàn hảo, với thật nhiều thử thách, vụn vỡ cuối cùng đã sắp qua đi. Đã đến lúc nàng được nâng ly chúc mừng cho tinh thần mạnh mẽ, lạc quan của bản thân 
                                    </p>
                                    <a className="action-btn-link" data-eventlabel="IMPERFECT PERFECTION" href="https://juno.vn/collections/imperfect-perfection-collection">
                                        <button className="action-btn-collection">
                                            KHÁM PHÁ NGAY
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div className='item position-relative'>
                                <div className="videoWrapper">
                                    <a href="https://juno.vn/collections/imperfect-perfection-collection">
                                        <iframe width="100%" src="https://www.youtube.com/embed/kWSux5Nw_LI?autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=kWSux5Nw_LI&amp;controls=0&amp;showinfo=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                                    </a>
					            </div>
                                <div className="div-collection-slide">
                                    <a href="https://juno.vn/collections/imperfect-perfection-collection" className="title-collection-slide">
                                        IMPERFECT PERFECTION
                                    </a>
                                    <p className="des-collection-slide">
                                        Một năm 2020 không hoàn hảo, với thật nhiều thử thách, vụn vỡ cuối cùng đã sắp qua đi. Đã đến lúc nàng được nâng ly chúc mừng cho tinh thần mạnh mẽ, lạc quan của bản thân 
                                    </p>
                                    <a className="action-btn-link" data-eventlabel="IMPERFECT PERFECTION" href="https://juno.vn/collections/imperfect-perfection-collection">
                                        <button className="action-btn-collection">
                                            KHÁM PHÁ NGAY
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div className='item position-relative'>
                                <div className="videoWrapper">
                                    <a href="https://juno.vn/collections/imperfect-perfection-collection">
                                        <iframe width="100%" src="https://www.youtube.com/embed/kWSux5Nw_LI?autoplay=1&amp;mute=1&amp;loop=1&amp;playlist=kWSux5Nw_LI&amp;controls=0&amp;showinfo=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                                    </a>
					            </div>
                                <div className="div-collection-slide">
                                    <a href="https://juno.vn/collections/imperfect-perfection-collection" className="title-collection-slide">
                                        IMPERFECT PERFECTION
                                    </a>
                                    <p className="des-collection-slide">
                                        Một năm 2020 không hoàn hảo, với thật nhiều thử thách, vụn vỡ cuối cùng đã sắp qua đi. Đã đến lúc nàng được nâng ly chúc mừng cho tinh thần mạnh mẽ, lạc quan của bản thân 
                                    </p>
                                    <a className="action-btn-link" data-eventlabel="IMPERFECT PERFECTION" href="https://juno.vn/collections/imperfect-perfection-collection">
                                        <button className="action-btn-collection">
                                            KHÁM PHÁ NGAY
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </OwlCarousel>
                    </div>
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
