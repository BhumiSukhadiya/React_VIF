'use strict';

import React from 'react';
import {connect} from 'react-redux';
import ParentCompanyModal from './ParentCompanyModalComponent';
import {Link} from 'react-router';
require('styles//ParentCompaniesSetting.css');
import {getAllParentCompanies, getStates} from '../actions'
import LogData from '../stores/LogData'
import { Chip} from 'react-mdl';

require('styles//DeskLog.css');
import {Table, Column, Cell} from 'fixed-data-table';

const CompanyCell = ({rowIndex, data, onClickFun,...props}) => {
  let Index;

  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div><a onClick={()=>onClickFun(data['data'][Index])} style={{color:'#d06202'}}>{data['data'][Index].name}</a></div>
      </Cell>)
  }

};
const AddressCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div>{data['data'][Index].address.addressLine1!==undefined?data['data'][Index].address.addressLine1:null}</div>
        <div>{data['data'][Index].address.addressLine2!==undefined?data['data'][Index].address.addressLine2:null}</div>
      </Cell>
    )
  }
};
const StateCell = ({rowIndex, data,states, ...props}) => {
  let Index;
  let stateVal=null;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    for(let i=0;i<states.length;i++){
      if(states[i].abbreviation == data['data'][Index].address.state){
        stateVal=states[i].state;
      }
    }
    return (
      <Cell {...props}>
        <div>{stateVal}</div>
      </Cell>
    )

  }
};
const CityCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div>{data['data'][Index].address.city !== undefined?data['data'][Index].address.city:null}</div>
      </Cell>
    )
  }
};
const ZipCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div>{data['data'][Index].address.zip !== undefined?data['data'][Index].address.zip:null}</div>
      </Cell>
    )
  }
};
const OwnerCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div>{data['data'][Index].owner !== undefined?data['data'][Index].owner.name:null}</div>
      </Cell>
    )

  }
};
const OwnerPhoneCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div>{data['data'][Index].owner !== undefined?data['data'][Index].owner.phone:null}</div>
      </Cell>
    )
  }
};

const ContactPersonCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div>{data['data'][Index].contactPerson!== undefined?data['data'][Index].contactPerson.name:null}</div>
      </Cell>
    )
  }
};
const ContactNumberCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div>{data['data'][Index].contactPerson !== undefined?data['data'][Index].contactPerson.phone:null}</div>
      </Cell>
    )
  }
};
const StatusCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        {data['data'][Index].active ? <Chip style={{backgroundColor: '#5cb85c', color: 'white'}}>Active</Chip> :
          <Chip style={{backgroundColor: '#f86c6b', color: 'white'}}>Inactive</Chip>}
      </Cell>
    )
  }
};
const ActionCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <Link  to={'/manageRooftop/'+data['data'][Index]._id} style={{color:'#d06202'}}>Manage Rooftops</Link>
      </Cell>
    )
  }
};

/!*sorting*!/;
let SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC'
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    /*eslint-disable no-unused-vars*/
        let {onSortChange, sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }

  _onSortChange = (e) => {
    e.preventDefault();
    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }
}

class DataListWrapper {
  constructor(indexMap, data) {

    this._indexMap = indexMap;
    this.data = data['data'];

  }

  getSize() {
    return this._indexMap.length;
  }

  getObjectAt(index) {
    return this.data.getObjectAt(
      this._indexMap[index],
    );
  }
}
//**********

class ParentCompaniesSettingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      showParentCompanyModal:false,
      selectedParentCompany:null
    };
    this.props.dispatch(getAllParentCompanies()).then(() => {
      this.props.dispatch(getStates()).then(() => {
        this._dataList = new LogData(this.props.headerData.parentCompanies);
        this._defaultSortIndexes = [];
        let size = this._dataList.getSize();
        for (let index = 0; index < size; index++) {
          this._defaultSortIndexes.push(index);
        }

        this.setState ({
          sortedDataList: this._dataList,
          colSortDirs: {},
          states: this.props.parentCompanyData.states
        }) ;
      });

    })
  }


  _onSortChange = (columnKey, sortDir) => {

    let sortIndexes = this._defaultSortIndexes.slice();
    let splitCol = columnKey.split('.');
    columnKey = splitCol[0];
    let subColumnKey = splitCol[1];
    sortIndexes.sort((indexA, indexB) => {
      let valueA, valueB;
      if (subColumnKey !== undefined) {
        valueA = this._dataList.getObjectAt(indexA)[columnKey][subColumnKey];
        valueB = this._dataList.getObjectAt(indexB)[columnKey][subColumnKey];
      } else {

        valueA = this._dataList.getObjectAt(indexA)[columnKey];
        valueB = this._dataList.getObjectAt(indexB)[columnKey];
      }
      let sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });
    if (subColumnKey !== undefined) {
      this.setState({
        sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
        colSortDirs: {
          [columnKey + '_' + subColumnKey]: sortDir
        }
      });
    } else {
      this.setState({
        sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
        colSortDirs: {
          [columnKey]: sortDir
        }
      });
    }

  };

  _onFilterChange = (e) => {

    if (!e.target.value) {
      this.setState({
        sortedDataList: this._dataList
      });
    }

    let filterBy = e.target.value.toLowerCase();
    let size = this._dataList.getSize();
    let filteredIndexes = [];
    for (let index = 0; index < size; index++) {


      let {name} = this._dataList['data'][index];
      if (name.toLowerCase().indexOf(filterBy) !== -1 ) {
        filteredIndexes.push(index);

      }
    }

    this.setState({
      sortedDataList: new DataListWrapper(filteredIndexes, this._dataList)
    });
  };

  openParentCompanyModal=(parent_company)=>{
    if(parent_company == ''){
      this.setState(()=>({
        showParentCompanyModal:true,
        selectedParentCompany:{}
      }));
    }else{
      this.setState(()=>({
        showParentCompanyModal:true,
        selectedParentCompany:parent_company
      }));
    }


  };

  closeParentCompanyModal=()=>{
    this.props.dispatch(getAllParentCompanies()).then(() => {
      this.setState({
        showParentCompanyModal:false,
        selectedParentCompany:null,
        sortedDataList: new LogData(this.props.headerData.parentCompanies)
      })
    })
  };
  render() {

    return (

      <div className="log-table">
        {this.state.selectedParentCompany!== null && <ParentCompanyModal openDialog={this.state.showParentCompanyModal} onClose={this.closeParentCompanyModal} selectedParentCompany={this.state.selectedParentCompany}/>}
        <button onClick={()=>this.openParentCompanyModal('')}
          style={{color: 'white', backgroundColor: '#e96e02', borderColor: '#df6902', float: 'right', padding: 10}}>+
          Add Parent Company
        </button>
        <h3>Parent Companies</h3>
        <input type="text" className="search-field" placeholder="Search" onChange={this._onFilterChange}/><br/>
        <center>
          {(this.state.sortedDataList !==undefined && this.state.colSortDirs!==undefined) ? this.state.sortedDataList.getSize() > 0 ? (<Table
              maxHeight={550}
              width={1200}
              rowsCount={this.state.sortedDataList.getSize()}
              rowHeight={70}
              headerHeight={30} {...this.props}>

              <Column
                columnKey="name"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.name}>
                    Company
                  </SortHeaderCell>
                }
                cell={<CompanyCell data={this.state.sortedDataList} onClickFun={this.openParentCompanyModal}/>}
                width={150}
              />

              <Column
                columnKey="address"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.address}>
                    Address
                  </SortHeaderCell>
                }
                cell={<AddressCell data={this.state.sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="state"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.state}
                  >
                    State
                  </SortHeaderCell>
                }
                cell={<StateCell data={this.state.sortedDataList} states={this.state.states}/>}
                width={100}
              />
              <Column
                columnKey="address.city"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.address_city}>
                    City
                  </SortHeaderCell>
                }
                cell={<CityCell data={this.state.sortedDataList}/>}
                width={60}
              />
              <Column
                columnKey="address.zip"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.address_zip}>
                    Zip
                  </SortHeaderCell>
                }
                cell={<ZipCell data={this.state.sortedDataList}/>}
                width={60}
              />
              <Column
                columnKey="owner.name"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.owner_name}>
                    Owner
                  </SortHeaderCell>
                }
                cell={<OwnerCell data={this.state.sortedDataList}/>}
                width={80}
              />
              <Column
                columnKey="owner.phone"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.owner_phone}>
                    Owner Phone
                  </SortHeaderCell>
                }
                cell={<OwnerPhoneCell data={this.state.sortedDataList}/>}
                width={150}
              />
              <Column
                columnKey="contactPerson.name"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.contactPerson_name}>
                    Contact Person
                  </SortHeaderCell>
                }
                cell={<ContactPersonCell data={this.state.sortedDataList}/>}
                width={120}
              />
              <Column
                columnKey="contactPerson.phone"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.contactPerson_phone}>
                    Contact Number
                  </SortHeaderCell>
                }
                cell={<ContactNumberCell data={this.state.sortedDataList}/>}
                width={130}
              />
              <Column
                columnKey="Dealer"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={this.state.colSortDirs.Dealer}>
                    Status
                  </SortHeaderCell>
                }
                cell={<StatusCell data={this.state.sortedDataList}/>}
                width={100}
              />
              <Column

                header={
                  <SortHeaderCell
                    onSortChange={null}>
                    Action
                  </SortHeaderCell>
                }
                cell={<ActionCell data={this.state.sortedDataList}/>}
                width={150}
              />

            </Table>) : <h3 style={{color: 'red'}}>There are no records to display.</h3>:null}

        </center>

      </div>
    );
  }
}

ParentCompaniesSettingComponent.displayName = 'ParentCompaniesSettingComponent';

// Uncomment properties you need
// ParentCompaniesSettingComponent.propTypes = {};
// ParentCompaniesSettingComponent.defaultProps = {};

function mapStateToProps(state) {
  return {
    headerData: state.headerData,
    parentCompanyData: state.parentCompanyData
  }
}

export default connect(mapStateToProps)(ParentCompaniesSettingComponent);
