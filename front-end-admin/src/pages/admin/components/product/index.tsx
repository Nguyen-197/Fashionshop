
import { Switch } from 'react-router-dom';
import MenuPrivateRoute from 'src/components/auth/MenuPrivateRoute';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';
import ProductIndex from './components/product-index';
import ProductAddIndex from './components/product-add-index';
const Routes = ({ match }) => (
  <>
    <Switch>
      <MenuPrivateRoute path={`${match.url}/add`} hasBreadCrumb={true} component={ProductAddIndex} />
      <MenuPrivateRoute path={`${match.url}`} hasBreadCrumb={true} component={ProductIndex} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </>
);

export default Routes;
