'use strict';

import React from 'react';
import {Textfield,Button} from 'react-mdl';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {login} from '../actions';
import {browserHistory} from 'react-router';
import cookie from 'react-cookie';

require('styles//Login.css');

class LoginComponent extends React.Component {
  componentDidMount(){
    let auth_token=cookie.load('token');
    if(auth_token!==undefined){
      browserHistory.push('dashboard');
    }
  }
  onLogin=()=>{
    let data={
      email:document.getElementById('username').value,
      password:document.getElementById('password').value
    }
    this.props.dispatch(login(data));
    /*if(data.email )*/
  }
  render() {
    return (
      <div className="login-component">
       <div className="login-box">
         <div>
         <h1 style={{textAlign:'left'}}>Login</h1>
         </div>
         <div style={{color:'grey',fontSize:14,textAlign:'left'}}>Sign in to your account</div>
         <Textfield type="email" label="Username/Email" id='username'/><br/>
         <Textfield label="Password" type="password" id='password'/><br/>
         <Button raised colored style={{float:'left'}} onClick={this.onLogin}>Login</Button>
         <a href="!#" style={{fontWeight: 'normal',color: '#fd8821',borderRadius: 0,float:'right'}}>Forgot Password?</a>
       </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({login}, dispatch)
}


export default connect(mapDispatchToProps)(LoginComponent);
