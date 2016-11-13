import React, { Component, PropTypes } from 'react';

export default class Top extends Component {
	render() {
		const {json, jsontext, spritesSrc, spritesSrcF, objectname, mapWidth, width, mapHeight, height} = this.props;
	    return (
	      <div id='top' >
	     	    <textarea  id='jsoncode' value={json ? json : ''}/>
		        <textarea  id='jsontext' onChange={jsontext} placeholder='Object Json'/>
						<select name="spritesSrc" id="spritesSrc" value={this.props.sprites} onChange={this.props.spritesSrc}>
							<option value={0}>NPC</option>
							<option value={1}>拼圖一</option>
							<option value={2}>拼圖二</option>
						</select>
		        <input id ='objectname' onChange={objectname}  placeholder='Object Name'/>
		        <input id ='mapWidth' onChange={mapWidth} value={width} />
		        <input id ='mapHeight' onChange={mapHeight} value={height} />
	     </div>
	    )
	}
}

Top.propTypes = {
	json: PropTypes.string,
	jsontext: PropTypes.func,
	sprites: PropTypes.number,
	spritesSrc: PropTypes.func,
	objectname: PropTypes.func,
	mapWidth: PropTypes.func,
	width: PropTypes.number,
	mapHeight: PropTypes.func,
	height: PropTypes.number,
};
