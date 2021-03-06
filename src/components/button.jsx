import React, { Component, PropTypes } from 'react';

export default class Button extends Component {
	render() {
	    return (
     	<span>
				<input id={this.props.id ? this.props.id : null}
					type='button'
					onClick={this.props.onClick ? this.props.onClick : null}
					value={this.props.value ? this.props.value : ''}
      			   readOnly={this.props.readOnly ? true : false} />
     	</span>
   )
	}
}

Button.propTypes = {
	id: PropTypes.string,
	title: PropTypes.string,
	value: PropTypes.string,
	readOnly: PropTypes.bool,
	onChange: PropTypes.func,
	onClick: PropTypes.func,
};
