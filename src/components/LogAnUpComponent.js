'use strict';

import React from 'react';

require('styles//LogAnUp.css');

class LogAnUpComponent extends React.Component {
  render() {
    return (
      <div >
        Log An Up
      </div>
    );
  }
}

LogAnUpComponent.displayName = 'LogAnUpComponent';

// Uncomment properties you need
// LogAnUpComponent.propTypes = {};
// LogAnUpComponent.defaultProps = {};

export default LogAnUpComponent;
