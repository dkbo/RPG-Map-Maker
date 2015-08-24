"use strict";var init={},image=new Image;init.wheelSpeed=4,init.moveSpeed=1,init.mapSetinterval=1e3/60,init.map={left:!1,up:!1,right:!1,down:!1},init.alt=!1,init.drawIsMove=!1,init.mouseDownX=0,init.mouseDownY=0,init.mouseMoveX=0,init.mouseMoveY=0,init.mouseMoveW=0,init.mouseMoveH=0,init.isMoveArr=[],init.arr=[],init.img=["http://dkbo.github.io/images/rpg_maker_xp.png"];var Sprites=React.createClass({displayName:"Sprites",render:function(){return React.createElement("div",{style:this.props.style,id:"sprites",onWheel:this.props.onWheel,onMouseDown:this.props.onMouseDown,onContextMenu:this.props.onContextMenu},this.props.children)}}),Top=React.createClass({displayName:"Top",render:function(){return React.createElement("div",{id:"top"},this.props.children)}}),Root=React.createClass({displayName:"Root",getDefaultProps:function(){return{left:-init.moveSpeed,right:init.moveSpeed,up:-init.moveSpeed,down:init.moveSpeed,map:{width:1920,height:1080,sX:32,sY:32}}},getInitialState:function(){return{sprite:{top:0},mapTop:0,mapLeft:0,width:this.props.map.width,height:this.props.map.height,sourceX:!1,sourceY:!1,sourceW:this.props.map.sX,sourceH:this.props.map.sY,gridX:!1,gridY:!1,opacityF:1,opacityB:1,opacityM:1,json:null,spritesSrc:"http://dkbo.github.io/images/rpg_maker_xp.png"}},handleMouseDown:function(t){if(init.scontext.clearRect(0,0,256,12e3),0==t.button){var e=(window.innerHeight,this.props.map.sX*Math.floor(t.clientX/this.props.map.sX)),i=this.props.map.sY*Math.floor((t.clientY-100+this.props.map.sY*-this.state.sprite.top)/this.props.map.sY),s=this.state.sourceW,a=this.state.sourceH;this.state.sourceX===!1?this.setState({sourceX:e,sourceY:i}):(e>this.state.sourceX?(s=e-this.state.sourceX+this.props.map.sX,e=this.state.sourceX):s=this.state.sourceX-e+this.props.map.sX,i>this.state.sourceX?(a=i-this.state.sourceY+this.props.map.sY,i=this.state.sourceY):a=this.state.sourceY-i+32,this.setState({sourceX:e,sourceY:i,sourceW:s,sourceH:a})),init.scontext.beginPath(),init.scontext.rect(e,i,s,a),init.scontext.fillStyle="rgba(27, 136, 224, 0.53)",init.scontext.fill(),init.scontext.lineWidth=2,init.scontext.strokeStyle="black",init.scontext.stroke()}else this.setState({sourceX:!1,sourceY:!1,sourceW:this.props.map.sX,sourceH:this.props.map.sY})},handleWheel:function(t){var e=t.deltaY/100*init.wheelSpeed,i=this.state.sprite;i.top+-e<=0&&(i.top+=-e,this.setState({sprite:i}))},handleChange:function(t){var e=JSON.parse(t.target.value);"object"==typeof e&&(t.target.value=null,this.drawJson(e))},handleObjectName:function(t){init.objectName=t.target.value},handleSprite:function(t){this.isReaptImg(t.target.value)&&(image.src=t.target.value,init.img.push(t.target.value)),this.setState({spritesSrc:t.target.value})},isReaptImg:function(t){for(var e=0;e<init.img.length;e++)if(init.img[e]===t)return!1;return!0},mapWidth:function(t){this.setState({width:t.target.value})},mapHeight:function(t){this.setState({height:t.target.value})},contextMenu:function(t){t.preventDefault()},drawJson:function(t){var e=t.styles,i=this.state;init.fcontext.clearRect(0,0,i.width,i.height),init.bcontext.clearRect(0,0,i.width,i.height),init.mcontext.clearRect(0,0,i.width,i.height);for(var s=0;s<e.length;s++)image.src=e[s].b,2==e[s].z?init.fcontext.drawImage(image,e[s].x,e[s].y,e[s].w,e[s].h,e[s].l,e[s].t,e[s].w,e[s].h):init.bcontext.drawImage(image,e[s].x,e[s].y,e[s].w,e[s].h,e[s].l,e[s].t,e[s].w,e[s].h);for(var s=0;s<t.isMove.length;s++)init.mcontext.beginPath(),init.mcontext.rect(t.isMove[s].x,t.isMove[s].y,t.isMove[s].w,t.isMove[s].h),init.mcontext.fillStyle="rgba(27, 136, 224, 0.53)",init.mcontext.fill();init.arr=e,init.isMoveArr=t.isMove,this.setState({json:JSON.stringify(t,null,"	")})},drawDown:function(t){var e=Math.floor((t.clientX-256-this.state.mapLeft*this.props.map.sX)/this.props.map.sX)*this.props.map.sX,i=Math.floor((t.clientY-100-this.state.mapTop*this.props.map.sY)/this.props.map.sY)*this.props.map.sY;if(this.state.sourceX!==!1)switch(t.button){case 0:this.draw(e,i,0);break;case 2:this.draw(e,i,2)}else if(init.alt)switch(t.button){case 0:init.drawIsMove=!0,init.mouseDownX=t.clientX,init.mouseDownY=t.clientY}},drawMove:function(t){init.drawIsMove&&(init.mcontext.clearRect(init.mouseMoveX,init.mouseMoveY,init.mouseMoveW,init.mouseMoveH),init.mouseMoveX=t.clientX>init.mouseDownX?init.mouseDownX-255:t.clientX-255,init.mouseMoveY=t.clientY>init.mouseDownY?init.mouseDownY-100:t.clientY-100,init.mouseMoveW=t.clientX-init.mouseDownX>0?t.clientX-init.mouseDownX:init.mouseDownX-t.clientX,init.mouseMoveH=t.clientY-init.mouseDownY>0?t.clientY-init.mouseDownY:init.mouseDownY-t.clientY,init.mcontext.beginPath(),init.mcontext.rect(init.mouseMoveX,init.mouseMoveY,init.mouseMoveW,init.mouseMoveH),init.mcontext.fillStyle="rgba(27, 136, 224, 0.53)",init.mcontext.fill())},drawUp:function(t){!this.state.sourceX&&init.alt&&(init.drawIsMove=!1,this.pushIsMove())},pushIsMove:function(){var t={};t.mx=init.mouseMoveX,t.my=init.mouseMoveY,t.mw=init.mouseMoveW,t.mh=init.mouseMoveH,init.mouseMoveX=0,init.mouseMoveY=0,init.mouseMoveW=0,init.mouseMoveH=0,init.isMoveArr.push(t);var e={styles:init.arr,isMove:init.isMoveArr};this.setState({json:JSON.stringify(e,null,"	")})},mapKeyDown:function(t){switch(t.keyCode){case 71:this.drawGridX(),this.drawGridY();break;case 70:this.opacityF();break;case 66:this.opacityB();break;case 77:this.opacityM();break;case 37:init.map.left=!0;break;case 65:init.map.left=!0;break;case 39:init.map.right=!0;break;case 68:init.map.right=!0;break;case 38:init.map.up=!0;break;case 87:init.map.up=!0;break;case 40:init.map.down=!0;break;case 83:init.map.down=!0,this.save();break;case 76:this.load();break;case 67:this.clear();break;case 18:init.alt=!0}},mapKeyUp:function(t){switch(t.keyCode){case 37:init.map.left=!1;break;case 65:init.map.left=!1;break;case 39:init.map.right=!1;break;case 68:init.map.right=!1;break;case 38:init.map.up=!1;break;case 87:init.map.up=!1;break;case 40:init.map.down=!1;break;case 83:init.map.down=!1;break;case 18:init.alt=!1}},opacityF:function(){this.setState({opacityF:this.state.opacityF?0:1})},opacityB:function(){this.setState({opacityB:this.state.opacityB?0:1})},opacityM:function(){this.setState({opacityM:this.state.opacityM?0:1})},drawGridX:function(){if(this.state.gridX)init.gcontext.clearRect(0,0,this.state.width,this.state.height);else{init.gcontext.beginPath();for(var t=1;t<this.state.width/this.props.map.sX;t++)init.gcontext.moveTo(t*this.props.map.sX,this.props.map.sY),init.gcontext.lineTo(t*this.props.map.sX,this.state.height),init.gcontext.font="italic .5em Calibri",init.gcontext.textAlign="center",init.gcontext.fillText(t*this.props.map.sX,t*this.props.map.sX,20);init.gcontext.stroke()}this.setState({gridX:!this.state.gridX})},drawGridY:function(){if(this.state.gridY)init.gcontext.clearRect(0,0,this.state.width,this.state.height);else{init.gcontext.beginPath();for(var t=1;t<this.state.height/this.props.map.sY;t++)init.gcontext.moveTo(this.props.map.sX,t*this.props.map.sY),init.gcontext.lineTo(this.state.width,t*this.props.map.sY),init.gcontext.font="italic .5em Calibri",init.gcontext.textAlign="center",init.gcontext.fillText(t*this.props.map.sY,20,t*this.props.map.sY+4);init.gcontext.stroke()}this.setState({gridY:!this.state.gridY})},save:function(){if(init.alt){var t={width:this.state.width,height:this.state.height},e={styles:init.arr,isMove:init.isMoveArr};localStorage.dkbo=JSON.stringify(e),localStorage.dkbomap=JSON.stringify(t)}},load:function(){if(init.alt){var t=JSON.parse(localStorage.dkbomap);this.setState({width:t.width,height:t.height}),this.drawJson(JSON.parse(localStorage.dkbo))}},clear:function(){if(init.alt){this.state.opacityF&&this.state.opacityB&&(init.fcontext.clearRect(0,0,this.state.width,this.state.height),init.bcontext.clearRect(0,0,this.state.width,this.state.height),init.arr=[]),this.state.opacityM&&(init.mcontext.clearRect(0,0,this.state.width,this.state.height),init.isMoveArr=[]);var t={styles:init.arr,isMove:init.isMoveArr};this.setState({json:JSON.stringify(t,null,"	")})}},draw:function(t,e,i){var s=this.state;image.src=this.state.spritesSrc;var a={n:init.objectName,l:t,t:e,w:s.sourceW,h:s.sourceH,b:image.src,x:s.sourceX,y:s.sourceY};2==i?(a.zIndex=2,init.fcontext.drawImage(image,s.sourceX,s.sourceY,s.sourceW,s.sourceH,t,e,s.sourceW,s.sourceH)):init.bcontext.drawImage(image,s.sourceX,s.sourceY,s.sourceW,s.sourceH,t,e,s.sourceW,s.sourceH),init.arr.push(a),a={styles:init.arr,isMove:init.isMoveArr},this.setState({json:JSON.stringify(a,null,"	")})},drawIsMove:function(t,e){},mapMove:function(){init.alt||(init.map.left&&this.state.mapLeft-this.props.left<=0&&this.setState({mapLeft:this.state.mapLeft-this.props.left}),init.map.right&&this.setState({mapLeft:this.state.mapLeft-this.props.right}),init.map.up&&this.state.mapTop-this.props.up<=0&&this.setState({mapTop:this.state.mapTop-this.props.up}),init.map.down&&this.setState({mapTop:this.state.mapTop-this.props.down}))},componentDidMount:function(){var t=document.getElementById("objectFront"),e=document.getElementById("objectBack"),i=document.getElementById("objectIsMove"),s=document.getElementById("spriteCanvas"),a=document.getElementById("grid");init.fcontext=t.getContext("2d"),init.bcontext=e.getContext("2d"),init.mcontext=i.getContext("2d"),init.scontext=s.getContext("2d"),init.gcontext=a.getContext("2d"),$(window).on("keydown",this.mapKeyDown),$(window).on("keyup",this.mapKeyUp),this.timer=setInterval(this.mapMove.bind(this),init.mapSetinterval)},render:function(){return React.createElement("body",null,React.createElement("div",{id:"map",style:{WebkitTransform:"translate3D("+this.state.mapLeft*this.props.map.sX+"px,"+this.state.mapTop*this.props.map.sY+"px,0)",msTransform:"translate3D("+this.state.mapLeft*this.props.map.sX+"px,"+this.state.mapTop*this.props.map.sY+"px,0)",transform:"translate3D("+this.state.mapLeft*this.props.map.sX+"px,"+this.state.mapTop*this.props.map.sY+"px,0)",width:this.state.width,height:this.state.height},onMouseDown:this.drawDown,onMouseMove:this.drawMove,onMouseUp:this.drawUp,onContextMenu:this.contextMenu},React.createElement("canvas",{width:this.state.width,height:this.state.height,style:{opacity:this.state.opacityB},id:"objectBack"}),React.createElement("canvas",{width:this.state.width,height:this.state.height,style:{opacity:this.state.opacityF},id:"objectFront"}),React.createElement("canvas",{width:this.state.width,height:this.state.height,style:{opacity:this.state.opacityM},id:"objectIsMove"}),React.createElement("canvas",{width:this.state.width,height:this.state.height,id:"grid"})),React.createElement(Sprites,{style:{WebkitTransform:"translateY("+this.state.sprite.top*this.props.map.sY+"px)",msTransform:"translateY("+this.state.sprite.top*this.props.map.sY+"px)",transform:"translateY("+this.state.sprite.top*this.props.map.sY+"px)"},onWheel:this.handleWheel,onMouseDown:this.handleMouseDown,onContextMenu:this.contextMenu},React.createElement("canvas",{width:"256",height:"12000",id:"spriteCanvas"}),React.createElement("img",{src:this.state.spritesSrc})),React.createElement(Top,null,React.createElement("textarea",{id:"jsoncode",value:this.state.json}),React.createElement("textarea",{id:"jsontext",onChange:this.handleChange,placeholder:"Object Json"}),React.createElement("input",{id:"spritesSrc",value:this.state.spritesSrc,onChange:this.handleSprite}),React.createElement("input",{id:"objectname",onChange:this.handleObjectName,placeholder:"Object Name"}),React.createElement("input",{id:"mapWidth",onChange:this.mapWidth,value:this.state.width}),React.createElement("input",{id:"mapHeight",onChange:this.mapHeight,value:this.state.height})))}}),map=React.render(React.createElement(Root,null),document.body);