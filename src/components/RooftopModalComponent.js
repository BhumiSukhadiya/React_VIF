'use strict';

import React from 'react';
import {Dialog, DialogTitle, DialogContent, Chip, Checkbox} from 'react-mdl';
import {connect} from 'react-redux';
import {isEmpty} from '../services/parentCompanyServices';
import {getVIFModules,addRooftop,editRooftop} from '../services/RooftopServices';
import _ from 'lodash';

require('styles//RooftopModal.css');

class RooftopModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: true,
            imagePreviewUrl: 'https://s3-us-west-1.amazonaws.com/staging.genesis.com/images/defaultUser.png',
            file:'https://s3-us-west-1.amazonaws.com/staging.genesis.com/images/defaultUser.png',
            modalType:isEmpty(this.props.selectedRooftop)?'insert':'update'
        };
        getVIFModules().then((res) => {
            this.setState({
                vifModules: res
            });
        });
    }

    componentWillMount() {
        if (!isEmpty(this.props.selectedRooftop)) {
            this.setState({
                checked: this.props.selectedRooftop.active
            });
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
    };

    onSubmitRooftopData = (e) => {
        e.preventDefault();
        let valid=true;

        //console.log(this.refs.State.value);
        let requiredRefs = ['rooftopName', 'addressLine1', 'State', 'mainPhone', 'connectionString'];
        for (let i = 0; i < requiredRefs.length; i++) {
            let refname = requiredRefs[i];
            if (_.isEmpty(this.refs[refname].value)) {
                valid=false;
                this.refs[refname].style.border = '1px solid red';
            } else {
                this.refs[refname].style.border = '1px solid darkgrey';
            }
        }
        if(!valid){

        }else{
           // console.log(this.state.modalType);
            let formObj=this.props.selectedRooftop;
            formObj.file=this.state.file;
            formObj.name=this.refs.rooftopName.value;
            if(!_.isEmpty(this.refs.doingBusinessAs.value)){
                formObj.doingBusinessAs=this.refs.doingBusinessAs.value;
            }
            formObj.address =  formObj.address || {};
            formObj.address.addressLine1=this.refs.addressLine1.value;
            if(!_.isEmpty(this.refs.addressLine2.value)){
                formObj.address.addressLine2=this.refs.addressLine2.value;
            }
            if(!_.isEmpty(this.refs.City.value)){
                formObj.address.city=this.refs.City.value;
            }
            formObj.address.state=this.refs.State.value;
            if(!_.isEmpty(this.refs.zipCode.value)){
                formObj.address.zip=this.refs.zipCode.value;
            }
            formObj.mainPhone=this.refs.mainPhone.value;

            if(!_.isEmpty(this.refs.crmProviderName.value)){
                formObj.crmProvider=formObj.crmProvider || {};
                formObj.crmProvider.name=this.refs.crmProviderName.value;
            }
            if(!_.isEmpty(this.refs.fileType.value)){
                formObj.crmProvider=formObj.crmProvider || {};
                formObj.crmProvider.fileType=this.refs.fileType.value;
            }
            if(!_.isEmpty(this.refs.routeAddress.value)){
                formObj.crmProvider=formObj.crmProvider || {};
                formObj.crmProvider.routeAddress=this.refs.routeAddress.value;
            }
            formObj.connectionString=this.refs.connectionString.value;
            formObj.parentCompany=this.props.selectedParentCompany;
            formObj.active=this.refs.Status.props.defaultChecked;

            let checkedValue = document.querySelectorAll('.cbox:checked');
           // console.log(checkedValue.length);
            let arr=[];
            for(let i=0;i<checkedValue.length;i++){
                arr.push(checkedValue[i].value);
            }
            formObj.searchFields=arr;
           // console.log(formObj);
            let fs=new FormData();
            fs.append('address[state]',formObj.address.state);
            fs.append('file',formObj.file);

            if(this.state.modalType=='insert'){
                addRooftop(fs).then(()=>{
                    this.props.onClose();
                })
            }else{
                editRooftop(fs).then(()=>{
                    this.props.onClose();
                })
            }
        }

    };

    onChangeInputHandler = (e) => {
        e.target.style.border = '1px solid darkgrey'
    };
    handleImageChange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        console.log(file);

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };
        reader.readAsDataURL(file);
    };

    render() {
        let {selectedRooftop}=this.props;
        let stateOptions = this.props.stateList.map((stateData, index) => {
            return (<option key={'state_' + index} value={stateData.abbreviation}>{stateData.state}</option>)

        });
        return (
            <Dialog open={this.props.openDialog} style={{width: 700, paddingBottom: 5}}>
                <DialogTitle component='div'
                             style={{
                                 backgroundColor: '#f8f9fa',
                                 fontSize: 25,
                                 padding: 10,
                                 borderBottom: '1px solid #d1d4d7'
                             }}>
                    <div style={{display: 'block', verticalAlign: 'middle'}}>
            <span className='glyphicon glyphicon-list'>
            </span>
                        &nbsp;Parent Company
                        <span className='glyphicon glyphicon-remove'
                              style={{fontSize: 25, float: 'right', backgroundColor: 'black', color: 'white'}}
                              onClick={this.props.onClose}>
            </span>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={this.onSubmitRooftopData} name='rooftopForm'>
                        <center>
                            <img name='pic' width='200px' height='200px' style={{borderRadius: '50%'}}
                                 src={selectedRooftop.logoImageUrl||this.state.imagePreviewUrl}/>
                            <br/>
                            <div className='myLabel'>
                                <input type='file' onChange={(e) => this.handleImageChange(e)}/>
                                <span>Upload</span>
                            </div>
                        </center>
                        <div>
                            <table className='rooftopStyle'>

                                <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td><input ref='rooftopName' className='input-full-width' type='text'
                                               defaultValue={!isEmpty(selectedRooftop) ? selectedRooftop.name : ''}
                                               placeholder=' Dealership Name'
                                               onFocus={(e) => this.onChangeInputHandler(e)}
                                    /></td>
                                </tr>

                                <tr>
                                    <td>Doing Business As</td>
                                    <td><input ref='doingBusinessAs' className='input-full-width' type='text'
                                               placeholder=' Doing Business As'
                                               onFocus={(e) => this.onChangeInputHandler(e)}
                                               defaultValue={!isEmpty(selectedRooftop) ? (selectedRooftop.hasOwnProperty('doingBusinessAs') ? selectedRooftop.doingBusinessAs : '') : ''}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Address</td>
                                    <td><input ref='addressLine1' className='input-full-width' type='text'
                                               defaultValue={!isEmpty(selectedRooftop) ? selectedRooftop.address.addressLine1 : ''}
                                               onFocus={(e) => this.onChangeInputHandler(e)}
                                               placeholder=' Address Line 1'/></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><input ref='addressLine2' className='input-full-width' type='text'
                                               defaultValue={!isEmpty(selectedRooftop) ? (selectedRooftop.address.hasOwnProperty('addressLine2') ? selectedRooftop.address.addressLine2 : '') : ''}
                                               onFocus={(e) => this.onChangeInputHandler(e)}
                                               placeholder=' Address Line 2'/></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div style={{display: 'inline-flex', width: '100%'}}>
                                            <div style={{width: '50%'}}>
                                                <input ref='City'
                                                       className='input-full-width'
                                                       onFocus={(e) => this.onChangeInputHandler(e)}
                                                       type='text'
                                                       defaultValue={!isEmpty(selectedRooftop) ? (selectedRooftop.address.hasOwnProperty('city') ? selectedRooftop.address.city : '') : ''}
                                                       placeholder=' City'/>
                                            </div>
                                            <div style={{width: '50%', marginLeft: '10%'}}>
                                                <select ref='State'
                                                        defaultValue={!isEmpty(selectedRooftop) ? selectedRooftop.address.state : ''}
                                                        className='input-full-width'
                                                        onFocus={(e) => this.onChangeInputHandler(e)}
                                                        style={{width: '100%'}}>
                                                    <option value=''>Select State</option>
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
                                            <div style={{float: 'left'}}>
                                                <input ref='zipCode'
                                                       defaultValue={!isEmpty(selectedRooftop) ? (selectedRooftop.address.hasOwnProperty('zip') ? selectedRooftop.address.zip : '') : ''}
                                                       className='input-full-width'
                                                       onFocus={(e) => this.onChangeInputHandler(e)}
                                                       type='text'
                                                       placeholder=' Zip Code'/>
                                            </div>
                                            <div style={{float: 'right'}}>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Main Phone</td>
                                    <td>
                                        <input ref='mainPhone' className='input-full-width' type='text'
                                               defaultValue={!isEmpty(selectedRooftop) ? selectedRooftop.mainPhone : ''}
                                               placeholder=' Phone' onFocus={(e) => this.onChangeInputHandler(e)}/></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div style={{display: 'inline-flex', width: '100%'}}>
                                            <div style={{width: '50%'}}>
                                                <div style={{width: '100%'}}>CRM name</div>
                                            </div>
                                            <div style={{width: '50%', marginLeft: '10%'}}>
                                                <div style={{width: '100%'}}>File Type</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div style={{display: 'inline-flex', width: '100%'}}>
                                            <div style={{width: '50%'}}>
                                                <input ref='crmProviderName'
                                                       className='input-full-width'
                                                       type='text' onFocus={(e) => this.onChangeInputHandler(e)}
                                                       defaultValue={!isEmpty(selectedRooftop) ? ((selectedRooftop.hasOwnProperty('crmProvider') && selectedRooftop.crmProvider.hasOwnProperty('name')) ? selectedRooftop.crmProvider.name : '') : ''}
                                                       placeholder=' CRM Provider Name'/>
                                            </div>
                                            <div style={{width: '50%', marginLeft: '10%'}}>
                                                <select ref='fileType'
                                                        defaultValue={!isEmpty(selectedRooftop) ? ((selectedRooftop.hasOwnProperty('crmProvider') && selectedRooftop.crmProvider.hasOwnProperty('fileType')) ? selectedRooftop.crmProvider.fileType : '') : ''}
                                                        onFocus={(e) => this.onChangeInputHandler(e)}
                                                        className='input-full-width'
                                                        style={{width: '100%'}}>
                                                    <option value=''>Select File Type</option>
                                                    <option value='ADF/XML'>ADF/XML</option>
                                                    <option value='STAR/XML'>STAR/XML</option>
                                                    <option value='HTML'>HTML</option>
                                                    <option value='TXT'>TXT</option>
                                                </select>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Route Address</td>
                                    <td><input ref='routeAddress' className='input-full-width' type='text'
                                               defaultValue={!isEmpty(selectedRooftop) ? selectedRooftop.hasOwnProperty('crmProvider') ? selectedRooftop.crmProvider.hasOwnProperty('routeAddress') ? selectedRooftop.crmProvider.routeAddress : '' : '' : '' }
                                               onFocus={(e) => this.onChangeInputHandler(e)}
                                               placeholder=' Route Address'/></td>
                                </tr>
                                <tr>
                                    <td>Connection String</td>
                                    <td><input ref='connectionString' className='input-full-width' type='text'
                                               defaultValue={!isEmpty(selectedRooftop) ? selectedRooftop.connectionString : ''}
                                               onFocus={(e) => this.onChangeInputHandler(e)}
                                               placeholder=' Connection String'/></td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>
                                        <div style={{display: 'inline-flex'}}>
                                            <Checkbox ref='Status' defaultChecked={this.state.checked}
                                                      onChange={this.changeStatus}/>
                                            {this.state.checked ? <Chip
                                                    style={{backgroundColor: '#5cb85c', color: 'white'}}>Active</Chip> :
                                                <Chip style={{
                                                    backgroundColor: '#f86c6b',
                                                    color: 'white'
                                                }}>Inactive</Chip>}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Modules</td>
                                    <td>{this.state.vifModules}</td>
                                </tr>
                                <tr>
                                    <td>Search Match</td>
                                    <td>
                                        <label className='cbox-div'>
                                            <input type='checkbox' className='cbox' value='name'
                                                   defaultChecked={!isEmpty(selectedRooftop) ? selectedRooftop.searchFields.indexOf('name') !== -1 ? true : false : false}/><span
                                            className='cbox-span'>Name</span>
                                        </label>
                                        <label className='cbox-div'>
                                            <input type='checkbox' className='cbox' value='name.first'
                                                   defaultChecked={!isEmpty(selectedRooftop) ? selectedRooftop.searchFields.indexOf('name.first') !== -1 ? true : false : false}/><span
                                            className='cbox-span'>First Name</span>
                                        </label>
                                        <label className='cbox-div'>
                                            <input type='checkbox' className='cbox' value='name.last'
                                                   defaultChecked={!isEmpty(selectedRooftop) ? selectedRooftop.searchFields.indexOf('name.last') !== -1 ? true : false : false}/><span
                                            className='cbox-span'>Last Name</span>
                                        </label>
                                        <label className='cbox-div'>
                                            <input type='checkbox' className='cbox' value='address'
                                                   defaultChecked={!isEmpty(selectedRooftop) ? selectedRooftop.searchFields.indexOf('address') !== -1 ? true : false : false}/><span
                                            className='cbox-span'>Address</span>
                                        </label>
                                        <label className='cbox-div'>
                                            <input type='checkbox' className='cbox' value='phone'
                                                   defaultChecked={!isEmpty(selectedRooftop) ? selectedRooftop.searchFields.indexOf('phone') !== -1 ? true : false : false}/><span
                                            className='cbox-span'>Phone</span>
                                        </label>
                                        <label className='cbox-div'>
                                            <input type='checkbox' className='cbox' value='email'
                                                   defaultChecked={!isEmpty(selectedRooftop) ? selectedRooftop.searchFields.indexOf('email') !== -1 ? true : false : false}/><span
                                            className='cbox-span'>Email</span>
                                        </label>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <hr/>

                        <button className='submit-btn' type='submit'>&#10004; Save</button>
                        &nbsp;&nbsp;
                        <button onClick={this.props.onClose} style={{padding: 3}}>&#10006; Close</button>
                    </form>

                </DialogContent>
            </Dialog>
        );
    }
}

RooftopModalComponent.displayName = 'RooftopModalComponent';

// Uncomment properties you need
// RooftopModalComponent.propTypes = {};
// RooftopModalComponent.defaultProps = {};
function mapStateToProps(store) {
    return {
        stateList: store.parentCompanyData.states
    }
}


export default connect(mapStateToProps)(RooftopModalComponent);
