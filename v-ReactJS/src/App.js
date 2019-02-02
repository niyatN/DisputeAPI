import React, { Component } from 'react';
import NavBar from './components/nav';
import Dispute from './components/disputes';
import Search from './components/search';
import {Route, BrowserRouter, Switch} from 'react-router-dom';
import './App.css';
import axios from'axios';
import keys from './config/keys';
import DisputeInsight from './components/dispute_insight';
import Test from './components/readFileTest';

class App extends Component {
  state={
    access_token:sessionStorage.getItem('access_token')||null,
    client_id:'',
    secret:'',
    divFlag:'form'
  }
  componentDidMount(){
    // let data = {'grant_type':'client_credentials'};
    console.log(keys.authorization.Authorization_key);
    // let data = {
    //   "response_type":"token",
    //   "grant_type":"password",
    //   "email": keys.keys.client_id,     //{email_address}
    //   "password":keys.keys.secret,
    //   "redirect_uri":"http://localhost:3000/"
    // }
    // this.getAccessToken();
  }

  getAccessToken = (e)=>{
    e.preventDefault();
    axios({
      method: 'post',
      headers: {
        "content-type" : "application/x-www-form-urlencoded",
        "Authorization":"Basic "+btoa(this.state.client_id+":"+this.state.secret) //keys.authorization.Authorization_key
        // "Authorization":"Basic "+btoa(keys.credential.client_id+":"+keys.credential.secret) //keys.authorization.Authorization_key
    
        },
      url: "https://api.sandbox.paypal.com/v1/oauth2/token",
      data: "grant_type=client_credentials&response_type=token&return_authn_schemes=true" //qs.stringfy(data)
      
    })
    .then((res)=>{
      sessionStorage.setItem('access_token', res.data.access_token);
      this.setState({access_token:res.data.access_token, divFlag:'not-form'});
      console.log(res.data);
    })
    .catch((err)=>{
      console.log(err.response.data);
      alert(err.response.data.error_description);

    });
  }

  handleChange=(e)=>{
    this.setState({[e.target.id]:e.target.value});
    console.log(this.state)
  }

  
  render() {
    console.log(sessionStorage.getItem('access_token'));
    return (
      
      <BrowserRouter>
      
        
      
        <div className="App">
          <NavBar />

          {/* Form Start */}
          {/* <div className="row z-depth-3">
            <form className="col s12 m4 l4 offset-s0 offset-l4 offset-m4 card" onSubmit={this.getAccessToken}>
            <div class="input-field col s12">
              <input id="client_id" type="text" class="validate" required="required" onChange={this.handleChange}/>
              <label for="client_id">Client ID</label>
            </div>
            <div class="input-field col s12">
              <input id="secret" type="text" class="validate" required="required" onChange={this.handleChange} />
              <label for="secret">Client Secret</label>
            </div>
            <div className="col s2 send_icon">
                    <button className="btn waves-effect waves-light" type="submit" >Get Access Token</button>
                </div>
            </form>

          </div> */}
          {/* Form end */}
          {
            (this.state.divFlag==='form')?(
              
              <div className="row ">
                <form className="col s12 m4 l4 offset-s0 offset-l4 offset-m4 card z-depth-3" onSubmit={this.getAccessToken}>
                <div class="input-field col s12">
                  <input id="client_id" type="text" class="validate" required="required" onChange={this.handleChange}/>
                  <label for="client_id">Client ID</label>
                </div>
                <div class="input-field col s12">
                  <input id="secret" type="password" class="validate" required="required" onChange={this.handleChange} />
                  <label for="secret">Client Secret</label>
                </div>
                <div className="col s2 send_icon">
                        <button className="btn waves-effect waves-light" type="submit" >Get Access Token</button>
                    </div>
                </form>

            </div>
            ):(
              (this.state.access_token)?(
                <Switch>
                  <Route exact path='/' component={Dispute}/>
                  <Route exact path='/home' component={Dispute}/>
                  <Route path='/dispute' component={Dispute} />
                  <Route path = "/search" component = {Search} />
                  <Route path='/dispute_by_start_time/:start_time' component={Dispute} />
                  <Route path='/dispute_id/:dispute_id' component={Dispute} />
                  <Route path="/insight" component={DisputeInsight} />
                  <Route path="/test" component={Test} />
                </Switch>
            ):(
                <div className = "preloader-div">
                  <div className="preloader-wrapper big active">
                    <div className="spinner-layer spinner-blue-only">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div><div className="gap-patch">
                        <div className="circle"></div>
                      </div><div className="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div>
              </div>
            )
            )

          }
          
        </div>

        
      
      </BrowserRouter>
    );
  }
}

export default App;
// "Authorization":"Basic "+btoa(keys.credential.client_id+":"+keys.credential.secret) //keys.authorization.Authorization_key
        