import React, { Component, PropTypes } from 'react';

export default class Top extends Component {
	render() {
		const s = this.props;
	    return (
	      <div id="top" >
	     	    <textarea  id="jsoncode" value={s.json ? s.json : ''}/>
		        <textarea  id="jsontext" onChange={s.jsontext} placeholder="Object Json"/>
		        <input id ="spritesSrc" value={s.spritesSrc} onChange={s.spritesSrcF}  />
		        <input id ="objectname" onChange={s.objectname}  placeholder="Object Name"/>
		        <input id ="mapWidth" onChange={s.mapWidth} value={s.width} />
		        <input id ="mapHeight" onChange={s.mapHeight} value={s.height} />
	     </div>
	      )
	}
}