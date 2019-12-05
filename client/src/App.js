import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import Welcome from './pages/welcome';
import Login from './pages/login';
import store from './store';
import './App.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/login' component={Login}></Route>
            <Route path='/' component={Welcome}></Route>
          </Switch>
        </BrowserRouter>
      </Provider >
    );
  }
}

export default App