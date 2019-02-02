import React, { Component } from 'react';
import NavBar from './components/nav';
import Dispute from './components/disputes';
import Search from './components/search';
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import './App.css';
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Switch>
            <Route exact path='/' component={Dispute}/>
            <Route path='/dispute' component={Dispute} />
            <Route path = "/search" component = {Search} />
            <Route path='/dispute_by_start_time/:start_time' component={Dispute} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
