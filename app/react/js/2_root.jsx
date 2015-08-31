
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
        map : {},
        styles:[],
        isMove:[]
      },
      spritesSrc : "http://dkbo.github.io/images/rpg_maker_xp.png"
    }
  },
  handleSpritesMouseDown : function(e){
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
       if(y > this.state.sourceY){
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
     init.scontext.lineWidth = 1;
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
      if(init.img[i] === x)
        return false
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
    init.npcArr = x.npc;
    init.mapArr = x.map;
    this.drawObjects(init.arr = x.styles);
    this.drawIsMove(init.isMoveArr = x.isMove);
    this.setState({json : JSON.stringify(x, null, '\t'),jsonParse : x,mapObjects: 1,objectNum: 0 })
  },
  drawObjects : function(x){
    var image = new Image();
    init.fcontext.clearRect(0, 0, this.state.width, this.state.height);
    init.bcontext.clearRect(0, 0, this.state.width, this.state.height);
    for(var i=0;i<x.length;i++){
    if(this.drawJsonPreImg(x[i].b)){
    image.src = x[i].b;
    if(x[i].z == 2)
      init.fcontext.drawImage(image, x[i].x , x[i].y , x[i].w, x[i].h , x[i].l,  x[i].t ,  x[i].w,  x[i].h);
    else
      init.bcontext.drawImage(image, x[i].x , x[i].y , x[i].w, x[i].h , x[i].l,  x[i].t ,  x[i].w,  x[i].h);
 
    }
  }
  },
  drawIsMove  :function(x){
    init.mcontext.clearRect(0, 0, this.state.width, this.state.height);
  for(var i=0;i<x.length;i++){
      init.mcontext.beginPath();
      init.mcontext.rect(x[i].x,x[i].y, x[i].w,x[i].h);
      init.mcontext.fillStyle = "rgba(27, 136, 224, 0.83)";
      init.mcontext.fill();
    }
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
      var img = new Image();
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
    else
        this.findObjects(e);

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
  this.drawObjectsSelect(x.x,x.y,x.w,x.h);
  this.setState({json : JSON.stringify(json, null, '\t'),jsonParse:json,objectNum:init.isMoveArr.length-1,mapObjects:2})
},
findObjects : function(e){
  var s = this.state;
    var l;
    var x = e.clientX -255 - (this.state.mapLeft*this.props.map.sX);
    var y = e.clientY -100 - (this.state.mapTop*this.props.map.sY);
    var z = 0;
    if(e.button === 0){
      var arr = this.state.jsonParse.styles;
      for(var i=0;i< arr.length;i++){
        if(arr[i].l <= x && x <= arr[i].l + arr[i].w && arr[i].t <= y && y <= arr[i].t + arr[i].h){
          this.setState({objectNum : i ,mapObjects : 1});
          l = i;
        }
      }
      if(l>=0)
      this.drawObjectsSelect(arr[l].l , arr[l].t , arr[l].w , arr[l].h);
    }
    if(e.button === 2){
      var arr = this.state.jsonParse.isMove;
      for(var i=0;i< arr.length;i++){
        if(arr[i].x <= x && x <= arr[i].x + arr[i].w && arr[i].y <= y && y <= arr[i].y + arr[i].h){
          this.setState({objectNum : i , mapObjects : 2});
          l = i;
        }
      }
      if(l>=0)
      this.drawObjectsSelect(arr[l].x , arr[l].y , arr[l].w , arr[l].h);
    }
},
drawObjectsSelect : function(x,y,w,h){
      init.oscontext.clearRect(0,0,this.state.width,this.state.height);
      init.oscontext.beginPath();
      init.oscontext.rect(x,y,w,h);
      init.oscontext.fillStyle = "rgba(255, 255, 255, 0.23)";
      init.oscontext.fill();
      init.oscontext.lineWidth = 1;
      init.oscontext.strokeStyle = 'black';
      init.oscontext.stroke();
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
          case 73:
              this.immediateSave();
              break;
          case 46:
              this.handleObjectsRemove();
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
      map : init.mapArr,
      styles : init.arr,
      isMove : init.isMoveArr,
      npc : init.npcArr
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
      init.oscontext.clearRect(0,0,this.state.width,this.state.height);
      init.npcArr.length = 0;
      if(this.state.opacityF && this.state.opacityB){
        init.fcontext.clearRect(0, 0, this.state.width, this.state.height);
        init.bcontext.clearRect(0, 0, this.state.width, this.state.height);
        init.arr.length = 0;
      }
      if(this.state.opacityM){
        init.mcontext.clearRect(0, 0, this.state.width, this.state.height);
        init.isMoveArr.length =0;
      }
      var json ={
        map : {},
        styles : init.arr,
        isMove : init.isMoveArr,
        npc : init.npcArr
      }
  this.setState({json: JSON.stringify(json, null, '\t'), jsonParse:json, mapObjects:null});
    }
  },
  immediateSave : function(){
      init.immediate = init.immediate ? false : true;
  },
  draw : function(x,y,z){
    var s = this.state;
    var image = new Image()
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
      init.fcontext.drawImage(image, s.sourceX , s.sourceY , s.sourceW, s.sourceH ,x, y , s.sourceW, s.sourceH);
    }
    else
      init.bcontext.drawImage(image, s.sourceX , s.sourceY , s.sourceW, s.sourceH ,x, y , s.sourceW, s.sourceH);
    this.drawObjectsSelect(x,y,s.sourceW,s.sourceH);
    init.arr.push(json)
    json = {
      styles : init.arr,
      isMove : init.isMoveArr
    }
    this.setState({json : JSON.stringify(json, null, '\t'),jsonParse:json,objectNum: init.arr.length-1,mapObjects: 1})
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
    var osCanvas =document.getElementById('objectSelect');
    var gCanvas = document.getElementById('grid');
    init.fcontext = fCanvas.getContext('2d');
    init.bcontext = bCanvas.getContext('2d');
    init.mcontext = mCanvas.getContext('2d');
    init.scontext = sCanvas.getContext('2d');
    init.oscontext = osCanvas.getContext('2d');
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
  handleObjectsRemove : function(){
    if(this.state.mapObjects){
    init.oscontext.clearRect(0,0,this.state.width,this.state.height);
    var json = this.state.jsonParse;
    var x = this.state.mapObjects
    switch(x){
      case 2:
        var remove = json.isMove.splice(this.state.objectNum,1);
        break;
      case 1:
        var remove = json.styles.splice(this.state.objectNum,1);
        break;
    }
      this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json,mapObjects : null})
      this.handleObjectsDraw(x);
  }
},
  handleObjectsDraw : function(x){
    if(this.state.mapObjects == 2 || x == 2)
      this.drawIsMove(this.state.jsonParse.isMove);
    if(this.state.mapObjects == 1 || x == 1)
      this.drawObjects(this.state.jsonParse.styles);
  },
  handleObjectsArea : function(e){ 
      this.setState({objectNum : 0,mapObjects: this.state.mapObjects==2 ? 1 : 2});
  },
  handleObjectsId : function(e){ 
    var x = Number(e.target.value);
    var arr = [];
    if(this.state.mapObjects == 1)
      arr = this.state.jsonParse.styles;
    if(this.state.mapObjects == 2)
      arr = this.state.jsonParse.isMove;
    if(!isNaN(Math.floor(x)) && x < arr.length && x >= 0){
      this.setState({objectNum : Math.floor(x)},function(){
        var x =arr[this.state.objectNum];
        if(this.state.mapObjects == 1)
          this.drawObjectsSelect(x.l,x.t,x.w,x.h);
        if(this.state.mapObjects == 2)
          this.drawObjectsSelect(x.x,x.y,x.w,x.h);
      }.bind(this));
    }
  },
  handleObjectsName : function(e){
    var json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].n = e.target.value;
    else
      json.isMove[this.state.objectNum].n = e.target.value;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
  },
  handleObjectsX : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
    var json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].l = x;
    else
      json.isMove[this.state.objectNum].x = x;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    if(init.immediate)
      this.handleObjectsDraw();
  }
  },
  handleObjectsY : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
    var json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].t = x;
    else
      json.isMove[this.state.objectNum].y = x;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    if(init.immediate)
      this.handleObjectsDraw();
    }
  },
  handleObjectsW : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
    var json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].w = x;
    else
      json.isMove[this.state.objectNum].w = x;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    if(init.immediate)
      this.handleObjectsDraw();
    }
  },
  handleObjectsH : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
    var json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].h = x;
    else
      json.isMove[this.state.objectNum].h = x;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    if(init.immediate)
      this.handleObjectsDraw();
    }
  },
  handleObjectsSX : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
    var json = this.state.jsonParse;
    json.styles[this.state.objectNum].x = x;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    if(init.immediate)
      this.handleObjectsDraw();
    }
  },
  handleObjectsSY : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
    var json = this.state.jsonParse;
    json.styles[this.state.objectNum].y = x;
    this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    if(init.immediate)
      this.handleObjectsDraw();
    }
  },
  handleObjectsE : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
      var json = this.state.jsonParse;
      if(e.target.value >= 0)
        json.isMove[this.state.objectNum].e = x;
      else
        delete json.isMove[this.state.objectNum].e
      this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    }
  },
  handleObjectsCM : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
      var json = this.state.jsonParse;
      if(e.target.value >= 0)
        json.isMove[this.state.objectNum].cm = x;
      else
        delete json.isMove[this.state.objectNum].cm
      this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    }
  },
  handleObjectsCMM : function(e){
    var x = Number(e.target.value);
    if(!isNaN(x)){
      var json = this.state.jsonParse;
      if(e.target.value >= 0)
        json.isMove[this.state.objectNum].cmm = x;
      else
        delete json.isMove[this.state.objectNum].cmm
      this.setState({json : JSON.stringify(json,null,'\t') , jsonParse: json})
    }
  },
  render : function(){
    var s =this.state;
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
        <canvas width={s.width} height={s.height} id="objectSelect" />
        <canvas width={s.width} height={s.height} id="grid" />
      </div>
     <Sprites style={{
     WebkitTransform : 'translateY('+s.sprite.top*this.props.map.sY+'px)',
     msTransform : 'translateY('+s.sprite.top*this.props.map.sY+'px)',
     transform : 'translateY('+s.sprite.top*this.props.map.sY+'px)'}} onWheel={this.handleWheel} onMouseDown={this.handleSpritesMouseDown} onContextMenu={this.contextMenu} >
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
      {s.mapObjects != 2 && s.mapObjects !=null ? 
        <Ui>
          <input id="del" type="button" value="刪除" onClick={this.handleObjectsRemove}/>
          <input id="draw" type="button" value="重畫" onClick={this.handleObjectsDraw} />
          <label htmlFor="area">區域層</label>
          <select id="area" onChange={this.handleObjectsArea}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue}>
            <option value="1" selected>物件區域</option>
            <option value="2">碰撞區域</option>
          </select>
          <label htmlFor="id">物件ID</label>
          <input id="id" type="number" onChange={this.handleObjectsId}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue}  value={s.objectNum} />
          <label htmlFor="name">物件名</label>
          <input id="name" onChange={this.handleObjectsName}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].n} />
          <label htmlFor="x">X 座標</label>
          <input id="x" type="number" onChange={this.handleObjectsX}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue}value={s.jsonParse.styles[s.objectNum].l} />
          <label htmlFor="y">Y 座標</label>
          <input id="y" type="number" onChange={this.handleObjectsY}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].t} />
          <label htmlFor="width">物件寬</label>
          <input id="width" type="number" onChange={this.handleObjectsW}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].w} />
          <label htmlFor="height">物件高</label>
          <input id="height" type="number" onChange={this.handleObjectsH}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].h} />
          <label htmlFor="background">物件主圖</label>
          <input id="background" value={s.jsonParse.styles[s.objectNum].b} />
          <label htmlFor="spriteX">物件拼圖 X 座標</label>
          <input id="spriteX" type="number"  onChange={this.handleObjectsSX}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].x} />
          <label htmlFor="spriteY">物件拼圖 Y 座標</label>
          <input id="spriteY" type="number"  onChange={this.handleObjectsSY}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.styles[s.objectNum].y} />
          <label htmlFor="zindex">物件前後層</label>
          <input id="zindex" value={s.jsonParse.styles[s.objectNum].z} />
        </Ui>  : null}
      {s.mapObjects == 2 ? 
        <Ui>
          <input id="del" type="button" value="刪除" onClick={this.handleObjectsRemove}/>
          <input id="draw" type="button" value="重畫" onClick={this.handleObjectsDraw} />
          <label htmlFor="area">區域物件</label>
          <select id="area" onChange={this.handleObjectsArea}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue}>
            <option value="1">物件區域</option>
            <option value="2" selected>碰撞區域</option>
          </select>
          <label htmlFor="id">物件ID</label>
          <input id="id" type="number" onChange={this.handleObjecstId} onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} type="number"  value={s.objectNum} />
          <label htmlFor="name">物件名</label>
          <input id="name" onChange={this.handleObjectsName} onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].n} />
          <label htmlFor="x">X 座標</label>
          <input id="x" type="number" onChange={this.handleObjectsX}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].x} />
          <label htmlFor="y">Y 座標</label>
          <input id="y" type="number" onChange={this.handleObjectsY}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].y} />
          <label htmlFor="width">物件寬</label>
          <input id="width" type="number" onChange={this.handleObjectsW}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].w} />
          <label htmlFor="height">物件高</label>
          <input id="height" type="number" onChange={this.handleObjectsH}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].h} />
          <label htmlFor="events">事件ID</label>
          <input id="events" type="number" onChange={this.handleObjectsE}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].h} value={s.jsonParse.isMove[s.objectNum].e} />
          <label htmlFor="inMap">入場圖</label>
          <input id="inMap" type="number" onChange={this.handleObjectsCM}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].h} value={s.jsonParse.isMove[s.objectNum].cm} />
          <label htmlFor="inMapPoint">入場點</label>
          <input id="inMapPoint" type="number" onChange={this.handleObjectsCMM}  onKeyDown={this.handelMapFalse} onKeyUp={this.handelMapTrue} value={s.jsonParse.isMove[s.objectNum].h}  value={s.jsonParse.isMove[s.objectNum].cmm} />
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