'use strict';

import React from 'react';

require('styles//Inventory.css');

class InventoryComponent extends React.Component {
  render() {
    return (

      <div className="row">
        <div className="col-lg-12">
          <div className="form-group row">
            <label className="col-md-2 form-control-label pt-1">&nbsp;Stock Type:</label>
            <div className="col-md-10 pt-q">
              <div className="radio">
                <label className="radio-inline" htmlFor="new">
                  <input type="radio" id="new" name="stocktype" value="New"/>
                  <span className="checked-active">New</span>
                </label>
                <label className="radio-inline" htmlFor="used">
                  <input type="radio" id="used" name="stocktype" value="Used"/>
                  <span className="checked-active">Used</span>
                </label>
                <label className="radio-inline" htmlFor="demo">
                  <input type="radio" id="demo" name="stocktype" value="Demo"/>
                  <span className="checked-active">Demo</span>
                </label>
                <label className="radio-inline" htmlFor="wholesale">
                  <input type="radio" id="wholesale" name="stocktype" value="Wholesale"/>
                  <span className="checked-active">Wholesale</span>
                </label>
                <label className="radio-inline" htmlFor="all">
                  <input type="radio" id="all" name="stocktype" value="" defaultChecked="defaultChecked"/>
                  <span className="checked-active">All</span>
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

InventoryComponent.displayName = 'InventoryComponent';

// Uncomment properties you need
// InventoryComponent.propTypes = {};
// InventoryComponent.defaultProps = {};

export default InventoryComponent;
