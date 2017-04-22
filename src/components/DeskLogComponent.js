'use strict';

import React from 'react';
import dataList from '../stores/logs.json';
import LogData from '../stores/LogData'
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import {Icon, Chip} from 'react-mdl';

require('styles//DeskLog.css');
import {Table, Column, Cell} from 'fixed-data-table';

const TypeTimeCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div className="DesklogImages">
          <img src={'../images/entryType/' + data['data'][Index].type + data['data'][Index].typeStatus + '.png'}/>
        </div>
        <div>{data['data'][Index].Customer.time}</div>
      </Cell>)
  } else {
    return null;
  }

};
const LocationDeskMgrCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div className="DesklogImages">
          <img src={'../images/' + data['data'][Index].Location}/>
        </div>
        <div>{data['data'][Index].DeskMgr}</div>
      </Cell>
    )
  } else {
    return null;
  }
};
const SourceIdCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div>{data['data'][Index].Customer.Source}</div>
        <div><strong>{data['data'][Index].Customer.ID}</strong></div>
      </Cell>
    )
  } else {
    return null;
  }
};
const CustomerCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <table className="table-uncondensed">
          <tbody>
          <tr>
            <td rowSpan="2">
              <div className="DesklogImages">
                <img src={'../images/' + data['data'][Index].Customer.Photo} title={data['data'][Index].Customer.name}/>
              </div>
            </td>
          </tr>
          <tr>
            <td><a href={'mailto:' + data['data'][Index].Customer.email}>{data['data'][Index].Customer.email}<Icon
              name="mail"/></a><br/>
              <a href={'callto:' + data['data'][Index].Customer.number}>{data['data'][Index].Customer.number} <Icon
                name="phone"/></a>
            </td>
          </tr>
          <tr>
            <td><b>{data['data'][Index].Customer.name}</b></td>
            <td>City: {data['data'][Index].Customer.city}</td>
          </tr>
          </tbody>
        </table>
      </Cell>
    )
  } else {
    return null;
  }
};
const ScoreCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <b> Credit:{data['data'][Index].Score}</b>
      </Cell>
    )
  } else {
    return null;
  }
};
const NUDStockCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        {data['data'][Index].Vehicle.type == 'N' && <Chip style={{backgroundColor: '#f86c6b',color:'white'}}>New</Chip>}
        {data['data'][Index].Vehicle.type == 'U' && <Chip style={{backgroundColor: '#428bca',color:'white'}}>USED</Chip>}
        {data['data'][Index].Vehicle.type == 'D' && <Chip style={{backgroundColor: '#fd8821',color:'white'}}>DEMO</Chip>}
        {data['data'][Index].Vehicle.type == 'O' && <Chip style={{backgroundColor: '#5cb85c',color:'white'}}>OTHERS</Chip>}
        <br/><br/><b>{data['data'][Index].Vehicle.Stock}</b>
      </Cell>
    )
  } else {
    return null;
  }
};
const VehicleTradeCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <b>{data['data'][Index].Vehicle.name}</b><br/><br/>
        {data['data'][Index].Customer.Trade == undefined && <span><b>No Trade</b></span> }
        {data['data'][Index].Customer.Trade}
      </Cell>
    )
  } else {
    return null;
  }
};

const TheRoadToSaleCell = ({rowIndex, data, ...props}) => {
  let dispKeys = [], dispVals = [];
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    for (let key in data['data'][Index].roadToSale) {
      dispKeys.push(<td key={key}>{key.toUpperCase()}</td>);
      if (data['data'][Index].roadToSale[key] == true) {
        dispVals.push(<td key={key}>&#128077;</td>);
      }
      if (data['data'][Index].roadToSale[key] == false) {
        dispVals.push(<td key={key}>&#128078;</td>);
      }
      if (data['data'][Index].roadToSale[key] == null) {
        dispVals.push(<td key={key}>&nbsp;</td>);
      }
    }

    return (
      <Cell {...props}>
        <table className="table-uncondensed">
          <tbody>
          <tr>
            {dispKeys}
          </tr>
          <tr className="conden">
            {dispVals}
          </tr>
          <tr>
            <td colSpan="5">{data['data'][Index].comment}</td>
          </tr>
          </tbody>
        </table>
      </Cell>
    )
  } else {
    return null;
  }
};
const SellerCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        {data['data'][Index].variableSeller.Seller1}<br/>{data['data'][Index].variableSeller.Seller2}
      </Cell>
    )
  } else {
    return null;
  }
};
const DealerCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        {data['data'][Index].Dealer.dealer3}<br/>{data['data'][Index].Dealer.dealer4}
      </Cell>
    )
  } else {
    return null;
  }
};
const LmcLmeCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        {data['data'][Index].LMC}<br/>{data['data'][Index].LME}
      </Cell>
    )
  } else {
    return null;
  }
};
const LmcbLmebCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        {data['data'][Index].LMCB}<br/>{data['data'][Index].LMEB}
      </Cell>
    )
  } else {
    return null;
  }
};
const GrossCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    let dispGross = [];
    for (let key in data['data'][Index].GROSS) {
      dispGross.push(<td key={key} className="gross-data-style">{data['data'][Index].GROSS[key]}</td>);
    }

    return (
      <Cell {...props}>
        <table className="table-uncondensed">
          <tbody>
          <tr>
            {dispGross}
          </tr>
          </tbody>
        </table>
      </Cell>
    )
  } else {
    return null;
  }
};
const ResultsCell = ({rowIndex, data, ...props}) => {
  let Index;
  if (data._indexMap == undefined) {
    Index = rowIndex
  } else {
    Index = data._indexMap[rowIndex];
  }
  if (Index !== undefined) {
    return (
      <Cell {...props}>
        <div className="DesklogImages">
          {data['data'][Index].Results == 'Sold' && <img src='../images/Sold.png'/>}
          {data['data'][Index].Results == 'Just Looking' && <strong>Just Looking</strong>}
        </div>
      </Cell>
    )
  } else {
    return null;
  }
};

/*sorting*/
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
/*********************/

class DeskLogComponent extends React.Component {
  constructor(props) {
    super(props);

    this._dataList = new LogData(dataList);

    this._defaultSortIndexes = [];
    let size = this._dataList.getSize();
    for (let index = 0; index < size; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.state = {
      sortedDataList: this._dataList,
      colSortDirs: {}
    };

  }

  _onSortChange = (columnKey, sortDir) => {

    let sortIndexes = this._defaultSortIndexes.slice();
    let splitCol = columnKey.split('.')
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

  }
  //***searching***//
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

    //compare with each column data
      let {type,DeskMgr,Customer,Score,Vehicle,variableSeller,Dealer,LMC,LMCB,GROSS,Results} = this._dataList['data'][index];
     if (type.toLowerCase().indexOf(filterBy) !== -1 || DeskMgr.toLowerCase().indexOf(filterBy) !== -1 ||Customer.ID.toLowerCase().indexOf(filterBy) !== -1 ||Customer.Source.toLowerCase().indexOf(filterBy) !== -1||Customer.name.toLowerCase().indexOf(filterBy) !== -1  ||Score.indexOf(filterBy) !== -1 ||Vehicle.name.toLowerCase().indexOf(filterBy) !== -1 ||Vehicle.type.toLowerCase().indexOf(filterBy) !== -1 ||Vehicle.Stock.toLowerCase().indexOf(filterBy) !== -1 ||variableSeller.Seller1.toLowerCase().indexOf(filterBy) !== -1 ||variableSeller.Seller2.toLowerCase().indexOf(filterBy) !== -1 ||Dealer.dealer3.toLowerCase().indexOf(filterBy) !== -1 ||Dealer.dealer4.toLowerCase().indexOf(filterBy) !== -1 ||LMC.indexOf(filterBy) !== -1 ||LMCB.indexOf(filterBy) !== -1 ||Results.toLowerCase().indexOf(filterBy) !== -1) {
        filteredIndexes.push(index);
      }else{
        for(let i=0;i<GROSS.length;i++){
          if(GROSS[i].indexOf(filterBy) !== -1){
            filteredIndexes.push(index);
          }
        }
      }
    }

    this.setState({
      sortedDataList: new DataListWrapper(filteredIndexes, this._dataList)
    });
  }


  render() {
    let {sortedDataList, colSortDirs} = this.state;

    return (

      <div className="log-table">
        <input type="text" className="search-field" placeholder="Search" onChange={this._onFilterChange}/><br/>
        <center>
          {sortedDataList.getSize() > 0? (<Table
              maxHeight={650}
              width={1200}
              rowsCount={sortedDataList.getSize()}
              rowHeight={150}
              headerHeight={30} {...this.props}>

              <Column
                columnKey="type"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.type}>
                    TYPE TIME
                  </SortHeaderCell>
                }
                cell={<TypeTimeCell data={sortedDataList}/>}
                width={200}
              />

              <Column
                columnKey="DeskMgr"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.DeskMgr}>
                    LOCATION DESK MGR
                  </SortHeaderCell>
                }
                cell={<LocationDeskMgrCell data={sortedDataList}/>}
                width={200}
              />
              <Column
                columnKey="Customer.ID"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.Customer_ID}
                  >
                    <div>SOURCE</div>
                    ID
                  </SortHeaderCell>
                }
                cell={<SourceIdCell data={sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="Customer.name"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.Customer_name}>
                    CUSTOMER
                  </SortHeaderCell>
                }
                cell={<CustomerCell data={sortedDataList}/>}
                width={250}
              />
              <Column
                columnKey="Score"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.Score}>
                    SCORE
                  </SortHeaderCell>
                }
                cell={<ScoreCell data={sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="Vehicle.type"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.Vehicle_type}>
                    N/U/D STOCK#
                  </SortHeaderCell>
                }
                cell={<NUDStockCell data={sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="Vehicle.name"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.Vehicle_name}>
                    VEHICLE TRADE
                  </SortHeaderCell>
                }
                cell={<VehicleTradeCell data={sortedDataList}/>}
                width={200}
              />
              <Column
                header={
                  <SortHeaderCell
                    onSortChange={null}>
                    THE ROAD TO SALE
                  </SortHeaderCell>
                }
                cell={<TheRoadToSaleCell data={sortedDataList}/>}
                width={300}
              />
              <Column
                columnKey="variableSeller"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.variableSeller}>
                    SELLER
                  </SortHeaderCell>
                }
                cell={<SellerCell data={sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="Dealer"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.Dealer}>
                    DEALER
                  </SortHeaderCell>
                }
                cell={<DealerCell data={sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="LMC"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.LMC}>
                    LMC LME
                  </SortHeaderCell>
                }
                cell={<LmcLmeCell data={sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="LMCB"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.LMCB}>
                    LMCB LMEB
                  </SortHeaderCell>
                }
                cell={<LmcbLmebCell data={sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="GROSS"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.GROSS}>
                    GROSS
                  </SortHeaderCell>
                }
                cell={<GrossCell data={sortedDataList}/>}
                width={100}
              />
              <Column
                columnKey="Results"
                header={
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.Results}>
                    RESULTS
                  </SortHeaderCell>
                }
                cell={<ResultsCell data={sortedDataList}/>}
                width={100}
              />

            </Table>):<h3 style={{color:'red'}}>There are no records to display.</h3>}

        </center>
      </div>


    );
  }
}

DeskLogComponent.displayName = 'DeskLogComponent';

// Uncomment properties you need
// DeskLogComponent.propTypes = {};
// DeskLogComponent.defaultProps = {};

export default DeskLogComponent;
