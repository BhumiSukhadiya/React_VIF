'use strict';

import React from 'react';

import {connect} from 'react-redux';

require('styles//About.css');

class AboutComponent extends React.Component {

  render() {
    return (
      <div >
        <center>
        About page
        <img src="../images/yeoman.png"/>
        </center>
      </div>
    );
  }
}

export default connect()(AboutComponent);
