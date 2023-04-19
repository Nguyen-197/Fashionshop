import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';
import analyticServices from 'src/services/analytic.services';
import { RESPONSE_TYPE } from 'src/constants/constants';
import { STATUS_ORDER } from 'src/enum';
import _ from 'lodash';
import { REPORT_DAY } from 'src/@types/constants';
import { Dropdown } from 'primereact/dropdown';
type IAnalyticDeliveryProps = StateProps & DispatchProps & {
}

const ReportAnalyticDelivery = (props: IAnalyticDeliveryProps) => {
    const [dayOfMonth, setDayOfMonth] = useState(REPORT_DAY[0].value);
    const [chartData, setChartData] = useState({
        labels: ['Chờ xác nhận', 'Đang giao', 'Đã giao hàng', 'Hủy đơn hàng'],
        datasets: [
            {
                data: [0,0,0,0],
                backgroundColor: [
                    "#36A2EB",
                    "#FFCE56",
                    "#0db473",
                    "#FF6384",

                ],
                hoverBackgroundColor: [
                    "#36A2EB",
                    "#FFCE56",
                    "#26cd8c",
                    "#FF6384",
                ],
                hoverBorderColor: [
                    "#C2ECDC",
                    "#C2ECDC",
                    "#C2ECDC",
                    "#C2ECDC",
                ],
                hoverBorderWidth: [
                    "5",
                    "5",
                    "5",
                    "5",
                ]
            }]
    });

    const [lightOptions] = useState({
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        }
    });

    const reportStatusOrder = async () => {
        try {
            const rest = await analyticServices.reportStatusOrder(dayOfMonth);
            if (rest.data.type == RESPONSE_TYPE.SUCCESS) {
                const restData = rest.data.data;
                console.log(">>>> restData: ", restData);
                chartData.datasets[0].data[0] = restData[STATUS_ORDER.ORDER]?.countStatus;
                chartData.datasets[0].data[1] = restData[STATUS_ORDER.DELIVERING]?.countStatus;
                chartData.datasets[0].data[2] = restData[STATUS_ORDER.COMPLETE_ORDER]?.countStatus;
                chartData.datasets[0].data[3] = restData[STATUS_ORDER.CANCEL_ORDER]?.countStatus;
                setChartData(_.cloneDeep(chartData));
            }
        } catch (error) {
            console.log(">>>> error: ", error);
        }
    }

    useEffect(() => {
        reportStatusOrder();
    }, [dayOfMonth]);

    return (
        <>
            <div className="page-info">
                <div className="page-info-title">
                    <div className="wrap-text">
                        <p className="jss16962">Thông tin giao hàng</p>
                        <p className="jss16963">
                            <Dropdown
                                value={dayOfMonth}
                                options={REPORT_DAY}
                                optionLabel="name"
                                optionValue="value"
                                onChange={(event) => setDayOfMonth(event.value)}
                            />
                        </p>
                    </div>
                </div>
                <div className="page-info-body">
                    <Chart type="doughnut" style={{ position: 'relative', width: '50%' }} data={chartData} options={lightOptions} />
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
)(ReportAnalyticDelivery);
