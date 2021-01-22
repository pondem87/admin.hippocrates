import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainNav from './components/shared/mainNav';
import SignIn from './components/auth/signIn';
import ProtectedRoute from './components/shared/protectedRoute';
import Home from './components/home/home';
import MainFooter from './components/shared/mainFooter';
import Users from './components/users/users';
import Reset from './components/auth/reset';

function App() {
  return (
    <div>
      <BrowserRouter>
        <MainNav />
        <div className="container mb-3">
          <Switch>
            <ProtectedRoute exact path='/' component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route path="/reset" component={Reset} />
            <ProtectedRoute path='/users' component={Users} />
            <ProtectedRoute component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
      <MainFooter />
    </div>
  );
}

export default App;
