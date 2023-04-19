
import { Switch } from 'react-router-dom';
import MenuPrivateRoute from 'src/components/auth/MenuPrivateRoute';
import ErrorBoundaryRoute from 'src/components/error/ErrorBoundaryRoute';
import PageNotFound from 'src/components/error/PageNotFound';

import ColorIndex from './components/color-index';
const Routes = ({ match }) => (
  <>
    <Switch>
      <MenuPrivateRoute path={`${match.url}`} hasBreadCrumb={true} component={ColorIndex} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </>
);

export default Routes;
