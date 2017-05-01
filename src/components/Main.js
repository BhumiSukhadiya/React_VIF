require('normalize.css/normalize.css');
require('styles/App.css');
import {browserHistory} from 'react-router';

import React from 'react';
import HeaderComponent from './HeaderComponent';
import SidebarComponent from './SidebarComponent';
import LogInComponent from './LoginComponent';
import {connect} from 'react-redux';
import {setToken,getAllParentCompanies} from '../actions';
import cookie from 'react-cookie';

/*
export function getToken(cname) {
  let auth_token=localStorage.getItem(cname)
  return auth_token;
}
*/


class AppComponent extends React.Component {

  constructor(){
    super();
    this.state={
      isAuthenticated:false,
      loaded:false
    }
  }
  componentWillMount(){
    /*let auth_token=getToken('auth_token')*/

    let auth_token=cookie.load('token');
    if(auth_token!=undefined){
      //console.log(auth_token);
      this.props.dispatch(setToken(auth_token));
      this.setState({isAuthenticated:true});
      this.props.dispatch(getAllParentCompanies()).then(()=>{
        this.setState({loaded:true});
        if(this.props.location.pathname== '/'){
        browserHistory.push('dashboard');
        }
      });


    }else{
      browserHistory.push('login');
    }
  }
  handleLogout=()=>{
    //console.log('avyu');
    //localStorage.removeItem('auth_token');
    cookie.remove('token');
    localStorage.removeItem('parentCompanyId');
    localStorage.removeItem('rooftopId');
    this.setState({isAuthenticated:false});
    browserHistory.push('/');
}

  render() {
    return (
      <div>
        { this.state.isAuthenticated  ? (
          <div>
          <HeaderComponent />
          <SidebarComponent/>
          <div className="main">
            <div className="setting-menu" id="setting_menu">
                <div className="setting-menu-header">
                  <strong>Settings</strong>
                </div>
                <div className="setting-menu-items">Profile</div>
                <div  className="setting-menu-items">Change
                  Password</div>
                <div  className="setting-menu-items" onClick={this.handleLogout}>Logout</div>

            </div>
            {this.props.location.pathname.toUpperCase()}

        {this.props.children}
          </div>
          </div>
          ) : (
          <LogInComponent/>
          )}
        </div>

    );
  }
}



export default connect()(AppComponent);
