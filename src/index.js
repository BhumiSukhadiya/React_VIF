import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import AppComponent from './components/Main';
import HomePageComponent from './components/HomepageComponent';
import DashboardComponent from './components/DashboardComponent';
import LogAnUpComponent from './components/LogAnUpComponent';
import DeskLogComponent from './components/DeskLogComponent';
import DealPresenterComponent from './components/DealPresenterComponent';
import DealMakerComponent from './components/DealMakerComponent';
import InventoryComponent from './components/InventoryComponent';
import ParentCompaniesSettingComponent from './components/ParentCompaniesSettingComponent';
import ManageRooftopComponent from './components/ManageRooftopComponent'
import UsersComponent from './components/UsersComponent';
import ProfileComponent from './components/ProfileComponent';
import DeskLogSettingComponent from './components/DeskLogSettingComponent';
import DealMakerSettingComponent from './components/DealMakerSettingComponent';
import InventorySettingComponent from './components/InventorySettingComponent';
import LoginComponent from './components/LoginComponent';
import {Route, Router, IndexRoute, browserHistory} from 'react-router';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import store from './stores';
import {Provider} from 'react-redux';
let routes = (
    <Route path="/" component={AppComponent}>
        <IndexRoute component={HomePageComponent}/>
        <Route path="login" component={LoginComponent}/>
        <Route path="dashboard" component={DashboardComponent}/>
        <Route path="logAnUp" component={LogAnUpComponent}/>
        <Route path="deskLog" component={DeskLogComponent}/>
        <Route path="dealPresenter" component={DealPresenterComponent}/>
        <Route path="dealMaker" component={DealMakerComponent}/>
        <Route path="inventory" component={InventoryComponent}/>
        <Route path="parentCompanies">
            <IndexRoute component={ParentCompaniesSettingComponent}/>
            <Route path="/manageRooftop/:selectedParentCompanyId" component={ManageRooftopComponent}/>
        </Route>
        <Route path="users" component={UsersComponent}/>
        <Route path="profile" component={ProfileComponent}/>
        <Route path="deskLogSetting" component={DeskLogSettingComponent}/>
        <Route path="dealMakerSetting" component={DealMakerSettingComponent}/>
        <Route path="inventorySetting" component={InventorySettingComponent}/>
    </Route>

);
ReactDOM.render(<Provider store={store}><Router
    history={browserHistory}>{routes}</Router></Provider>, document.getElementById('app'))
