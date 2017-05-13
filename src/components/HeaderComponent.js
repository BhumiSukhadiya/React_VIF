'use strict';

import React from 'react';
//import {Link} from 'react-router';
import _ from 'lodash';
import {getRooftop, getAllParentCompanies} from '../actions';
import {IconButton} from 'react-mdl';
import {connect} from 'react-redux';
require('styles//Header.css');

class HeaderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            allParentCompanies: null
        };
        props.dispatch(getAllParentCompanies()).then(() => {
        });
    }

    componentWillReceiveProps() {
        //console.log(this.props);
        if (this.props.headerData.parentCompanies != undefined) {
            this.setState({
                allParentCompanies: this.props.headerData.parentCompanies
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
    };

    componentWillMount() {

        let selectedParentCompany = localStorage.getItem('parentCompanyId');
        let selectedRooftop = localStorage.getItem('rooftopId');
        if (!_.isEmpty(selectedParentCompany)) {
            this.setState({
                selectedParentCompany
            });
            this.loadRooftop('', selectedParentCompany);
            if (!_.isEmpty(selectedRooftop)) {
                this.setState({
                    selectedRooftop
                });
            }
        }
    }

    loadRooftop = (event, selectedParentCompany) => {
        let parentCompanyId;
        if (event == '') {
            parentCompanyId = selectedParentCompany;
        } else {
            parentCompanyId = event.target.value;
        }
        this.setState({
            selectedParentCompany:parentCompanyId
        });

        /*if(!_.isEmpty(localStorage.getItem('parentCompanyId'))){
         localStorage.removeItem('parentCompanyId');
         }*/
        localStorage.setItem('parentCompanyId', parentCompanyId);
        this.props.dispatch(getRooftop(parentCompanyId)).then(() => {
            this.createCombopOptions('combo_rooftops', this.props.headerData.rooftop);
        });
    };
    createCombopOptions = (comboId, data) => {
        let Dropdown = document.getElementById(comboId);
        Dropdown.innerHTML = <option disabled hidden value="">Select Rooftop</option>;
        let allOpts = Dropdown.options;
        let len = allOpts.length;
        data.map((element) => {
            if (len == 1) {
                let opt = document.createElement('option');
                opt.value = element._id;
                opt.text = element.name;
                opt.selected = 'selected';
                Dropdown.appendChild(opt);
                localStorage.setItem('rooftopId', element._id);
            } else {
                let flag = 0;
                for (let i = 1; i < len; i++) {
                    let optval = Dropdown.options[i].value;
                    if (optval == element._id) {
                        flag = 1;
                    } else {
                        flag = 0;
                    }
                }
                if (flag == 0) {
                    let opt = document.createElement('option');
                    opt.value = element._id;
                    opt.text = element.name;
                    Dropdown.appendChild(opt);
                }
            }
        });

    };
    setSelectedRooftop = (e) => {
        let rooftopId = e.target.value;
        /*if(!_.isEmpty(localStorage.getItem('rooftopId'))){
         localStorage.removeItem('rooftopId');
         }*/
        localStorage.setItem('rooftopId', rooftopId);
    };

    render() {
        let parentCompanyOptions = null;
        if (this.state.allParentCompanies !== null) {
            /*let selectedValue=false;
             if(this.state.allParentCompanies.length == 1){
             selectedValue=true;
             }*/
            parentCompanyOptions = this.state.allParentCompanies.map((parentCompany, index) => {
                return (<option key={'parentCompany_' + index} value={parentCompany._id}>{parentCompany.name}</option>)
            });
        }

        return (
            <div className='top'>
                <div className='header-content'>
                    <select id='combo_parent_company' className='dropdown-style' value={this.state.selectedParentCompany ||''}
                            onChange={this.loadRooftop}>
                        <option disabled hidden value="">Select Parent Company</option>
                        {parentCompanyOptions}
                        {/*  {
                         this.state.parentCompany!= undefined && this.state.parentCompany.map((company,i)=>{
                         <option value={company._id} key={'company_'+i}>{company.name}</option>
                         })
                         }*/}
                    </select>
                    <select className='dropdown-style' id='combo_rooftops' value={this.state.selectedRooftop || ''}
                            onChange={this.setSelectedRooftop}>
                        <option disabled hidden value="">Select Rooftop</option>
                    </select>
                    <div className='icon_menu'>
                        <IconButton name='notifications'/>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div className='icon_menu'>
                        <IconButton name='settings' onClick={this.onSetting}/>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {headerData: state.headerData};
}

export default connect(mapStateToProps)(HeaderComponent);
