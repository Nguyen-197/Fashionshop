import { Link } from 'react-router-dom';
import YunoLogo from 'src/assets/images/new-folder-image/logo/logo.png';
const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-4">
                            <div className="img wow fadeInUp animated">
                                <Link to="/home">
                                    <img src={YunoLogo} alt="zune-logo" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <h3 className="wow fadeInUp animated">Hệ thống cửa hàng</h3>
                            <ul className="list-unstyled info wow fadeInUp animated">
                                <li>
                                    <i className="fa fa-map-marker"></i>
                                    Hà Nội: 131 Đông Các, Đống Đa
                                    <br />
                                    <i className="fa fa-map-marker"></i>
                                    Hà Nội: Tầng M, Toà nhà B4 Kim Liên, Phạm Ngọc Thạch, Đống Đa
                                    <br />
                                    <i className="fa fa-map-marker"></i>
                                    Đà Nẵng: 65 Nguyễn Văn Linh, Hải Châu 1
                                    <br />
                                    <i className="fa fa-map-marker"></i>
                                    HCM: 411 Võ Văn Tần, P5, Q3
                                    <br />
                                    <i className="fa fa-map-marker"></i>
                                    HCM: The New PlayGround Expand, Center Market Lê Lai, Q.1
                                </li>
                                <li>
                                    <a href="tel:0987654321" title="0987654321">
                                        <i className="fa fa-phone"></i>
                                        0987654321
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:webzune0903@gmail.com" title="webzune0903@gmail.com">
                                        <i className="fa fa-envelope"></i>
                                        yuno.shop@gmail.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <h3 className="wow fadeInUp animated">
                                Theo dõi chúng tôi
                            </h3>
                            <ul className="list-unstyled social wow fadeInUp animated">
                                <li>
                                    <a href="https://www.facebook.com/zunezxvn/" title="Facebook" className="fb" target="_blank">
                                        <i className="fa-brands fa-facebook-square"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com/zune.zx/" title="Instagram" target="_blank">
                                        <img src="https://zunezx.com/public/home/img/icon-isg.png" alt="Instagram" />
                                        {/* <i className="fa-brands fa-instagram-square"></i> */}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.youtube.com/channel/UCklZKNakn7dv4Q8uc4SwpQw?view_as=subscriber" className="yt" title="Youtube" target="_blank">
                                        <i className="fa-brands fa-youtube-square"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://shopee.vn/zunezx" title="Shoppe" target="_blank">
                                        <img src="https://zunezx.com/public/home/img/icon-shopee.png" alt="Shoppe" />
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.tiktok.com/" title="Tiktop" target="_blank">
                                        {/* <i className="fa-brands fa-tiktok"></i> */}
                                        <img src="https://zunezx.com/public/home/img/icon-tiktok.png" alt="Tiktop" />
                                    </a>
                                </li>
                            </ul>
                            {/* <iframe width="364px" height="150px" src="https://www.facebook.com/v2.5/plugins/page.php?adapt_container_width=true&app_id=443271375714375&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df156a87dd00c24c%26domain%3Dzunezx.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fzunezx.com%252Ff3a63c4ec5551c8%26relation%3Dparent.parent&container_width=679&height=150&hide_cover=false&href=https%3A%2F%2Fwww.facebook.com%2Fzunezxvn%2F&locale=en_US&sdk=joey&show_facepile=true&small_header=true&tabs=timeline&width=679" allowFullScreen frameBorder="0"></iframe> */}
                        </div>
                        <div className="col-xs-12 col-sm-12">
                            <div className="copyright">© Copyright 2023 By NguyenNK. All right reserved</div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;