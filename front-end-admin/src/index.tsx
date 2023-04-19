import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import initStore from './store';
import { bindActionCreators } from 'redux';
import { clearAuthentication } from './reducers/authentication';
import ErrorBoundary from './components/error/ErrorBoundary';
import { registerLocale } from './config/translation';
import Devtools from './components/devtools/Devtools';
import setupAxiosInterceptors from './config/axios-interceptor';


import './index.css';
import './app/content/css/flags.css';
import './app/content/css/layout.css';
import './app/content/css/themes.css';
import './app/content/boxicons-2.1.2/css/animations.css';
import './app/content/boxicons-2.1.2/css/transformations.css';
import './app/content/boxicons-2.1.2/css/boxicons.css';
import './app/content/boxicons-2.1.2/css/boxicons.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app/content/css/bootstrap.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './assets/boxicons-2.1.2/css/boxicons.css';
import './assets/boxicons-2.1.2/css/boxicons.min.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/fontawesome-free-6.1.1-web/css/all.min.css';

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
