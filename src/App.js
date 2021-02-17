import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainNav from './components/shared/mainNav';
import SignIn from './components/auth/signIn';
import ProtectedRoute from './components/shared/protectedRoute';
import Home from './components/home/home';
import MainFooter from './components/shared/mainFooter';
import Users from './components/users/users';
import Reset from './components/auth/reset';
import UserDetails from './components/userDetails/userDetails';
import Loader from './components/shared/loader';
import { UserContext } from './context/userContext';
import { checkToken } from './functions/auth';
import Requests from './components/requests/requests';
import Services from './components/services/services';
import Chat from './components/chat/chat';
import Uploads from './components/uploads/uploads';

function App() {
  const {login, logout} = useContext(UserContext);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLogInStatus();
  },[])

  const checkLogInStatus = async() => {
    let jwt = localStorage.getItem('jwt');
    if (jwt) {
      //verify token and sign in
      try {
        let admin = await checkToken(jwt);
        login(admin);
      } catch (error) {
        console.log("Token verification failed")
      } finally {
        setLoading(false);
      }

    } else {
      //continue without sign in
      setLoading(false);
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <BrowserRouter>
        <MainNav logout={logout} />
        <div className="container mb-3">
          <Switch>
            <ProtectedRoute exact path='/' component={Home} />
            <Route path="/signin" component={SignIn} />
            <Route path="/reset" component={Reset} />
            <ProtectedRoute path='/users' component={Users} />
            <ProtectedRoute path='/userdetails/:iduser' component={UserDetails} />
            <ProtectedRoute path='/uploads' component={Uploads} />
            <ProtectedRoute path='/requests' component={Requests} />
            <ProtectedRoute path='/services' component={Services} />
            <ProtectedRoute path='/chat' component={Chat} />
            <ProtectedRoute component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
      <MainFooter />
    </div>
  );
}

export default App;
