
var Sprites = React.createClass({
  render : function(){
   return (
     <div style={this.props.style} id="sprites" onWheel={this.props.onWheel} onMouseDown={this.props.onMouseDown} onContextMenu={this.props.onContextMenu}>
      {this.props.children}
     </div>
   )
  }
});
var Top = React.createClass({
  render : function(){
   return (
    <div id="top" >
     {this.props.children}
     </div>
   ) 
  }
});
var Root = React.createClass({
  getDefaultProps : function(){
    return{
      left : -init.moveSpeed,
      right : init.moveSpeed,
      up : -init.moveSpeed,
      down : init.moveSpeed,
      map :{
        width : 1920,
        height: 1080,
        sX : 32,
        sY : 32
    }
    }
  },
  getInitialState : function(){
    return{
      sprite:{
        top : 0
      },
      objectNum:0,
      mapObjects:null,
      mapTop: 0,
      mapLeft:0,
      width : this.props.map.width,
      height: this.props.map.height,
      sourceX : false,
      sourceY : false,
      sourceW : this.props.map.sX,
      sourceH : this.props.map.sY,
      gridX : false,
      gridY : false,
      opacityF: 1,
      opacityB : 1,
      opacityM : 1,
      json : null,
      jsonParse : {
        styles:[],
        isMove:[]
      },
      spritesSrc : "http://dkbo.github.io/images/rpg_maker_xp.png"
    }
  },
  handleMouseDown : function(e){
    init.scontext.clearRect(0, 0, 256, 12000);
    if(e.button == 0){
     var height = window.innerHeight;
     var x = this.props.map.sX*Math.floor(e.clientX/this.props.map.sX);
     var y = this.props.map.sY*Math.floor((e.clientY - 100 + this.props.map.sY * -this.state.sprite.top)/this.props.map.sY);
     var w = this.state.sourceW;
     var h = this.state.sourceH;
     if(this.state.sourceX === false )
     this.setState({sourceX:x,sourceY:y})
     else {
       if(x > this.state.sourceX){
         w = x-this.state.sourceX + this.props.map.sX;
         x = this.state.sourceX;
       }
       else{
         w = this.state.sourceX - x +this.props.map.sX              
       }
       if(y > this.state.sourceX){
         h = y-this.state.sourceY + this.props.map.sY;
         y = this.state.sourceY;
       }
       else{
         h = this.state.sourceY - y +32
       }
       this.setState({
         sourceX : x,
         sourceY : y,
         sourceW : w,
         sourceH : h
       });
     }
    init.scontext.beginPath();
     init.scontext.rect(x, y, w, h);
     init.scontext.fillStyle = "rgba(27, 136, 224, 0.53)";
     init.scontext.fill();
     init.scontext.lineWidth = 2;
     init.scontext.strokeStyle = 'black';
     init.scontext.stroke();
    }
    else{
      this.setState({
         sourceX : false,
         sourceY : false,
         sourceW : this.props.map.sX,
         sourceH : this.props.map.sY
      });
    }
 
  },
  handleWheel : function(e){
    var x = e.deltaY/100*init.wheelSpeed;
    var y = this.state.sprite
    if(y.top +-x <=0){
    y.top += -x;
    this.setState({
      sprite : y
    })
    }
  },
  handleChange : function(e){
    var x =  JSON.parse(e.target.value)
    if(typeof(x) === 'object'){
     e.target.value = null
    this.drawJson(x);
    }
  },
  handleObjectName : function(e){
    init.objectName = e.target.value;
  },
  handleSprite : function(e){
    var img;
    if(this.isReaptImg(e.target.value)){
    var i = init.pre.length;
    img = new Image();  
    img.src=e.target.value; 
    init.img.push(img.src)
    }
    this.setState({spritesSrc : e.target.value})
  },
  isReaptImg : function(x){
    for(var i=0;i<init.img.length;i++){
      if(init.img[i] === x){
        return false
      }
    }
    return true
  },
  mapWidth : function(e){
    this.setState({width :e.target.value})
  },
  mapHeight : function(e){
    this.setState({height :e.target.value})
  },
  contextMenu: function(e) {
    e.preventDefault();
},
  drawJson : function(x){
    var xs = x.styles;
    var s = this.state;
    init.fcontext.clearRect(0, 0, s.width, s.height);
    init.bcontext.clearRect(0, 0, s.width, s.height);
    init.mcontext.clearRect(0, 0, s.width, s.height);
    for(var i=0;i<xs.length;i++){
    if(this.drawJsonPreImg(xs[i].b)){
    image.src = xs[i].b;
    if(xs[i].z == 2)
      init.fcontext.drawImage(image, xs[i].x , xs[i].y , xs[i].w, xs[i].h , xs[i].l,  xs[i].t ,  xs[i].w,  xs[i].h);
    
    else
      init.bcontext.drawImage(image, xs[i].x , xs[i].y , xs[i].w, xs[i].h , xs[i].l,  xs[i].t ,  xs[i].w,  xs[i].h);
 
    }
  }
    for(var i=0;i<x.isMove.length;i++){
      init.mcontext.beginPath();
      init.mcontext.rect(x.isMove[i].x,x.isMove[i].y, x.isMove[i].w,x.isMove[i].h);
      init.mcontext.fillStyle = "rgba(27, 136, 224, 0.83)";
      init.mcontext.fill();
    }
    init.arr = xs;
    init.isMoveArr = x.isMove;
    this.setState({json : JSON.stringify(x, null, '\t')})
  },
  drawJsonPreImg : function(x){
    var y = false;
    for(var j=0;j<init.img.length;j++){
        if(x === init.img[j]){
          y = true;
          break;
        }
    }
    if(!y){
      img = new Image();
      img.onload = function(){
        return y
      }.bind(this);
      img.src = x; 
      init.img.push(x);
    }
    return y
  },
  drawDown : function(e){
    var x = (Math.floor((e.clientX - 256 -this.state.mapLeft*this.props.map.sX)/this.props.map.sX)*this.props.map.sX)
    var y = (Math.floor((e.clientY - 100 -this.state.mapTop*this.props.map.sY)/this.props.map.sY)*this.props.map.sY)
    if(this.state.sourceX !== false){
    switch(e.button){
      case 0 :
        this.draw(x,y,0);
        break  
      case 2 :
        this.draw(x,y,2);
        break
    }  }
    else{
      if(init.alt){
      switch(e.button){
      case 0 :
        init.drawIsMove = true;
        init.mouseDownX = e.clientX;
        init.mouseDownY = e.clientY;
        break;
    } 
    }
   }
  },
drawMove : function(e){
  if(init.drawIsMove){
    init.mcontext.clearRect(init.mouseMoveX,init.mouseMoveY, init.mouseMoveW, init.mouseMoveH);
    init.mouseMoveX  = e.clientX > init.mouseDownX ? init.mouseDownX-255 - (this.state.mapLeft*this.props.map.sX): e.clientX-255 - (this.state.mapLeft*this.props.map.sX);
    init.mouseMoveY  = e.clientY > init.mouseDownY ? init.mouseDownY-100 - (this.state.mapTop*this.props.map.sY): e.clientY-100 - (this.state.mapTop*this.props.map.sY);
    init.mouseMoveW  = e.clientX - init.mouseDownX > 0 ? e.clientX - init.mouseDownX : init.mouseDownX -e.clientX;
    init.mouseMoveH  = e.clientY - init.mouseDownY > 0 ? e.clientY - init.mouseDownY : init.mouseDownY -e.clientY; 
    
    init.mcontext.beginPath();
    init.mcontext.rect(init.mouseMoveX, init.mouseMoveY, init.mouseMoveW, init.mouseMoveH);
    init.mcontext.fillStyle = "rgba(27, 136, 224, 0.83)";
    init.mcontext.fill();

  }
},
drawUp : function(e){
  if(!this.state.sourceX && init.alt){
  init.drawIsMove = false;
  this.pushIsMove()
  }
},
pushIsMove(){
  var x = {};
  x.n = init.objectName;
  x.x = init.mouseMoveX;
  x.y = init.mouseMoveY;
  x.w = init.mouseMoveW;
  x.h = init.mouseMoveH;  
  init.mouseMoveX = 0;
  init.mouseMoveY = 0;
  init.mouseMoveW = 0;
  init.mouseMoveH = 0;
  init.isMoveArr.push(x)
  var json = {
      styles : init.arr,
      isMove : init.isMoveArr
    }
  this.setState({json : JSON.stringify(json, null, '\t'),jsonParse:json,objectNum:init.isMoveArr.length-1,mapObjects:3})
},
  mapKeyDown : function(e){
        switch(e.keyCode){
          case 71: //g
             this.drawGridX();
             this.drawGridY();
             break;
          case 70: //f
             this.opacityF();
             break;
          case 66: //g
             this.opacityB();
             break;
          case 77: //m
             this.opacityM();
             break;
          case 37:
              init.map.left = true
              break;
          case 65:
              init.map.left = true 
              break;
          case 39:
              init.map.right = true
              break;
          case 68:
              init.map.right = true 
              break;
          case 38:
              init.map.up = true
              break;
          case 87:
              init.map.up = true
              break;
          case 40:
              init.map.down = true
              break;
          case 83:
              init.map.down = true
              this.save();
              break;
          case 76:
              this.load();
              break;
          case 67:
              this.clear();
              break;
          case 18:
              init.alt = true;
              break;

        }
  },
  mapKeyUp : function(e){
        switch(e.keyCode){
          case 37:
              init.map.left = false
              break;
          case 65:
              init.map.left = false
              break;
 
          case 39:
              init.map.right = false
              break;
          case 68:
              init.map.right = false
              break;
          case 38:
              init.map.up = false
              break;
          case 87:
              init.map.up = false
              break;
          case 40:
              init.map.down = false
              break;
          case 83:
              init.map.down = false
              break;
          case 18:
              init.alt = false
              break;
 
        }
  },
  opacityF : function(){
    this.setState({opacityF : this.state.opacityF ? 0 : 1});
  },
  opacityB : function(){
    this.setState({opacityB : this.state.opacityB ? 0 : 1});
  },
  opacityM : function(){
    this.setState({opacityM : this.state.opacityM ? 0 : 1});
  }, 
 drawGridX : function(){
  if(!this.state.gridX){

    init.gcontext.beginPath();
      for(var i=1;i<(this.state.width/this.props.map.sX);i++){
      init.gcontext.moveTo(i*this.props.map.sX,this.props.map.sY);
      init.gcontext.lineTo(i*this.props.map.sX,this.state.height);
      init.gcontext.font = 'italic .5em Calibri';
      init.gcontext.textAlign = 'center';
      init.gcontext.fillText(i*this.props.map.sX, i*this.props.map.sX, 20);
    }
      init.gcontext.stroke();
}
  else{
      init.gcontext.clearRect(0, 0, this.state.width, this.state.height);
  }
  this.setState({gridX : !this.state.gridX});
},
drawGridY : function(){
  if(!this.state.gridY){
    init.gcontext.beginPath();
      for(var j=1;j<(this.state.height/this.props.map.sY);j++){
      init.gcontext.moveTo(this.props.map.sX,j*this.props.map.sY);
      init.gcontext.lineTo(this.state.width,j*this.props.map.sY);
      init.gcontext.font = 'italic .5em Calibri';
      init.gcontext.textAlign = 'center';
      init.gcontext.fillText(j*this.props.map.sY, 20, j*this.props.map.sY+4);
    }
      init.gcontext.stroke();
  }
      else{
      init.gcontext.clearRect(0, 0, this.state.width, this.state.height);
  }
  this.setState({gridY : !this.state.gridY});
},
  save : function(){
    if(init.alt){
    var map = {
      width : this.state.width,
      height : this.state.height
    }
    var json={
      styles : init.arr,
      isMove : init.isMoveArr
    }
    localStorage.dkbo = JSON.stringify(json);
    localStorage.dkbomap = JSON.stringify(map);
    }
  },
  load : function(){
    if(init.alt){
    var map = JSON.parse(localStorage.dkbomap);
    this.setState({width : map.width,height : map.height});
    this.drawJson(JSON.parse(localStorage.dkbo));
    }
  },
  clear : function(){
    if(init.alt){
      if(this.state.opacityF && this.state.opacityB){
        init.fcontext.clearRect(0, 0, this.state.width, this.state.height);
        init.bcontext.clearRect(0, 0, this.state.width, this.state.height);
        init.arr = [];
      }
      if(this.state.opacityM){
        init.mcontext.clearRect(0, 0, this.state.width, this.state.height);
        init.isMoveArr =[];
      }
      var json ={
        styles : init.arr,
        isMove : init.isMoveArr
      }
  this.setState({json: JSON.stringify(json, null, '\t'),jsonParse:json,mapObjects:null});
    }
  },
  draw : function(x,y,z){
    var s = this.state;
    var mapObjects = 2;
    image.src = this.state.spritesSrc;
    var json = {
      n : init.objectName,
      l : x,
      t : y,
      w : s.sourceW,
      h : s.sourceH,
      b : image.src,   
      x : s.sourceX ,
      y :  s.sourceY    
    };
    if(z == 2){
      json.z = 2
      mapObjects = 1
      init.fcontext.drawImage(image, s.sourceX , s.sourceY , s.sourceW, s.sourceH ,x, y , s.sourceW, s.sourceH);
    }
    else
      init.bcontext.drawImage(image, s.sourceX , s.sourceY , s.sourceW, s.sourceH ,x, y , s.sourceW, s.sourceH);
    init.arr.push(json)
    json = {
      styles : init.arr,
      isMove : init.isMoveArr
    }
    this.setState({json : JSON.stringify(json, null, '\t'),jsonParse:json,objectNum: init.arr.length-1,mapObjects:mapObjects})
  },
  drawIsMove : function(x,y){
   
  },
  mapMove : function(){
    if(!init.alt){
    if(init.map.left && this.state.mapLeft - this.props.left <= 0)
      this.setState({mapLeft: this.state.mapLeft-this.props.left});
    if(init.map.right )
      this.setState({mapLeft: this.state.mapLeft-this.props.right});
    if(init.map.up && this.state.mapTop- this.props.up <= 0 ){
    this.setState({mapTop: this.state.mapTop-this.props.up});
  }
    if(init.map.down){
    this.setState({mapTop: this.state.mapTop-this.props.down});
  }
    }
  },
  componentDidMount: function () {
    var fCanvas = document.getElementById('objectFront');
    var bCanvas = document.getElementById('objectBack');
    var mCanvas = document.getElementById('objectIsMove');
    var sCanvas = document.getElementById('spriteCanvas');
    var gCanvas = document.getElementById('grid');
    init.fcontext = fCanvas.getContext('2d');
    init.bcontext = bCanvas.getContext('2d');
    init.mcontext = mCanvas.getContext('2d');
    init.scontext = sCanvas.getContext('2d');
    init.gcontext = gCanvas.getContext('2d');
    $(window).on('keydown',this.mapKeyDown);
    $(window).on('keyup',this.mapKeyUp);
    this.timer = setInterval(this.mapMove.bind(this), init.mapSetinterval);
  },

   handelMapFalse : function(){
    $(window).off('keydown',this.mapKeyDown);
    $(window).off('keyup',this.mapKeyUp);
  },
  handelMapTrue : function(){
    $(window).on('keydown',this.mapKeyDown);
    $(window).on('keyup',this.mapKeyUp);
  },
  handleObjectId : function(e){ 
    var l;
    if(this.state.mapObjects != 3)
      l = this.state.jsonParse.styles.length;
    else
      l = this.state.jsonParse.isMove.length;
    if(!isNaN(Math.floor(e.target.value)) && e.target.value < l && e.target.value >= 0)
      this.setState({objectNum : Math.floor(e.target.value)});
  },
  handleObjectsName : function(e){
    var json = this.state.jsonParse;
    if(this.state.mapObjects == 3)
      json.styles[this.state.objectNum].n = e.target.value;
    else
      json.isMove[this.state.objectNum].n = e.target.value;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
  },
  handleObjectsX : function(e){
    if(!isNaN(e.target.value)){
    var json = this.state.jsonParse;
    json.styles[this.state.objectNum].x = e.target.value;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
  }
  },
  handleObjectsY : function(e){
    if(!isNaN(e.target.value)){
    var json = this.state.jsonParse;
    json.styles[this.state.objectNum].y = e.target.value;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    }
  },
  handleObjectsW : function(e){
    if(!isNaN(e.target.value)){
    var json = this.state.jsonParse;
    json.styles[this.state.objectNum].w = e.target.value;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    }
  },
  handleObjectsH : function(e){
    if(!isNaN(e.target.value)){
    var json = this.state.jsonParse;
    json.styles[this.state.objectNum].h = e.target.value;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    }
  },
  handleObjectsSX : function(e){
    if(!isNaN(e.target.value)){
    var json = this.state.jsonParse;
    json.styles[this.state.objectNum].h = e.target.value;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    }
  },
  handleObjectsSY : function(e){
    if(!isNaN(e.target.value)){
    var json = this.state.jsonParse;
    json.styles[this.state.objectNum].h = e.target.value;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    }
  },
  render : function(){
    var s =this.state;
     var map;
    switch(s.mapObjects){
      case 1 :
        map = "前層";
        break;
      case 2 :
        map = "後層";
        break;
      case 3 :
        map = "碰撞區域";
        break;
    }
   return (
    <div id="container" >
      <div id="map"  style={{
     WebkitTransform : 'translate3D('+s.mapLeft*this.props.map.sX+'px,'+s.mapTop*this.props.map.sY+'px,0)',
     msTransform : 'translate3D('+s.mapLeft*this.props.map.sX+'px,'+s.mapTop*this.props.map.sY+'px,0)',
     transform : 'translate3D('+s.mapLeft*this.props.map.sX+'px,'+s.mapTop*this.props.map.sY+'px,0)',
     width:s.width,
     height:s.height
}} onMouseDown={this.drawDown} onMouseMove={this.drawMove} onMouseUp={this.drawUp} onContextMenu={this.contextMenu}>
        <canvas width={s.width} height={s.height} style={{opacity : s.opacityB}} id="objectBack" />
        <canvas width={s.width} height={s.height} style={{opacity : s.opacityF}} id="objectFront" />
        <canvas width={s.width} height={s.height} style={{opacity : s.opacityM}} id="objectIsMove" />
        <canvas width={s.width} height={s.height} id="grid" />
      </div>
     <Sprites style={{
     WebkitTransform : 'translateY('+s.sprite.top*this.props.map.sY+'px)',
     msTransform : 'translateY('+s.sprite.top*this.props.map.sY+'px)',
     transform : 'translateY('+s.sprite.top*this.props.map.sY+'px)'}} onWheel={this.handleWheel} onMouseDown={this.handleMouseDown} onContextMenu={this.contextMenu} >
        <canvas  width="256" height="12000" id="spriteCanvas" />
        <img src={s.spritesSrc} />
     </Sprites>
      <Top>
        <textarea  id="jsoncode" value={s.json}/>
        <textarea  id="jsontext" onChange={this.handleChange} placeholder="Object Json"/>
        <input id ="spritesSrc" value={s.spritesSrc} onChange={this.handleSprite}  />
        <input id ="objectname" onChange={this.handleObjectName}  placeholder="Object Name"/>
        <input id ="mapWidth" onChange={this.mapWidth} value={s.width} />
        <input id ="mapHeight" onChange={this.mapHeight} value={s.height} />
     </Top>
      {s.mapObjects != 3 && s.mapObjects !=null ? 
        <Ui>
          <label htmlFor="area">區域物件</label>
          <input id="area" value={map} />
          <label htmlFor="id">物件ID</label>
          <input id="id" type="number" onChange={this.handleObjectId}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue}  value={s.objectNum} />
          <label htmlFor="name">物件名</label>
          <input id="name" onChange={this.handleObjectsName}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].n} />
          <label htmlFor="x">X 座標</label>
          <input id="x" onChange={this.handleObjectsX}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue}value={s.jsonParse.styles[s.objectNum].l} />
          <label htmlFor="y">Y 座標</label>
          <input id="y" onChange={this.handleObjectsY}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].t} />
          <label htmlFor="width">物件寬</label>
          <input id="width" onChange={this.handleObjectsW}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].w} />
          <label htmlFor="height">物件高</label>
          <input id="height" onChange={this.handleObjectsH}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].h} />
          <label htmlFor="background">物件主圖</label>
          <input id="background" value={s.jsonParse.styles[s.objectNum].b} />
          <label htmlFor="spriteX">物件拼圖 X 座標</label>
          <input id="spriteX" onChange={this.handleObjectsSX}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].x} />
          <label htmlFor="spriteY">物件拼圖 Y 座標</label>
          <input id="spriteY" onChange={this.handleObjectsSY}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].y} />
          <label htmlFor="zindex">物件前後層</label>
          <input id="zindex" value={s.jsonParse.styles[s.objectNum].z} />
        </Ui>  : null}
      {s.mapObjects == 3 ? 
        <Ui>
          <label htmlFor="area">區域物件</label>
          <input id="area" value={map} />
          <label htmlFor="id">物件ID</label>
          <input id="id" onChange={this.handleObjectId} onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} type="number"  value={s.objectNum} />
          <label htmlFor="name">物件名</label>
          <input id="name" onChange={this.handleObjectsName} onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].n} />
          <label htmlFor="x">X 座標</label>
          <input id="x" onChange={this.handleObjectsX}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].x} />
          <label htmlFor="y">Y 座標</label>
          <input id="y" onChange={this.handleObjectsY}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].y} />
          <label htmlFor="width">物件寬</label>
          <input id="width" onChange={this.handleObjectsW}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].w} />
          <label htmlFor="height">物件高</label>
          <input id="height" onChange={this.handleObjectsH}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].h} />
          <label htmlFor="events">事件ID</label>
          <input id="events" value={s.jsonParse.isMove[s.objectNum].e} />
          <label htmlFor="inMap">入場圖</label>
          <input id="inMap" value={s.jsonParse.isMove[s.objectNum].cm} />
          <label htmlFor="inMapPoint">入場點</label>
          <input id="inMapPoint" value={s.jsonParse.isMove[s.objectNum].cmm} />
        </Ui>  : null}  
    </div>
   ) 
  }
});
var Ui = React.createClass({
  render : function(){
    return(
      <div className="ui">
      {this.props.children}
      </div>
  )
  }
});
var map = React.render(<Root />,document.body)