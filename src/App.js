import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Router } from 'react-router-dom';

import Login from './components/login/Login';
import Home from './components/menu/Home';


import './App.css';

function App(){

        const [user, setUser] = React.useState(null);
        const [token, setToken] = React.useState(null);
        const [isLogged, setIsLogged] = React.useState(false);

        useEffect(() => {
            
        }, []);

        const onLogin = (myUser, myToken) => {
            setUser(myUser);
            setToken(myToken);
            setIsLogged(true);

            localStorage.setItem("user", JSON.stringify(myUser));
            localStorage.setItem("token", myToken);

        };

        const onLogout = () => {
            setUser(null);
            setToken(null);
            setIsLogged(false);

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        };

        return (
          
            isLogged ? <Home onLogout={onLogout}  /> : <Login onLogin={onLogin} />

        );
        


        /*
      return (
      <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/home" component={Home} />
        </Switch>
      </BrowserRouter>
      </>
      )
      */
  
}

export default App;
