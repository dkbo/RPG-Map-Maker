import React, { Component} from 'react';

export default class Ui extends Component {
	render() {
	    return (
	      <div className='ui'>
      		{this.props.children}
      	  </div>
	    )
	}
}
