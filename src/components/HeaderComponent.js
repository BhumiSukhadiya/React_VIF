'use strict';

import React from 'react';
//import {Link} from 'react-router';

import {getRooftop} from '../actions';
require('styles//Header.css');
import {IconButton} from 'react-mdl';
import {connect} from 'react-redux';

class HeaderComponent extends React.Component {
  constructor() {
    super();
    this.state={
      counter:0
    }
  }

  onSetting = () => {
    let x = document.getElementById('setting_menu');
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  };

  shouldComponentUpdate(){
    if(this.state.counter==0){
      this.setState({
        counter:this.state.counter+1
      });
      return true;
    }
    else{
      return false;
    }

  }
  componentDidUpdate(){
    this.createCombopOptions('combo_parent_company', this.props.headerData.parentCompany);
    let selectedParentCompany = localStorage.getItem('parentCompanyId');
    if (selectedParentCompany != null) {
      document.querySelector('#combo_parent_company option[value="' + selectedParentCompany + '"]').selected = true;
      this.props.dispatch(getRooftop(selectedParentCompany)).then(() => {
        this.createCombopOptions('combo_rooftops', this.props.headerData.rooftop);
        let selectedrooftop = localStorage.getItem('rooftopId');
        if (selectedrooftop != null) {
          document.querySelector('#combo_rooftops option[value="' + selectedrooftop + '"]').selected = true;
        }
      });
    }


  }

  loadRooftop = (event) => {
    let parentCompanyId = event.target.value;
    localStorage.setItem('parentCompanyId', parentCompanyId);
    this.props.dispatch(getRooftop(event.target.value)).then(() => {
      this.createCombopOptions('combo_rooftops', this.props.headerData.rooftop);
    });

  };
  createCombopOptions = (comboId, data) => {
    let Dropdown = document.getElementById(comboId);
    let allOpts = Dropdown.options;
    let len = allOpts.length;
    data.map((element) => {
      if (len == 1) {
        let opt = document.createElement('option');
        opt.value = element._id;
        opt.text = element.name;
        //console.log(opt);
        Dropdown.appendChild(opt);
      } else {
        for (let i = 1; i < len; i++) {
          let optval = Dropdown.options[i].value;
          if (optval !== element._id) {
            /*console.log('optval='+optval);
             console.log('company_id:'+company._id);*/
            let opt = document.createElement('option');
            opt.value = element._id;
            opt.text = element.name;
            //console.log(opt);
            Dropdown.appendChild(opt);
          }

        }
      }
    });

  }
  setSelectedRooftop = (e) => {
    let rooftopId = e.target.value;
    localStorage.setItem('rooftopId', rooftopId);
  }


  render() {
    return (
      <div className="top">
        <div className="header-content">
          <select id="combo_parent_company" className="dropdown-style" defaultValue="" onChange={this.loadRooftop}>
            <option disabled hidden value="">Select Parent Company</option>
            {/*  {
             this.state.parentCompany!= undefined && this.state.parentCompany.map((company,i)=>{
             <option value={company._id} key={'company_'+i}>{company.name}</option>
             })
             }*/}
          </select>
          <select className="dropdown-style" id="combo_rooftops" defaultValue="" onChange={this.setSelectedRooftop}>
            <option disabled hidden value="">Select Rooftop</option>
          </select>
          <div className="icon_menu">
            <IconButton name="notifications"/>
          </div>
          &nbsp;&nbsp;&nbsp;
          <div className="icon_menu">
            <IconButton name="settings" onClick={this.onSetting}/>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    headerData: state.headerData
  }
}

export default connect(mapStateToProps)(HeaderComponent);
