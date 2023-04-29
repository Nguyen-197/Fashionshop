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
type INewsProps = StateProps & DispatchProps & {
}

const News = (props: INewsProps) => {
    const [newsContentItem, setnNewsContentItem] = useState([]);
    useEffect(() => {
        const dataNew = [
            {
                id: 1,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 2,
                title: "END OF SEASON SALE JUNOXMISOA",
                content: "SĂN JUNO END OF SEASON SALE CÙNG HOT BLOGGER MISOA – GIẢM THÊM TRÊN GIÁ ĐÃ GIẢMJuno tặng 500 mã...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 3,
                title: "END OF SEASON SALE JUNOXPHUONGHA",
                content: "SĂN JUNO END OF SEASON SALE CÙNG HOT BLOGGER PHƯƠNG HÀ – GIẢM THÊM TRÊN GIÁ ĐÃ GIẢMJuno tặng 500..",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 4,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 5,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 6,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 7,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 8,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 9,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 10,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 11,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 12,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 13,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            },
            {
                id: 14,
                title: "THÔNG BÁO VỀ VIỆC ÁP DỤNG THUẾ GTGT 8%",
                content: "Quý khách hàng thân mến,Theo Nghị Quyết 43/2022/QH15 về việc giảm 2% thuế suất thuế Giá Trị Gia Tăng (“GTGT”)...",
                image: "https://file.hstatic.net/1000003969/article/end-of-season-sale-kv-700x450_e4e47de3b8da4cb0a98e44249ca06574_deb37ddc21f543e8ba1e9b5fd29165b6_large.jpg"
            }
        ]
        setnNewsContentItem(dataNew);
    }, [])

    return (
        <>
            <BaseLayout>
                <div className='news-page mt-60'>
                    <div className="container-fluid clearfix">
                        <div className='news col-12 row'>
                            {
                                newsContentItem.map(item => {
                                    return (
                                        <div className="item-normal col-6">
                                            <div className="item-normal--inner d-flex align-items-center justify-content-between">
                                                <div className="item-normal--image">
                                                    <a href="#">
                                                        <img src={item.image} alt={item.title}></img>
                                                    </a>
                                                </div>
                                                <div className="item-normal--content">
                                                    <h3>
                                                        <a href="#">{item.title}</a>
                                                    </h3>
                                                    <p>{item.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
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
)(News);
