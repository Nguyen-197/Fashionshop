import { RouteComponentProps, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import ErrorBoundary from './components/error/ErrorBoundary';
import { IRootState } from './reducers';
import ToastMsg from './components/toast/toast-msg';
import Preloading from 'src/components/layouts/Preloading';
import { ConfirmDialog } from 'primereact/confirmdialog';
import AppRouters from 'src/routers';
import './config/locale-validator';
import { UserProvider } from './context/user';
import { CartProvider } from './context/cart';
import { ScrollTop } from 'primereact/scrolltop';
type IAppProps = StateProps & DispatchProps & RouteComponentProps & {
    history?: any | undefined;
    location?: any | undefined;
    match?: any | undefined;
    staticContext?: any;
}
export const App = (props: IAppProps) => {
    return (
        <UserProvider>
            <CartProvider>
                <BrowserRouter>
                    <>
                        <div className={`app-container`}>
                            <ErrorBoundary>
                                <AppRouters />
                            </ErrorBoundary>
                        </div>
                        <ConfirmDialog />
                        <ToastMsg />
                        {
                            props.isLoading && <div className="wrap-loading">
                                <Preloading />
                            </div>
                        }
                        <ScrollTop threshold={800} />
                    </>
                </BrowserRouter>
            </CartProvider>
        </UserProvider>
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

