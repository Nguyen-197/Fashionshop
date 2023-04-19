import { connect } from 'react-redux';
import { IRootState } from 'src/reducers';
import ReportAnalyticDelivery from './report-analytic-delivery';
import ReportAnalyticTurnover from './report-analytic-turnover';
import ReportGeneral from './report-general';
type IAnalyticsIndexProps = StateProps & DispatchProps & {
}

const AnalyticsIndex = (props: IAnalyticsIndexProps) => {
    return (
        <>
            <section className="content">
                <div className="row analytic-chart">
                    <div className="col-6">
                        <ReportAnalyticTurnover />
                    </div>
                    <div className="col-6">
                        <ReportAnalyticDelivery />
                    </div>
                    <ReportGeneral />
                </div>
            </section>
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
)(AnalyticsIndex);
