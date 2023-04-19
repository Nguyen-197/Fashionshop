import { RouteComponentProps, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import ErrorBoundary from './components/error/ErrorBoundary';
import AppRoutes from './routes/app-routes';
import './config/locale-validator';
import { IRootState } from './reducers';
import ToastMsg from './components/toast/toast-msg';
import ReactTooltip from 'react-tooltip';
import { ToastContainer } from 'react-toastify';
import { WaveLoading } from 'react-loadingg';
import { ConfirmDialog } from 'primereact/confirmdialog';
type IAppProps = StateProps & DispatchProps & RouteComponentProps & {
    history?: any | undefined;
    location?: any | undefined;
    match?: any | undefined;
    staticContext?: any;
}

export const App = (props: IAppProps) => {
    return (
        <BrowserRouter>
            <>
                <div className={`app-container`}>
                    <ErrorBoundary>
                        <AppRoutes />
                    </ErrorBoundary>

                </div>
                <ConfirmDialog />
                <ToastMsg />
                <ReactTooltip place="bottom" effect="solid" />
                {
                    props.isLoading && <div className="wrap-loading">
                        <WaveLoading />
                    </div>
                }
            </>
        </BrowserRouter>
    );
};

const mapStateToProps = ({ locale, authentication }: IRootState) => ({
    currentLocale: locale.currentLocale,
    isLoading: authentication.isLoading,
    isAuthenticated: authentication.isAuthenticated,
});


const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(hot(module)(App));

