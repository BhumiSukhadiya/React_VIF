'use strict';

import React from 'react';
import {Dialog, DialogTitle, DialogContent, Chip, Checkbox} from 'react-mdl';
import {connect} from 'react-redux'

require('styles//ParentCompanyModal.css');

class ParentCompanyModalComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      disableCompanyId: (this.props.selectedParentCompany !== '')
    };
  }

  componentWillMount(){
    let companyId = '', companyName = '', addressLine1 = '', addressLine2 = '', City = '', State = '', zipCode = '', ownerName = '', ownerPhone = '', contactPersonName = '', contactPersonPhone = '', Status = true;
    if (this.props.selectedParentCompany !== '') {

      companyId = this.props.selectedParentCompany.companyId;
      companyName = this.props.selectedParentCompany.name;
      addressLine1 = this.props.selectedParentCompany.address.addressLine1;
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
      Status = false/*this.props.selectedParentCompany.active*/;
    }
    this.setState({
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
      checked:Status
    })
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

    let stateOptions=this.props.stateList.map((stateData,index)=>{
      return (<option key={'state_'+index} value={stateData.abbreviation}>{stateData.state}</option>)

    });
    return (
      <Dialog open={this.props.openDialog} style={{width: 700}}>
        <DialogTitle component="div"
                     style={{backgroundColor: '#f8f9fa', fontSize: 25, padding: 10, borderBottom: '1px solid #d1d4d7'}}>
          <div style={{display: 'block', verticalAlign: 'middle'}}><span className="glyphicon glyphicon-list"></span>
            &nbsp;Parent Company
            <span className="glyphicon glyphicon-remove"
                  style={{fontSize: 25, float: 'right', backgroundColor: 'black', color: 'white'}}
                  onClick={this.props.onClose}></span></div>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={null} name="myform" noValidate>
            <div>
              <table className="parentCompanyStyle">

                <tbody>
                <tr>
                  <td>Company ID</td>
                  <td><input className="input-full-width" type="text" defaultValue={this.state.companyId}
                             disabled={this.state.disableCompanyId} required/></td>
                </tr>
                <tr>
                  <td>Company Name</td>
                  <td><input className="input-full-width" type="text" defaultValue={this.state.companyName} required/></td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td><input className="input-full-width" type="text" defaultValue={this.state.addressLine1} placeholder=" Address Line 1" required/></td>
                </tr>
                <tr>
                  <td></td>
                  <td><input className="input-full-width" type="text" defaultValue={this.state.addressLine2} placeholder=" Address Line 2"/></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <div style={{display: 'block'}}>
                      <div style={{float: 'left'}}><input className="input-full-width" type="text" required
                                                          defaultValue={this.state.City} placeholder=" City"/>
                      </div>
                      <div style={{float: 'right'}}><select defaultValue={this.state.State} required className="input-full-width" style={{width: 164}}>
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
                      <div style={{float: 'left'}}><input required defaultValue={this.state.zipCode} className="input-full-width" type="text"
                                                          placeholder=" Zip Code" pattern="/^([0-9a-zA-Z]{5}$)/"
                                                          title="Zip length should be 5!!!"/>
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
                      <div style={{float: 'left'}}><input className="input-full-width" type="text" defaultValue={this.state.ownerName}
                                                          placeholder=" Owner Name" required/>
                      </div>
                      <div style={{float: 'right'}}><input className="input-full-width" type="text" defaultValue={this.state.ownerPhone}
                                                           title="Phone should be 10 digit number!!!" required
                                                           pattern="/^([0-9]{10}$)/" placeholder=" Owner Phone"/>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Contact person</td>
                  <td>
                    <div style={{display: 'block'}}>
                      <div style={{float: 'left'}}><input className="input-full-width" type="text" defaultValue={this.state.contactPersonName}
                                                          placeholder=" Contact person Name"/>
                      </div>
                      <div style={{float: 'right'}}><input className="input-full-width" type="text" defaultValue={this.state.contactPersonPhone}
                                                           title="Phone should be 10 digit number!!!"
                                                           pattern="/^([0-9]{10}$)/"
                                                           placeholder=" Contact person Phone"/>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>
                    <div style={{display: 'inline-flex'}}>
                      <Checkbox defaultChecked={this.state.checked} onChange={this.changeStatus}/>
                      {this.state.checked ? <Chip style={{backgroundColor: '#5cb85c', color: 'white'}}>Active</Chip> :
                        <Chip style={{backgroundColor: '#f86c6b', color: 'white'}}>Inactive</Chip>}
                    </div>
                  </td>
                </tr>
                </tbody>

              </table>
            </div>
            <hr/>
            <input type="submit" name="submit" value="&#10004; Save" className="submit-btn"/>
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

function mapStateToProps(store){
  return{
    stateList:store.parentCompanyData.states
  }
}

export default connect(mapStateToProps)(ParentCompanyModalComponent);
