import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import BaseLayout from 'src/components/layouts/BaseLayout';
import Map from '../../components/map/index'
type IContactProps = StateProps & DispatchProps & {
}

const Contact = (props: IContactProps) => {
    const key = 'AIzaSyBXvoX_6UAb-P3yvewqAYcow1_8E6qW0zE';
    return (
        <>
            <BaseLayout>
                <div className='contact-page mt-60'>
                    <div className="container-fluid clearfix">
                        <div className="row">
                            <div className="col-md-6 col-sm-12 col-xs-12 box-heading-contact">
                                <Map/>
                            </div>
                            <div className="col-md-6 col-sm-12 col-xs-12 wrapbox-content-page-contact">
                                <div className="header-page-contact clearfix">
                                    <h1>Liên hệ</h1>
                                </div>
                                <div className="box-info-contact">
                                    <ul className="list-info">
                                        <li>
                                            <p>Địa chỉ chúng tôi</p>
                                            <p><strong>số 16 LK41 KĐT Vân Canh - Hoài Đức - Hà Nội</strong></p>
                                        </li>
                                        <li>
                                            <p>Email chúng tôi</p>
                                            <p><strong>cskh@yuno.vn</strong></p>
                                        </li>
                                        <li>
                                            <p>Điện thoại</p>
                                            <p><strong>1800 1162</strong></p>
                                        </li>
                                        <li>
                                            <p>Thời gian làm việc</p>
                                            <p><strong>Thứ 2 đến Thứ 6 từ 8h30 đến 17h30</strong></p>
                                        </li>
                                    </ul>
                                </div>  
                                <div className="box-send-contact">
                                    <h2>Gửi thắc mắc cho chúng tôi</h2>
                                    <div>
                                        <div className="contact-form">
                                            <div className="row">
                                                <div className="col-sm-12 col-xs-12">
                                                    <div className="input-group">
                                                        <input placeholder='Tên của bạn' type="text" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-xs-12">
                                                    <div className="input-group">
                                                        <input placeholder='Email của bạn' type="text" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-xs-12">
                                                    <div className="input-group">
                                                        <input placeholder='Số điện thoại của bạn' type="text" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-xs-12">
                                                    <div className="input-group">
                                                        <textarea placeholder='Nội dung' cols={30} rows={40}></textarea>
                                                    </div>
                                                </div>
                                                <div className="col-sm-12">
                                                    <button className='button dark'>Gửi cho chúng tôi</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
)(Contact);
