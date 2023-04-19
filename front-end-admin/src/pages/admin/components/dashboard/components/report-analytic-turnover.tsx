import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import { Chart } from 'primereact/chart';
import { useState } from 'react';
import { CommonUtil } from 'src/utils/common-util';
type IAnalyticTurnoverProps = StateProps & DispatchProps & {
}

const ReportAnalyticTurnover = (props: IAnalyticTurnoverProps) => {
    const [chartData] = useState({
        labels: ['21/08', '22/08', '23/08', '24/08', '25/08', '26/08', '27/08'],
        datasets: [{
            type: 'line',
            label: 'Lợi nhuận',
            borderColor: '#42A5F5',
            borderWidth: 2,
            fill: false,
            tension: .4,
            data: [
                50,
                25,
                12,
                48,
                56,
                76,
                42
            ]
        }, {
            type: 'bar',
            label: 'Doanh thu',
            backgroundColor: '#66BB6A',
            data: [
                21,
                84,
                24,
                75,
                37,
                65,
                34
            ],
            borderColor: 'white',
            borderWidth: 2
        }]
    });

    const [lightOptions] = useState({
        maintainAspectRatio: false,
        aspectRatio: .6,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    })

    return (
        <>
            <div className="page-info">
                <div className="page-info-title">
                    <div className="wrap-text">
                        <p className="jss16962">Danh thu cửa hàng</p>
                        <p className="jss16963">7 ngày qua</p>
                    </div>
                    <p className="total-turnover">{ CommonUtil.formatMoney(12712222) }</p>
                </div>
                <div className="page-info-body">
                    <Chart type="bar" data={chartData} options={lightOptions} />
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
)(ReportAnalyticTurnover);
