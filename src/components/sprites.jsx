import React, { Component, PropTypes } from 'react';

export default class Sprites extends Component {
	render() {
	    return (
     	<div style={this.props.style} id='sprites' onWheel={this.props.onWheel} onMouseDown={this.props.onMouseDown} onContextMenu={this.props.onContextMenu}>
      		{this.props.children}
     	</div>
   )
	}
}

Sprites.propTypes = {
	style: PropTypes.object,
	onWheel: PropTypes.func,
	onMouseDown: PropTypes.func,
	onContextMenu: PropTypes.func,
}
