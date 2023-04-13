import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import initStore from './store';
import { bindActionCreators } from 'redux';
import { clearAuthentication } from './reducers/authentication';
import ErrorBoundary from 'src/components/error/ErrorBoundary';
import { registerLocale } from 'src/config/translation';
import Devtools from './components/devtools/Devtools';
import setupAxiosInterceptors from 'src/config/axios-interceptor';

import './assets/css/animation.css';
import './index.css';
import './assets/boxicons-2.1.2/css/animations.css';
import './assets/boxicons-2.1.2/css/transformations.css';
import './assets/boxicons-2.1.2/css/boxicons.css';
import './assets/boxicons-2.1.2/css/boxicons.min.css';
import './assets/css/bootstrap.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/scss/main.scss';
import './App.css';

const devTools = process && process.env.NODE_ENV === 'development' ? <Devtools /> : null;

const rootEl = document.getElementById('root');
const root = createRoot(rootEl as HTMLElement);

export const store = initStore();
registerLocale(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

const render = (Component: any) =>
  // eslint-disable-next-line react/no-render-return-value
    root.render(
        <ErrorBoundary>
            <Provider store={store}>
                {/* If this slows down the app in dev disable it and enable when required  */}
                {devTools}
                <Component />
            </Provider>
        </ErrorBoundary>
    );

render(App);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
