'use strict';

import React from 'react';
import {Dialog, DialogTitle, DialogContent, Chip, Checkbox} from 'react-mdl';
import {connect} from 'react-redux'
import {isEmpty,updateParentCompany,addParentCompany} from '../services/parentCompanyServices';

require('styles//ParentCompanyModal.css');

class ParentCompanyModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      disableCompanyId: (!isEmpty(this.props.selectedParentCompany))

    };
  }

  componentWillMount() {
    this.loadModalView();
  }

  /* componentWillReceiveProps(){
   this.loadModalView();
   }*/
  loadModalView = () => {

    let companyId = '', companyName = '', addressLine1 = '', addressLine2 = '', City = '', State = '', zipCode = '', ownerName = '', ownerPhone = '', contactPersonName = '', contactPersonPhone = '', Status = true;
    let modalType = 'insert';
    if (!isEmpty(this.props.selectedParentCompany)) {
      modalType = 'update';
      companyId = this.props.selectedParentCompany.companyId;
      companyName = this.props.selectedParentCompany.name;
      if (this.props.selectedParentCompany.address.addressLine1 !== undefined) {
        addressLine1 = this.props.selectedParentCompany.address.addressLine1;
      }
      if (this.props.selectedParentCompany.address.addressLine2 !== undefined) {
        addressLine2 = this.props.selectedParentCompany.address.addressLine2;
      }
      if (this.props.selectedParentCompany.address.city !== undefined) {
        City = this.props.selectedParentCompany.address.city;
      }
      if (this.props.selectedParentCompany.address.state !== undefined) {
        State = this.props.selectedParentCompany.address.state;
      }
      if (this.props.selectedParentCompany.address.zip !== undefined) {
        zipCode = this.props.selectedParentCompany.address.zip;
      }
      if (this.props.selectedParentCompany.owner !== undefined) {
        ownerName = this.props.selectedParentCompany.owner.name;
      }
      if (this.props.selectedParentCompany.owner !== undefined) {
        ownerPhone = this.props.selectedParentCompany.owner.phone;
      }
      if (this.props.selectedParentCompany.contactPerson !== undefined) {
        contactPersonName = this.props.selectedParentCompany.contactPerson.name;
      }
      if (this.props.selectedParentCompany.contactPerson !== undefined) {
        contactPersonPhone = this.props.selectedParentCompany.contactPerson.phone;
      }
      Status = this.props.selectedParentCompany.active;
    }
    this.setState(() => ({
      companyId,
      companyName,
      addressLine1,
      addressLine2,
      City,
      State,
      zipCode,
      ownerName,
      ownerPhone,
      contactPersonName,
      contactPersonPhone,
      checked: Status,
      modalType
    }));
  }
  onSubmitParentCompanyData = (e) => {
    e.preventDefault();
    let formObj = this.props.selectedParentCompany;
    if(isEmpty(formObj)){
      formObj.address={};
      formObj.owner={};
    }
    formObj.name=this.refs.companyName.value;
    formObj.address.addressLine1=this.refs.addressline1.value;
    if(this.refs.addressline2.value!== ''){
      formObj.address.addressLine2=this.refs.addressline2.value;
    }
    formObj.address.city=this.refs.City.value;
    formObj.address.state=this.refs.State.value;
    formObj.address.zip=this.refs.zipCode.value;
    if((this.refs.contactPersonName.value!==''||this.refs.contactPersonPhone.value!=='') && !formObj.hasOwnProperty('contactPerson')){
      formObj.contactPerson={}
    }
    if(this.refs.contactPersonName.value!==''){
      formObj.contactPerson.name=this.refs.contactPersonName.value;
    }
    if(this.refs.contactPersonPhone.value!==''){
      formObj.contactPerson.phone=this.refs.contactPersonPhone.value;
    }
    formObj.owner.name=this.refs.ownerName.value;
    formObj.owner.phone=this.refs.ownerPhone.value;
    formObj.active=this.refs.Status.props.defaultChecked;

    /*let len = Object.keys(this.refs).length;
    for (let key in this.refs) {
      if (key == 'Status') {
        formObj[key] = this.refs[key].props.defaultChecked
      } else {
        formObj[key] = this.refs[key].value
      }
    }*/
    if (this.state.modalType == 'insert') {
      addParentCompany(formObj).then(()=>{
        this.props.onClose();


      })
    } else {
      updateParentCompany(formObj._id,formObj).then(()=>{
        this.props.onClose();
      })
    }
  }


  changeStatus = (e) => {
    if (e.target.checked == true) {
      this.setState({
        checked: true
      })
    } else {
      this.setState({
        checked: false
      })
    }
  }

  render() {

    let stateOptions = this.props.stateList.map((stateData, index) => {
      return (<option key={'state_' + index} value={stateData.abbreviation}>{stateData.state}</option>)

    });
    return (
      <Dialog open={this.props.openDialog} style={{width: 700}}>
        <DialogTitle component="div"
                     style={{backgroundColor: '#f8f9fa', fontSize: 25, padding: 10, borderBottom: '1px solid #d1d4d7'}}>
          <div style={{display: 'block', verticalAlign: 'middle'}}>
            <span className="glyphicon glyphicon-list">
            </span>
            &nbsp;Parent Company
            <span className="glyphicon glyphicon-remove"
                  style={{fontSize: 25, float: 'right', backgroundColor: 'black', color: 'white'}}
                  onClick={this.props.onClose}>
            </span>
          </div>
        </DialogTitle>
        <DialogContent>

          <form
            onSubmit={this.onSubmitParentCompanyData} name="parentCompanyForm">
            <div>
              <table className="parentCompanyStyle">

                <tbody>
                {this.state.modalType=='update' && <tr>
                  <td>Company ID</td>
                  <td><input ref="companyId" className="input-full-width" type="text"
                             defaultValue={this.state.companyId}
                             disabled={this.state.disableCompanyId} required/></td>
                </tr>}

                <tr>
                  <td>Company Name</td>
                  <td><input ref="companyName" className="input-full-width" type="text"
                             defaultValue={this.state.companyName} required/>
                  </td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td><input ref="addressline1" className="input-full-width" type="text"
                             defaultValue={this.state.addressLine1}
                             placeholder=" Address Line 1" required/></td>
                </tr>
                <tr>
                  <td></td>
                  <td><input ref="addressline2" className="input-full-width" type="text"
                             defaultValue={this.state.addressLine2}
                             placeholder=" Address Line 2"/></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <div style={{display: 'block'}}>
                      <div style={{float: 'left'}}><input ref="City" className="input-full-width" type="text" required
                                                          defaultValue={this.state.City} placeholder=" City"/>
                      </div>
                      <div style={{float: 'right'}}><select ref="State" defaultValue={this.state.State} required
                                                            className="input-full-width" style={{width: 164}}>
                        <option>Select State</option>
                        {stateOptions}

                      </select>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <div style={{display: 'block'}}>
                      <div style={{float: 'left'}}><input ref="zipCode" defaultValue={this.state.zipCode}
                                                          className="input-full-width"
                                                          type="text"
                                                          placeholder=" Zip Code" required/>
                      </div>
                      <div style={{float: 'right'}}>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Owner</td>
                  <td>
                    <div style={{display: 'block'}}>
                      <div style={{float: 'left'}}><input ref="ownerName" className="input-full-width" type="text"
                                                          defaultValue={this.state.ownerName}
                                                          placeholder=" Owner Name" required/>
                      </div>
                      <div style={{float: 'right'}}><input ref="ownerPhone" className="input-full-width" type="text"
                                                           defaultValue={this.state.ownerPhone}
                                                           required placeholder=" Owner Phone"/>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Contact person</td>
                  <td>
                    <div style={{display: 'block'}}>
                      <div style={{float: 'left'}}><input ref="contactPersonName" className="input-full-width"
                                                          type="text"
                                                          defaultValue={this.state.contactPersonName}
                                                          placeholder=" Contact person Name"/>
                      </div>
                      <div style={{float: 'right'}}><input ref="contactPersonPhone" className="input-full-width"
                                                           type="text"
                                                           defaultValue={this.state.contactPersonPhone}
                                                           placeholder=" Contact person Phone"/>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <div style={{display: 'inline-flex'}}>
                      <Checkbox ref="Status" defaultChecked={this.state.checked} onChange={this.changeStatus}/>
                      {this.state.checked ? <Chip style={{backgroundColor: '#5cb85c', color: 'white'}}>Active</Chip> :
                        <Chip style={{backgroundColor: '#f86c6b', color: 'white'}}>Inactive</Chip>}
                    </div>
                  </td>
                </tr>
                </tbody>

              </table>
            </div>
            <hr/>

            <button className="submit-btn" type="submit">&#10004; Save</button>
            &nbsp;&nbsp;
            <button onClick={this.props.onClose} style={{padding: 3}}>&#10006; Close</button>
          </form>

        </DialogContent>
      </Dialog>
    );
  }
}

ParentCompanyModalComponent.displayName = 'ParentCompanyModalComponent';

// Uncomment properties you need
// ParentCompanyModalComponent.propTypes = {};
// ParentCompanyModalComponent.defaultProps = {};

function mapStateToProps(store) {
  return {
    stateList: store.parentCompanyData.states
  }
}

export default connect(mapStateToProps)(ParentCompanyModalComponent);
