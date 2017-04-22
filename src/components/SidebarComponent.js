'use strict';

import React from 'react';
import {Link} from 'react-router';

require('styles//Sidebar.css');

class SidebarComponent extends React.Component {
  render() {
    return (
      <div className="sidebar-nav">
        <div className="sidebar-header">
          <img src="../images/defaultLogo.png"
               style={{verticalAlign: 'middle', height: '100%', maxWidth: '80%', margin: '10px auto'}}/>
        </div>
        <ul className="mainmenu">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/logAnUp">Log An Up</Link>
          </li>
          <li>
            <Link to="/deskLog">Desk Log</Link>
          </li>
          <li>
            <Link to="/dealPresenter">Deal Presenter</Link>
          </li>
          <li>
            <Link to="/dealMaker">Deal Maker</Link>
          </li>
          <li>
            <Link to="/inventory">Inventory</Link>
          </li>
          <li>
            <Link to="">Admin <i className="down"></i></Link>
            <ul className="submenu">
              <li> <Link to="/parentCompanies">General Setting</Link></li>
              <li> <Link to="/users">Users</Link></li>
              <li> <Link to="/profile">Profile</Link></li>
              <li> <Link to="/deskLogSetting">Desk Log</Link></li>
              <li> <Link to="/dealMakerSetting">Deal Maker</Link></li>
              <li> <Link to="/inventorySetting">Inventory</Link></li>
            </ul>
          </li>
        </ul>

      </div>
    );
  }
}

export default SidebarComponent;
