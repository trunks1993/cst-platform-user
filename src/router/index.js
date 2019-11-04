import React from 'react';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import AuthRoute from './authRoute';
// import { UserContext } from '@/utils/contexts';

import LoginPage from '@/pages/loginPage';
import Layout from '@/pages/layout';
import Page404 from '@/pages/page404';
import Dashboard from '@/pages/dashboard';
import Home from '@/pages/home';

export default () => (
  <HashRouter>
    <Switch>
      <AuthRoute exact path="/login" authTo="/" component={LoginPage} />
      <AuthRoute path="/platForm" authTo="/login" component={Layout} />
      <Redirect exact from="/" to='/platForm/home' />
      <Route component={Page404} />
    </Switch>
  </HashRouter>
);

export const RouteList = () => {
  return (
    <Switch>
      <Route path="/platForm/home" component={Home} />
      <Route path="/platForm/config" component={Dashboard} />
      <Route component={Page404} />
    </Switch>
  );
};

