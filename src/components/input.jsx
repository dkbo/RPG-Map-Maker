import React, { Component, PropTypes } from 'react';

export default class Input extends Component {
	render() {
	    return (
     	<p>
      		<label htmlFor={this.props.id}>{this.props.title}</label>
      		<input type={this.props.type ? this.props.type : null}
      			   onChange={this.props.onChange ? this.props.onChange : null}
      			   value={this.props.value ? this.props.value : ''}
      			   readOnly={this.props.readOnly ? true : false}
      			   placeholder={this.props.placeholder ? this.props.placeholder : null} />
     	</p>
   )
	}
}
