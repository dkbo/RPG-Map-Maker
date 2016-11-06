import React, { Component, PropTypes } from 'react';
import Sprites from './sprites';
import Top from './top';
import Ui from './ui';
import Input from './input';
import Button from './button';
import { init } from '../constants';
let props = {
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
export default class Main extends Component {

  constructor() {
  	super();
  	this.state = {
      sprite:{
        top : 0
      },
      objectNum:0,
      mapObjects:null,
      mapTop: 0,
      mapLeft:0,
      width : props.map.width,
      height: props.map.height,
      sourceX : false,
      sourceY : false,
      sourceW : props.map.sX,
      sourceH : props.map.sY,
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
  }

	handleSpritesMouseDown(e){
    init.scontext.clearRect(0, 0, 256, 12000);
    if(e.button == 0){

     let height = window.innerHeight;
     let x = props.map.sX*Math.floor(e.clientX/props.map.sX);
     let y = props.map.sY*Math.floor((e.clientY - 100 + props.map.sY * -this.state.sprite.top)/props.map.sY);
     let w = this.state.sourceW;
     let h = this.state.sourceH;
     if(this.state.sourceX === false )
     this.setState(Object.assign({},this.state,{sourceX:x,sourceY:y}))
     else {
       if(x > this.state.sourceX){
         w = x-this.state.sourceX + props.map.sX;
         x = this.state.sourceX;
       }
       else{
         w = this.state.sourceX - x +props.map.sX
       }
       if(y > this.state.sourceY){
         h = y-this.state.sourceY + props.map.sY;
         y = this.state.sourceY;
       }
       else{
         h = this.state.sourceY - y +32
       }
       this.setState(Object.assign({},this.state,{
         sourceX : x,
         sourceY : y,
         sourceW : w,
         sourceH : h
       }));
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
      this.setState(Object.assign({},this.state,{
         sourceX : false,
         sourceY : false,
         sourceW : props.map.sX,
         sourceH : props.map.sY
      }));
    }

  }
  handleWheel(e){
    let x = e.deltaY/100*init.wheelSpeed;
    let y = this.state.sprite
    if(y.top +-x <=0){
    y.top += -x;
    this.setState(Object.assign({},this.state,{
      sprite : y
    }))
    }
  }
  handleChange(e){
    let x =  JSON.parse(e.target.value)
    if(typeof(x) === 'object'){
     e.target.value = null
    this.drawJson(x);
    }
  }
  handleObjectName(e){
    init.objectName = e.target.value;
  }
  handleSprite(e){
    let img;
    if(this.isReaptImg(e.target.value)){
    let i = init.pre.length;
    img = new Image();
    img.src=e.target.value;
    init.img.push(img.src)
    }
    this.setState(Object.assign({},this.state,{spritesSrc : e.target.value}))
  }
  isReaptImg(x){
    for(let i=0;i<init.img.length;i++){
      if(init.img[i] === x)
        return false
    }
    return true
  }
  mapWidth(e){
    this.setState(Object.assign({},this.state,{width :e.target.value}))
  }
  mapHeight(e){
    this.setState(Object.assign({},this.state,{height :e.target.value}))
  }
  contextMenu(e) {
    e.preventDefault();
}
  drawJson(x){
    init.npcArr = x.npc;
    init.mapArr = x.map;
    this.drawObjects(init.arr = x.styles);
    this.drawIsMove(init.isMoveArr = x.isMove);
    this.setState(Object.assign({},this.state,{json : JSON.stringify(x, null, '\t'),jsonParse : x,mapObjects: 1,objectNum: 0 }))
  }
  drawObjects(x){
    let image = new Image();
    init.fcontext.clearRect(0, 0, this.state.width, this.state.height);
    init.bcontext.clearRect(0, 0, this.state.width, this.state.height);
    for(let i=0;i<x.length;i++){
    if(this.drawJsonPreImg(x[i].b)){
    image.src = x[i].b;
    if(x[i].z == 2)
      init.fcontext.drawImage(image, x[i].x , x[i].y , x[i].w, x[i].h , x[i].l,  x[i].t ,  x[i].w,  x[i].h);
    else
      init.bcontext.drawImage(image, x[i].x , x[i].y , x[i].w, x[i].h , x[i].l,  x[i].t ,  x[i].w,  x[i].h);

    }
  }
  }
  drawIsMove(x){
    init.mcontext.clearRect(0, 0, this.state.width, this.state.height);
  for(let i=0;i<x.length;i++){
      init.mcontext.beginPath();
      init.mcontext.rect(x[i].x,x[i].y, x[i].w,x[i].h);
      init.mcontext.fillStyle = "rgba(27, 136, 224, 0.83)";
      init.mcontext.fill();
    }
  }
  drawJsonPreImg(x){
    let y = false;
    for(let j=0;j<init.img.length;j++){
        if(x === init.img[j]){
          y = true;
          break;
        }
    }
    if(!y){
      let img = new Image();
      img.onload = () => y
      img.src = x;
      init.img.push(x);
    }
    return y
  }
  drawDown(e){
    let x = (Math.floor((e.clientX - 256 -this.state.mapLeft*props.map.sX)/props.map.sX)*props.map.sX)
    let y = (Math.floor((e.clientY - 100 -this.state.mapTop*props.map.sY)/props.map.sY)*props.map.sY)
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
  }
drawMove(e){
  if(init.drawIsMove){
    init.mcontext.clearRect(init.mouseMoveX,init.mouseMoveY, init.mouseMoveW, init.mouseMoveH);
    init.mouseMoveX  = e.clientX > init.mouseDownX ? init.mouseDownX-255 - (this.state.mapLeft*props.map.sX): e.clientX-255 - (this.state.mapLeft*props.map.sX);
    init.mouseMoveY  = e.clientY > init.mouseDownY ? init.mouseDownY-100 - (this.state.mapTop*props.map.sY): e.clientY-100 - (this.state.mapTop*props.map.sY);
    init.mouseMoveW  = e.clientX - init.mouseDownX > 0 ? e.clientX - init.mouseDownX : init.mouseDownX -e.clientX;
    init.mouseMoveH  = e.clientY - init.mouseDownY > 0 ? e.clientY - init.mouseDownY : init.mouseDownY -e.clientY;
    init.mcontext.beginPath();
    init.mcontext.rect(init.mouseMoveX, init.mouseMoveY, init.mouseMoveW, init.mouseMoveH);
    init.mcontext.fillStyle = "rgba(27, 136, 224, 0.83)";
    init.mcontext.fill();

  }
}
drawUp(e){
  if(!this.state.sourceX && init.alt){
  init.drawIsMove = false;
  this.pushIsMove()
  }
}
pushIsMove(){
  let x = {};
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
  let json = {
      map : init.mapArr,
      styles : init.arr,
      isMove : init.isMoveArr,
      npc : init.npcArr
    }
  this.drawObjectsSelect(x.x,x.y,x.w,x.h);
  this.setState(Object.assign({},this.state,{json : JSON.stringify(json, null, '\t'),jsonParse:json,objectNum:init.isMoveArr.length-1,mapObjects:2}))
}
findObjects(e){
  let s = this.state;
    let l;
    let x = e.clientX -255 - (this.state.mapLeft*props.map.sX);
    let y = e.clientY -100 - (this.state.mapTop*props.map.sY);
    let z = 0;
    if(e.button === 0){
      let arr = this.state.jsonParse.styles;
      for(let i=0;i< arr.length;i++){
        if(arr[i].l <= x && x <= arr[i].l + arr[i].w && arr[i].t <= y && y <= arr[i].t + arr[i].h){
          this.setState(Object.assign({},this.state,{objectNum : i ,mapObjects : 1}));
          l = i;
        }
      }
      if(l>=0)
      this.drawObjectsSelect(arr[l].l , arr[l].t , arr[l].w , arr[l].h);
    }
    if(e.button === 2){
      let arr = this.state.jsonParse.isMove;
      for(let i=0;i< arr.length;i++){
        if(arr[i].x <= x && x <= arr[i].x + arr[i].w && arr[i].y <= y && y <= arr[i].y + arr[i].h){
          this.setState(Object.assign({},this.state,{objectNum : i , mapObjects : 2}));
          l = i;
        }
      }
      if(l>=0)
      this.drawObjectsSelect(arr[l].x , arr[l].y , arr[l].w , arr[l].h);
    }
}
drawObjectsSelect(x,y,w,h){
      init.oscontext.clearRect(0,0,this.state.width,this.state.height);
      init.oscontext.beginPath();
      init.oscontext.rect(x,y,w,h);
      init.oscontext.fillStyle = "rgba(255, 255, 255, 0.23)";
      init.oscontext.fill();
      init.oscontext.lineWidth = 1;
      init.oscontext.strokeStyle = 'black';
      init.oscontext.stroke();
}
  mapKeyDown(e){
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
          case 65: //a
              init.map.left = true
              break;
          case 68: //d
              init.map.right = true
              break;
          case 87: // w
              init.map.up = true
              break;
          case 83: //s
              init.map.down = true
              this.save();  // alt + s
              break;
          case 73: // i
              this.immediateSave();
              break;
          case 46: //Delete
              this.handleObjectsRemove();
              break;
          case 76: // l
              this.load(); //alt + l
              break;
          case 67: // c
              this.clear(); // alt + c
              break;
          case 18: //alt
              init.alt = true;
              break;

        }
  }
  mapKeyUp(e){
        switch(e.keyCode){
          case 65:
              init.map.left = false
              break;
          case 68:
              init.map.right = false
              break;
          case 87:
              init.map.up = false
              break;
          case 83:
              init.map.down = false
              break;
          case 18:
              init.alt = false
              break;

        }
  }
  opacityF(){
    this.setState(Object.assign({},this.state,{opacityF : this.state.opacityF ? 0 : 1}));
  }
  opacityB(){
    this.setState(Object.assign({},this.state,{opacityB : this.state.opacityB ? 0 : 1}));
  }
  opacityM(){
    this.setState(Object.assign({},this.state,{opacityM : this.state.opacityM ? 0 : 1}));
  }
 drawGridX(){
  if(!this.state.gridX){
    init.gcontext.beginPath();
      for(let i=1;i<(this.state.width/props.map.sX);i++){
      init.gcontext.moveTo(i*props.map.sX,props.map.sY);
      init.gcontext.lineTo(i*props.map.sX,this.state.height);
      init.gcontext.font = 'italic .5em Calibri';
      init.gcontext.textAlign = 'center';
      init.gcontext.fillText(i*props.map.sX, i*props.map.sX, 20);
    }
      init.gcontext.stroke();
}
  else{
      init.gcontext.clearRect(0, 0, this.state.width, this.state.height);
  }
  this.setState(Object.assign({},this.state,{gridX : !this.state.gridX}));
}
drawGridY(){
  if(!this.state.gridY){
    init.gcontext.beginPath();
      for(let j=1;j<(this.state.height/props.map.sY);j++){
      init.gcontext.moveTo(props.map.sX,j*props.map.sY);
      init.gcontext.lineTo(this.state.width,j*props.map.sY);
      init.gcontext.font = 'italic .5em Calibri';
      init.gcontext.textAlign = 'center';
      init.gcontext.fillText(j*props.map.sY, 20, j*props.map.sY+4);
    }
      init.gcontext.stroke();
  }
      else{
      init.gcontext.clearRect(0, 0, this.state.width, this.state.height);
  }
  this.setState(Object.assign({},this.state,{gridY : !this.state.gridY}));
}
  save(){
    if(init.alt){
    let map = {
      width : this.state.width,
      height : this.state.height
    }
    let json={
      map : init.mapArr,
      styles : init.arr,
      isMove : init.isMoveArr,
      npc : init.npcArr
    }
    localStorage.dkbo = JSON.stringify(json);
    localStorage.dkbomap = JSON.stringify(map);
    }
  }
  load(){
    if(init.alt){
    let map = JSON.parse(localStorage.dkbomap);
    this.setState(Object.assign({},this.state,{width : map.width,height : map.height}));
    this.drawJson(JSON.parse(localStorage.dkbo));
    }
  }
  clear(){
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
      let json ={
        map : {},
        styles : init.arr,
        isMove : init.isMoveArr,
        npc : {}
      }
  this.setState(Object.assign({},this.state,{json: JSON.stringify(json, null, '\t'), jsonParse:json, mapObjects:null}));
    }
  }
  immediateSave(){
      init.immediate = init.immediate ? false : true;
  }
  draw(x,y,z){
    let s = this.state;
    let image = new Image()
    image.src = this.state.spritesSrc;
    let json = {
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
      map : init.mapArr,
      styles : init.arr,
      isMove : init.isMoveArr,
      npc : init.npcArr
    }
    this.setState(Object.assign({},this.state,{json : JSON.stringify(json, null, '\t'),jsonParse:json,objectNum: init.arr.length-1,mapObjects: 1}))
  }
  mapMove(){
    if(!init.alt){
    if(init.map.left && this.state.mapLeft - props.left <= 0)
      this.setState(Object.assign({},this.state,{mapLeft: this.state.mapLeft-props.left}));
    if(init.map.right){
      this.setState(Object.assign({},this.state,{mapLeft: this.state.mapLeft-props.right}));
    }
    if(init.map.up && this.state.mapTop- props.up <= 0 ){
    this.setState(Object.assign({},this.state,{mapTop: this.state.mapTop-props.up}));
  }
    if(init.map.down){
    this.setState(Object.assign({},this.state,{mapTop: this.state.mapTop-props.down}));
  }
    }
  }
  componentDidMount() {
    const fCanvas = document.getElementById('objectFront');
    const bCanvas = document.getElementById('objectBack');
    const mCanvas = document.getElementById('objectIsMove');
    const sCanvas = document.getElementById('spriteCanvas');
    const osCanvas =document.getElementById('objectSelect');
    const gCanvas = document.getElementById('grid');
    init.fcontext = fCanvas.getContext('2d');
    init.bcontext = bCanvas.getContext('2d');
    init.mcontext = mCanvas.getContext('2d');
    init.scontext = sCanvas.getContext('2d');
    init.oscontext = osCanvas.getContext('2d');
    init.gcontext = gCanvas.getContext('2d');
    window.addEventListener('keydown',::this.mapKeyDown,false);
    window.addEventListener('keyup',::this.mapKeyUp,false);
    this.timer = setInterval(this.mapMove.bind(this), init.mapSetinterval);
}
  handleObjectsRemove(){
    if(this.state.mapObjects){
    init.oscontext.clearRect(0,0,this.state.width,this.state.height);
    let json = this.state.jsonParse;
    let x = this.state.mapObjects
    switch(x){
      case 2:
        json.isMove.splice(this.state.objectNum,1);
        break;
      case 1:
        json.styles.splice(this.state.objectNum,1);
        break;
    }
      this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json,mapObjects : null}))
      this.handleObjectsDraw(x);
  }
}
  handleObjectsDraw(x){
    if(this.state.mapObjects == 2 || x == 2)
      this.drawIsMove(this.state.jsonParse.isMove);
    if(this.state.mapObjects == 1 || x == 1)
      this.drawObjects(this.state.jsonParse.styles);
  }
  handleObjectsArea(e){
      this.setState(Object.assign({},this.state,{objectNum : 0,mapObjects: this.state.mapObjects===2 ? 1 : 2}));
  }
  handleObjectsId(e){
    let x = Number(e.target.value);
    let arr = [];
    if(this.state.mapObjects == 1)
      arr = this.state.jsonParse.styles;
    if(this.state.mapObjects == 2)
      arr = this.state.jsonParse.isMove;
    if(!isNaN(Math.floor(x)) && x < arr.length && x >= 0){
      this.setState(Object.assign({},this.state,{objectNum : Math.floor(x)}),()=>{
        let x = arr[this.state.objectNum];
        if(this.state.mapObjects == 1)
          this.drawObjectsSelect(x.l,x.t,x.w,x.h);
        if(this.state.mapObjects == 2)
          this.drawObjectsSelect(x.x,x.y,x.w,x.h);
      });
    }
  }
  handleObjectsName(e){
    let json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].n = e.target.value;
    else
      json.isMove[this.state.objectNum].n = e.target.value;
    this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
  }
  handleObjectsX(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].l = x;
    else
      json.isMove[this.state.objectNum].x = x;
    this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    if(init.immediate)
      this.handleObjectsDraw();
  }
  }
  handleObjectsY(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].t = x;
    else
      json.isMove[this.state.objectNum].y = x;
    this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    if(init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsW(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].w = x;
    else
      json.isMove[this.state.objectNum].w = x;
    this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    if(init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsH(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    if(this.state.mapObjects != 2)
      json.styles[this.state.objectNum].h = x;
    else
      json.isMove[this.state.objectNum].h = x;
    this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    if(init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsSX(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    json.styles[this.state.objectNum].x = x;
    this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    if(init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsSY(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    json.styles[this.state.objectNum].y = x;
    this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    if(init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsE(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
      let json = this.state.jsonParse;
      if(e.target.value >= 0)
        json.isMove[this.state.objectNum].e = x;
      else
        delete json.isMove[this.state.objectNum].e
      this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    }
  }
  handleObjectsCM(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
      let json = this.state.jsonParse;
      if(e.target.value >= 0)
        json.isMove[this.state.objectNum].cm = x;
      else
        delete json.isMove[this.state.objectNum].cm
      this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    }
  }
  handleObjectsCMM(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
      let json = this.state.jsonParse;
      if(e.target.value >= 0)
        json.isMove[this.state.objectNum].cmm = x;
      else
        delete json.isMove[this.state.objectNum].cmm
      this.setState(Object.assign({},this.state,{json : JSON.stringify(json,null,'\t') , jsonParse: json}))
    }
  }
	render() {
		const s =this.state;
	    return (
	      <main>
	      	<div id="map"   style={{
                            WebkitTransform : 'translate3D('+s.mapLeft*props.map.sX+'px,'+s.mapTop*props.map.sY+'px,0)',
                            msTransform : 'translate3D('+s.mapLeft*props.map.sX+'px,'+s.mapTop*props.map.sY+'px,0)',
                            transform : 'translate3D('+s.mapLeft*props.map.sX+'px,'+s.mapTop*props.map.sY+'px,0)',
                            width:s.width,
                            height:s.height
                          }}
                          onMouseDown={::this.drawDown}
                          onMouseMove={::this.drawMove}
                          onMouseUp={::this.drawUp}
                          onContextMenu={::this.contextMenu}>

        <canvas width={s.width} height={s.height} style={{opacity : s.opacityB}} id="objectBack" />
        <canvas width={s.width} height={s.height} style={{opacity : s.opacityF}} id="objectFront" />
        <canvas width={s.width} height={s.height} style={{opacity : s.opacityM}} id="objectIsMove" />
        <canvas width={s.width} height={s.height} id="objectSelect" />
        <canvas width={s.width} height={s.height} id="grid" />
      </div>
      <Sprites  style={{
                  WebkitTransform : 'translateY('+s.sprite.top*props.map.sY+'px)',
                  msTransform : 'translateY('+s.sprite.top*props.map.sY+'px)',
                  transform : 'translateY('+s.sprite.top*props.map.sY+'px)'}}
                onWheel={::this.handleWheel}
                onMouseDown={::this.handleSpritesMouseDown}
                onContextMenu={this.contextMenu} >
        <canvas  width="256" height="12000" id="spriteCanvas" />
        <img src={s.spritesSrc} />
     </Sprites>
      <Top {...s} jsontext={::this.handleChange} spritesSrcF={::this.handleSprite} objectname={::this.handleObjectName} mapWidth={::this.mapWidth} mapHeight={::this.mapHeight} />
      {s.mapObjects != 2 && s.mapObjects !=null ?
        <Ui>
          <Button id="del" value="刪除" onClick={::this.handleObjectsRemove} />
          <Button id="draw" value="重畫" onClick={::this.handleObjectsDraw}  />
          <Input id="area" title="區域層" value="物件區域" readOnly />
          <Input id="id" type="number" title="物件ID" value={s.objectNum} onChange={::this.handleObjectsId} />
          <Input id="name" title="物件名" value={s.jsonParse.styles[s.objectNum].n} onChange={::this.handleObjectsName} />
          <Input id="x" type="number" title="X 座標" value={s.jsonParse.styles[s.objectNum].l} onChange={::this.handleObjectsX} />
          <Input id="y" type="number" title="Y 座標" value={s.jsonParse.styles[s.objectNum].t} onChange={::this.handleObjectsY} />
          <Input id="width" type="number" title="物件寬" value={s.jsonParse.styles[s.objectNum].w} onChange={::this.handleObjectsW} />
          <Input id="height" type="number" title="物件高" value={s.jsonParse.styles[s.objectNum].h} onChange={::this.handleObjectsH} />
          <Input id="background" title="物件主圖" placeholder={s.jsonParse.styles[s.objectNum].b} readonly />
          <Input id="spriteX" type="number" title="物件拼圖 X 座標" value={s.jsonParse.styles[s.objectNum].x} onChange={::this.handleObjectsSX} />
          <Input id="spriteY" type="number" title="物件拼圖 Y 座標" value={s.jsonParse.styles[s.objectNum].y} onChange={::this.handleObjectsSY} />
          <Input id="zindex" title="物件前後層" placeholder={s.jsonParse.styles[s.objectNum].z} readOnly/>
        </Ui>  : null}
      {s.mapObjects === 2 ?
        <Ui>
          <Button id="del" value="刪除" onClick={::this.handleObjectsRemove} />
          <Button id="draw" value="重畫" onClick={::this.handleObjectsDraw}  />
          <Input id="area" title="區域層" value="碰撞區域" readOnly />
          <Input id="id" type="number" title="物件ID" value={s.objectNum} onChange={::this.handleObjectsId} />
          <Input id="name" title="物件名" value={s.jsonParse.styles[s.objectNum].n} onChange={::this.handleObjectsName} />
          <Input id="x" type="number" title="X 座標" value={s.jsonParse.styles[s.objectNum].l} onChange={::this.handleObjectsX} />
          <Input id="y" type="number" title="Y 座標" value={s.jsonParse.styles[s.objectNum].t} onChange={::this.handleObjectsY} />
          <Input id="width" type="number" title="物件寬" value={s.jsonParse.styles[s.objectNum].w} onChange={::this.handleObjectsW} />
          <Input id="height" type="number" title="物件高" value={s.jsonParse.styles[s.objectNum].h} onChange={::this.handleObjectsH} />
          <Input id="events" type="number" title="事件ID" value={s.jsonParse.isMove[s.objectNum].e} onChange={::this.handleObjectsE} />
          <Input id="inMap" type="number" title="入場圖" value={s.jsonParse.isMove[s.objectNum].cm} onChange={::this.handleObjectsCM} />
          <Input id="inMapPoint" type="number" title="入場點" value={s.jsonParse.isMove[s.objectNum].cmm} onChange={::this.handleObjectsCMM} />
        </Ui>  : null}
	      </main>
	      )
	}
}
