
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
    if(this.isReaptImg(e.target.value)){
    image.src=e.target.value; 
    init.img.push(e.target.value)
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
    image.src = xs[i].b;
    if(xs[i].zIndex == 2)
      init.fcontext.drawImage(image, xs[i].x , xs[i].y , xs[i].w, xs[i].h , xs[i].l,  xs[i].t ,  xs[i].w,  xs[i].h);
    
    else
      init.bcontext.drawImage(image, xs[i].x , xs[i].y , xs[i].w, xs[i].h , xs[i].l,  xs[i].t ,  xs[i].w,  xs[i].h);
 
    }
    for(var i=0;i<x.isMove.length;i++){
      init.mcontext.beginPath();
      init.mcontext.rect(x.isMove[i].x,x.isMove[i].y, x.isMove[i].w,x.isMove[i].h);
      init.mcontext.fillStyle = "rgba(27, 136, 224, 0.53)";
      init.mcontext.fill();
    }
    init.arr = xs;
    init.isMoveArr = x.isMove;
    this.setState({json : JSON.stringify(x, null, '\t')})
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
    init.mouseMoveX  = e.clientX > init.mouseDownX ? init.mouseDownX-255 : e.clientX-255;
    init.mouseMoveY  = e.clientY > init.mouseDownY ? init.mouseDownY-100 : e.clientY-100;
    init.mouseMoveW  = e.clientX - init.mouseDownX > 0 ? e.clientX - init.mouseDownX : init.mouseDownX -e.clientX;
    init.mouseMoveH  = e.clientY - init.mouseDownY > 0 ? e.clientY - init.mouseDownY : init.mouseDownY -e.clientY; 
    
    init.mcontext.beginPath();
    init.mcontext.rect(init.mouseMoveX, init.mouseMoveY, init.mouseMoveW, init.mouseMoveH);
    init.mcontext.fillStyle = "rgba(27, 136, 224, 0.53)";
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
  x.mx = init.mouseMoveX;
  x.my = init.mouseMoveY;
  x.mw = init.mouseMoveW;
  x.mh = init.mouseMoveH;  
  init.mouseMoveX = 0;
  init.mouseMoveY = 0;
  init.mouseMoveW = 0;
  init.mouseMoveH = 0;
  init.isMoveArr.push(x)
  var json = {
      styles : init.arr,
      isMove : init.isMoveArr
    }
  this.setState({json : JSON.stringify(json, null, '\t')})
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
          // 人物上移
          case 38:
              init.map.up = false
              break;
          case 87:
              init.map.up = false
              break;
          // 人物下移
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
  this.setState({json: JSON.stringify(json, null, '\t')});
    }
  },
  draw : function(x,y,z){
    var s = this.state;
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
      json.zIndex = 2
      init.fcontext.drawImage(image, s.sourceX , s.sourceY , s.sourceW, s.sourceH ,x, y , s.sourceW, s.sourceH);
    }
    else
      init.bcontext.drawImage(image, s.sourceX , s.sourceY , s.sourceW, s.sourceH ,x, y , s.sourceW, s.sourceH);
    init.arr.push(json)
    json = {
      styles : init.arr,
      isMove : init.isMoveArr
    }
    this.setState({json : JSON.stringify(json, null, '\t')})
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
  render : function(){
   return (
    <body >
     <div id="map"  style={{
     WebkitTransform : 'translate3D('+this.state.mapLeft*this.props.map.sX+'px,'+this.state.mapTop*this.props.map.sY+'px,0)',
     msTransform : 'translate3D('+this.state.mapLeft*this.props.map.sX+'px,'+this.state.mapTop*this.props.map.sY+'px,0)',
     transform : 'translate3D('+this.state.mapLeft*this.props.map.sX+'px,'+this.state.mapTop*this.props.map.sY+'px,0)',
     width:this.state.width,
     height:this.state.height
}} onMouseDown={this.drawDown} onMouseMove={this.drawMove} onMouseUp={this.drawUp} onContextMenu={this.contextMenu}>
          <canvas width={this.state.width} height={this.state.height} style={{opacity : this.state.opacityB}} id="objectBack" />
          <canvas width={this.state.width} height={this.state.height} style={{opacity : this.state.opacityF}} id="objectFront" />
          <canvas width={this.state.width} height={this.state.height} style={{opacity : this.state.opacityM}} id="objectIsMove" />
     <canvas width={this.state.width} height={this.state.height} id="grid" />
     </div>
     <Sprites style={{
     WebkitTransform : 'translateY('+this.state.sprite.top*this.props.map.sY+'px)',
     msTransform : 'translateY('+this.state.sprite.top*this.props.map.sY+'px)',
     transform : 'translateY('+this.state.sprite.top*this.props.map.sY+'px)'}}onWheel={this.handleWheel} onMouseDown={this.handleMouseDown} onContextMenu={this.contextMenu} >
        <canvas  width="256" height="12000" id="spriteCanvas" />
        <img src={this.state.spritesSrc}/>
     </Sprites>
      <Top>
        <textarea  id="jsoncode" value={this.state.json}/>
        <textarea  id="jsontext" onChange={this.handleChange} placeholder="Object Json"/>
        <input id ="spritesSrc" value={this.state.spritesSrc} onChange={this.handleSprite}  />
        <input id ="objectname" onChange={this.handleObjectName}  placeholder="Object Name"/>
        <input id ="mapWidth" onChange={this.mapWidth} value={this.state.width} />
        <input id ="mapHeight" onChange={this.mapHeight} value={this.state.height} />
     </Top>
    </body> 
   ) 
  }
});
var map = React.render(<Root />,document.body)