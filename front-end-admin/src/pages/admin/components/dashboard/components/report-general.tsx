import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';
import { CommonUtil } from 'src/utils/common-util';
import BaseDropdownControl from 'src/app/components/BaseDropdownControl';
import { REPORT_DAY } from 'src/@types/constants';
import { Dropdown } from 'primereact/dropdown';
import analyticServices from 'src/services/analytic.services';
import { RESPONSE_TYPE } from 'src/enum';
type IGeneralProps = StateProps & DispatchProps & {
}

const ReportGeneral = (props: IGeneralProps) => {
    const [dayOfTotalReturnOrder, setDayOfTotalReturnOrder] = useState(REPORT_DAY[0].value);
    const [dayOfTotalAmountOrder, setDayOfTotalAmountOrder] = useState(REPORT_DAY[0].value);
    const [dayOfTotalOrder, setDayOfTotalOrder] = useState(REPORT_DAY[0].value);

    const [resultOrder, setResultOrder] = useState(0);
    const [resultAmountOrder, setResultAmountOrder] = useState(0);
    const [resultReturnOrder, setResultReturnOrder] = useState(0);
    useEffect(() => {
        const fetchReport = async () => {
            const response = await analyticServices.reportTotalReturnOrder(dayOfTotalReturnOrder);
            if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = response.data.data;
                setResultReturnOrder(restData?.totalPriceReturn);
            }
        }
        fetchReport();
    }, [dayOfTotalReturnOrder]);

    useEffect(() => {
        const fetchReport = async () => {
            const response = await analyticServices.reportTotalAmountOrder(dayOfTotalAmountOrder);
            if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = response.data.data;
                setResultAmountOrder(restData.totalPrice);
            }
        }
        fetchReport();
    }, [dayOfTotalAmountOrder]);

    useEffect(() => {
        const fetchReport = async () => {
            const fetchReport = async () => {
                const response = await analyticServices.reportTotalOrder(dayOfTotalOrder);
                if (response.data.type == RESPONSE_TYPE.SUCCESS) {
                    const restData = response.data.data;
                    setResultOrder(restData.totalOrder);
                }
            }
            fetchReport();
        }
        fetchReport();
    }, [dayOfTotalOrder]);

    return (
        <>
            <div className="col-4">
                <div className="page-info report-box">
                    <div className="page-info-title">
                        <div className="wrap-text">
                            <p className="jss16962">TRẢ HÀNG</p>
                            <p className="jss16963">
                                <Dropdown
                                    value={dayOfTotalReturnOrder}
                                    options={REPORT_DAY}
                                    optionLabel="name"
                                    optionValue="value"
                                    onChange={(event) => setDayOfTotalReturnOrder(event.value)}
                                />
                            </p>
                        </div>
                        <p className="total-turnover">{ CommonUtil.formatMoney(resultReturnOrder) }</p>
                    </div>
                    <div className="page-info-body">
                        <ul>
                            <li>
                                <i className="fa-solid fa-clipboard-list"></i>
                                <span>Trả hàng theo đơn hàng</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-bag-shopping"></i>
                                <span>Trả hàng theo sản phẩm</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <div className="page-info report-box">
                    <div className="page-info-title">
                        <div className="wrap-text">
                            <p className="jss16962">THANH TOÁN</p>
                            <p className="jss16963">
                                <Dropdown
                                    value={dayOfTotalAmountOrder}
                                    options={REPORT_DAY}
                                    optionLabel="name"
                                    optionValue="value"
                                    onChange={(event) => setDayOfTotalAmountOrder(event.value)}
                                />
                            </p>
                        </div>
                        <p className="total-turnover">{ CommonUtil.formatMoney(resultAmountOrder) }</p>
                    </div>
                    <div className="page-info-body">
                        <ul>
                            <li>
                                <i className="fa-solid fa-calendar-days"></i>
                                <span>Báo cáo thanh toán theo thời gian</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-users-rectangle"></i>
                                <span>Báo cáo thanh toán theo nhân viên</span>
                            </li>
                            <li>
                                <i className="fa-brands fa-cc-amazon-pay"></i>
                                <span>Báo cáo theo phương thức thanh toán</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <div className="page-info report-box">
                    <div className="page-info-title">
                        <div className="wrap-text">
                            <p className="jss16962">Đơn hàng</p>
                            <p className="jss16963">
                                <Dropdown
                                    value={dayOfTotalOrder}
                                    options={REPORT_DAY}
                                    optionLabel="name"
                                    optionValue="value"
                                    onChange={(event) => setDayOfTotalOrder(event.value)}
                                />
                            </p>
                        </div>
                        <p className="total-turnover">{ resultOrder }</p>
                    </div>
                    <div className="page-info-body">
                        <ul>
                            <li>
                                <i className="fa-solid fa-clipboard-list"></i>
                                <span>Trả hàng theo đơn hàng</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-bag-shopping"></i>
                                <span>Trả hàng theo sản phẩm</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = ({ locale }: IRootState) => ({
    currentLocale: locale.currentLocale,
});

const mapDispatchToProps = {
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportGeneral);
