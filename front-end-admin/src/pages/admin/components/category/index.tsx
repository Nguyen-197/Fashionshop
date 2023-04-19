
import { Switch } from 'react-router-dom';
import MenuPrivateRoute from 'src/components/auth/MenuPrivateRoute';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';

import CategoryIndex from './components/category-index';
const Routes = ({ match }) => (
  <>
    <Switch>
      <MenuPrivateRoute path={`${match.url}`} hasBreadCrumb={true} component={CategoryIndex} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </>
);

export default Routes;
