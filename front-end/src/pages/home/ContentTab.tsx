import { connect } from "react-redux";
import { IRootState } from 'src/reducers';
import { Link } from 'react-router-dom';
import Content_1 from 'src/assets/images/new-folder-image/preview-image/cam.webp';
import Content_2 from 'src/assets/images/new-folder-image/preview-image/hong_1.jpeg';
import Content_3 from 'src/assets/images/new-folder-image/preview-image/hong_2.webp';
import Content_4 from 'src/assets/images/new-folder-image/preview-image/kem.webp';
import Content_5 from 'src/assets/images/new-folder-image/preview-image/xanh-dam.webp';

type IContentTabProps = StateProps & DispatchProps & {
}
const ContentTab = (props: IContentTabProps) => {
    return (
        <>
            <section className="style-news">
                <div className="style-news-content-wrapper">
                    <p className="eyebrow"></p>
                    <div className="style-news-header">
                        <h2 className="title">Sản Phẩm</h2>
                    </div>
                    <p className="eyebrow"></p>
                    <section className="style-news-content">
                        <div className="items-wrapper d-flex">
                            <div className="col-4">
                                <div className="style-news-item normal-item">
                                    <div className="image-wrapper">
                                        <Link to="/home">
                                            <img className="lazy" src={Content_1} alt="Content_1" />
                                        </Link>
                                    </div>
                                    <h3 className="title">Leather Bucket</h3>
                                    <div className="link">
                                        <Link to="/home">
                                            By Alessandro Michele and Harry Styles
                                            <i className="fa-solid fa-chevron-right"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="style-news-item normal-item">
                                    <div className="item-inner-wrapper">
                                        <div className="image-wrapper">
                                            <Link to="/home">
                                                <img className="lazy" src={Content_2} alt="Content_2" />
                                            </Link>
                                        </div>
                                        <h3 className="title">Hikaru Pant</h3>
                                        <div className="link">
                                            <Link to="/home">
                                                By Alessandro Michele and Harry Styles
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="style-news-item featured-item proportional-height col-4">
                                <div className="item-inner-wrapper">
                                    <div className="image-wrapper-proportional-height">
                                        <div className="image-wrapper">
                                            <Link to="/home">
                                                <img height="600px" className="lazy" src={Content_3} alt="Content_3" />
                                            </Link>
                                        </div>
                                        <h3 className="title">Culture Wind-breaker - White</h3>
                                        <div className="link">
                                            <Link to="/home">
                                                By Alessandro Michele and Harry Styles
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="style-news-item normal-item">
                                    <div className="image-wrapper">
                                        <Link to="/home">
                                            <img className="lazy" src={Content_4} alt="Content_4" />
                                        </Link>
                                    </div>
                                    <h3 className="title">Kami Croptop</h3>
                                    <div className="link">
                                        <Link to="/home">
                                            By Alessandro Michele and Harry Styles
                                            <i className="fa-solid fa-chevron-right"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="style-news-item normal-item">
                                    <div className="item-inner-wrapper">
                                        <div className="image-wrapper">
                                            <Link to="/home">
                                                <img className="lazy" src={Content_5} alt="Content_5" />
                                            </Link>
                                        </div>
                                        <h3 className="title">Raw Sude Shirt</h3>
                                        <div className="link">
                                            <Link to="/home">
                                                By Alessandro Michele and Harry Styles
                                                <i className="fa-solid fa-chevron-right"></i>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
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
)(ContentTab);