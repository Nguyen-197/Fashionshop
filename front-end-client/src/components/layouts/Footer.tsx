import { Link } from 'react-router-dom';
import { useState } from "react";
import YunoLogo from 'src/assets/images/new-folder-image/logo/logo.png';
const Footer = () => {
    const [isCollapse, setIsCollapse] = useState(false);
    const onCollapse = () => {
        setIsCollapse(!isCollapse)
    }
    return (
        <>  
            <section id='sectionInfoFooter'>
                <div className="container-fluid clearfix">
                    <div className="innerInfoFooter clearfix row">
                        <div className="col-xs-12 col-sm-4 site-animation">
                            <h4>GỌI MUA HÀNG ONLINE (08:00 - 21: 00 mỗi ngày)</h4>
                            <div className="infoContent">
                                <p>
                                    <span className="titleHotline">
                                        <a href="tel:1800 1162" className="linkHotline">1800 1162</a>
                                    </span>
                                    <span className="moreInfoFooter">
                                        Tất cả các ngày trong tuần (Trừ tết Âm Lịch)
                                    </span>
                                </p>
                            </div>
                            <h4 className="xxx">
                                GÓP Ý & KHIẾU NẠI (08:30 - 20:30)
                            </h4>
                            <div className="infoContent">
                                <p>
                                    <span className="titleHotline">
                                        <a href="tel:1800 1160" className="linkHotline">1800 1160</a>
                                    </span>
                                    <span className="moreInfoFooter">
                                        Tất cả các ngày trong tuần (Trừ tết Âm Lịch)
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4 site-animation">
                            <h4>HỆ THỐNG SHOWROOM</h4>
                            <ul><a href="#" className="link-showroom-home"><img src="https://file.hstatic.net/1000003969/file/chikh_ce44b1a9f11b4cbda1d4d319967d7932.jpg" alt="Store" /></a></ul>
                        </div>
                        <div className="col-xs-12 col-sm-4 site-animation">
                            <h4>FANPAGE CỦA CHÚNG TÔI</h4>
                            <ul><a href="#" className="link-showroom-home"><img src="https://file.hstatic.net/1000003969/file/700x330_bedaf891aac94104956f15c7e8f199b1.jpg" alt="Page" /></a></ul>
                        </div>
                    </div>
                </div>
            </section>
            <footer id='footerBottom' className="clearfix">
                <div className="container-fluid clearfix">
                    <div className="innerInfoFooter row">
                        <div className="col-xs-12 col-sm-4">
                            <h4  onClick={onCollapse}>HỖ TRỢ KHÁCH HÀNG</h4>
                            <ul style={{display: isCollapse ? 'block' : 'none'}}>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Hướng dẫn chọn cỡ giày
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Chính sách đổi trả
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Thanh toán giao nhận
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Câu hỏi thường gặp
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Chính sách bảo mật
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Chính sách khách hàng thân thiết
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Hướng dẫn mua hàng Online
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <h4  onClick={onCollapse}>VỀ YUNO</h4>
                            <ul style={{display: isCollapse ? 'block' : 'none'}}>
                            <li>
                                    <a href="#" className="link-bottom">
                                        Liên hệ
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Giới thiệu
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Tin tức Yuno
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Thông tin thời trang
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="link-bottom">
                                        Cơ hội làm việc tại Yuno
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;