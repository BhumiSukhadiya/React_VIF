'use strict';

import React from 'react';

require('styles//DealMaker.css');

class DealMakerComponent extends React.Component {
  constructor(){
    super();
    this.state={
      c:0
    }
  }
  onInc=()=>{
    this.setState((prevState)=>({
      c:prevState.c+1
    }));
    this.setState((prevState)=>({
      c:prevState.c+1
    }));
    this.setState((prevState)=>({
      c:prevState.c+1
    }));


    /*this.setState({
      c:this.state.c+1
    });
    this.setState({
      c:this.state.c+1
    });*/
  }
  render() {
    return (
      <div >
        {this.state.c}
        <button onClick={this.onInc}>click</button>

      </div>
    );
  }
}

DealMakerComponent.displayName = 'DealMakerComponent';

// Uncomment properties you need
// DealMakerComponent.propTypes = {};
// DealMakerComponent.defaultProps = {};

export default DealMakerComponent;
