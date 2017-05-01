'use strict';

import React from 'react';
//import {Link} from 'react-router';

import {getRooftop,getAllParentCompanies} from '../actions';
require('styles//Header.css');
import {IconButton} from 'react-mdl';
import {connect} from 'react-redux';

class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      counter:0,
      allParentCompanies:null
    }
    props.dispatch(getAllParentCompanies()).then(()=>{
    });
  }
  componentWillReceiveProps(){
    //console.log(this.props);
    if(this.props.headerData.parentCompanies!= undefined){
    this.setState({
      allParentCompanies:this.props.headerData.parentCompanies
    });
    }
  }

  onSetting = () => {
    let x = document.getElementById('setting_menu');
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  };10
  componentDidMount(){
    let selectedParentCompany = localStorage.getItem('parentCompanyId');
    let selectedRooftop = localStorage.getItem('rooftopId');
    if(selectedParentCompany!== null){
      document.getElementById('combo_parent_company').value=selectedParentCompany
        let event={
            target:{
                value:selectedParentCompany
            }
        }
        this.loadRooftop(event);
        if(selectedRooftop!== null){
            document.getElementById('combo_rooftops').value=selectedRooftop
        }
    }




  }

 /* componentDidUpdate(){
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
  }*/

  loadRooftop = (event) => {
    let parentCompanyId;
      parentCompanyId = event.target.value;
    localStorage.setItem('parentCompanyId', parentCompanyId);
    this.props.dispatch(getRooftop(parentCompanyId)).then(() => {
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
        opt.selected='selected';
        Dropdown.appendChild(opt);
        localStorage.setItem('rooftopId', element._id);
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
    let parentCompanyOptions=null;
    if(this.state.allParentCompanies !== null){
      /*let selectedValue=false;
      if(this.state.allParentCompanies.length == 1){
        selectedValue=true;
      }*/
      parentCompanyOptions=this.state.allParentCompanies.map((parentCompany,index)=>{

        return (<option key={'parentCompany_'+index}  value={parentCompany._id}>{parentCompany.name}</option>)
      });

    }

    /**/
    return (
      <div className="top">
        <div className="header-content">
          <select id="combo_parent_company" className="dropdown-style" defaultValue="" onChange={this.loadRooftop}>
            <option disabled hidden value="">Select Parent Company</option>
           {parentCompanyOptions}
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
  return { headerData: state.headerData};
}

export default connect(mapStateToProps)(HeaderComponent);
