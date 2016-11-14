import React, { Component, PropTypes } from 'react';
import Sprites from './sprites';
import Top from './top';
import Ui from './ui';
import Input from './input';
import Button from './button';
import bg from '../images/bg.jpg';
import img1 from '../images/man.png';
import img2 from '../images/rpg_maker_xp.png';
import img3 from '../images/rpg_maker_xp2.png';

export default class Main extends Component {
  constructor(props) {
  	super(props);
    this.init = {
    	"wheelSpeed": 4,
    	"moveSpeed": 1,
    	"mapSetinterval": 1000 / 60,
    	"map": {
    		"left": false,
    	    "up": false,
    	    "right": false,
    	    "down": false,
    	},
    	"alt": false,
    	"drawIsMove": false,
    	"mouseDownX": 0,
    	"mouseDownY": 0,
    	"mouseMoveX": 0,
    	"mouseMoveY": 0,
    	"mouseMoveW": 0,
    	"mouseMoveH": 0,
    	"isMoveArr": [],
    	"arr": [],
    	"mapArr": {},
    	"npcArr": [],
    	"img": [img1, img2, img3],
    	"pre": [],
    	"immediate": false,
    };
    this.map = {
      sX: 32,
      sY: 32,
      left: -this.init.moveSpeed,
      right: this.init.moveSpeed,
      up: -this.init.moveSpeed,
      down: this.init.moveSpeed,
    };
  	this.state = {
      sprite: {
        top: 0
      },
      objectNum: 0,
      mapObjects: null,
      mapTop: 0,
      mapLeft: 0,
      width: 1920,
      height: 1280,
      sourceX: false,
      sourceY: false,
      sourceW: this.map.sX,
      sourceH: this.map.sY,
      gridX: false,
      gridY: false,
      opacityF: 1,
      opacityB: 1,
      opacityM: 1,
      json: null,
      jsonParse: {
        map: {},
        styles: [],
        isMove: []
      },
      sprites: 1,
    }
    this.preLoadImage();

    this.mapKeyDown = ::this.mapKeyDown;
    this.mapKeyUp = ::this.mapKeyUp;
    this.mapMove = ::this.mapMove;
    this.handleObjectsRemove = ::this.handleObjectsRemove;
    this.handleObjectsDraw = ::this.handleObjectsDraw;
    this.saveFCanvas = ::this.saveFCanvas;
    this.saveBCanvas = ::this.saveBCanvas;

  }
  preLoadImage() {
    let imgNum = this.init.img.length;
    this.init.img.map((src)=>{
      const img = new Image();
      img.onload = () => {
        if(imgNum === 1) {
          console.log('圖片加載完成')
        } else {
          console.log(`剩下 ${--imgNum} 張圖片加載`)
        }
      };
      img.src = src;
    });
  }
	handleSpritesMouseDown(e){
    this.init.scontext.clearRect(0, 0, 256, 12000);
    if(e.button === 0){

     let x = this.map.sX * Math.floor(e.clientX / this.map.sX);
     let y = this.map.sY * Math.floor((e.clientY - 100 + this.map.sY * -this.state.sprite.top) / this.map.sY);
     let w = this.state.sourceW;
     let h = this.state.sourceH;
     if(this.state.sourceX === false )
     this.setState({sourceX: x, sourceY: y});
     else {
       if(x > this.state.sourceX){
         w = x - this.state.sourceX + this.map.sX;
         x = this.state.sourceX;
       }
       else{
         w = this.state.sourceX - x + this.map.sX
       }
       if(y > this.state.sourceY){
         h = y - this.state.sourceY + this.map.sY;
         y = this.state.sourceY;
       }
       else{
         h = this.state.sourceY - y + this.map.sY;
       }
       this.setState({
         sourceX: x,
         sourceY: y,
         sourceW: w,
         sourceH: h
       });
     }
    this.init.scontext.beginPath();
     this.init.scontext.rect(x, y, w, h);
     this.init.scontext.fillStyle = 'rgba(27, 136, 224, 0.53)';
     this.init.scontext.fill();
     this.init.scontext.lineWidth = 1;
     this.init.scontext.strokeStyle = 'black';
     this.init.scontext.stroke();
    }
    else{
      this.setState({
         sourceX: false,
         sourceY: false,
         sourceW: this.map.sX,
         sourceH: this.map.sY
      });
    }

  }
  handleWheel(e){
    let x = e.deltaY / 100 * this.init.wheelSpeed;
    let y = this.state.sprite
    if(y.top + -x <= 0){
      y.top += -x;
      this.setState({sprite: y});
    }
  }
  handleChange(e){
    const x = JSON.parse(e.target.value) || e.target.value;
    const json = typeof(x) === 'object' ? x : null;
    if(json){
       e.target.value = null
       this.drawJson(json);
    }
  }
  handleObjectName(e){
    this.init.objectName = e.target.value;
  }
  handleSprite(e){
      const img = new Image();
      img.src = this.init.img[e.target.value];
    this.setState({sprites: e.target.value});
  }
  isReaptImg(x){
    for(let i = 0;i < this.init.img.length;i++){
      if(this.init.img[i] === x)
        return false
    }
    return true
  }
  mapWidth(e){
    const width = e.target.value ? parseInt(e.target.value) : 0;
    this.setState({width});
  }
  mapHeight(e){
    const height = e.target.value ? parseInt(e.target.value) : 0;
    this.setState({height});
  }
  contextMenu(e) {
    e.preventDefault();
}
  drawJson(x){
    this.init.npcArr = x.npc;
    x.map.width = x.map.width ? x.map.width : this.state.width;
    x.map.height = x.map.height ? x.map.height : this.state.height;
    this.init.mapArr = x.map;
    this.setState({
      json: JSON.stringify(x, null, '\t'),
      jsonParse: x,
      mapObjects: 1,
      objectNum: 0,
      width: x.map.width,
      height: x.map.height,
    }, ()=> {
      this.drawObjects(this.init.arr = x.styles);
      this.drawIsMove(this.init.isMoveArr = x.isMove);
    });
  }
  drawObjects(x){
    let image = new Image();
    this.init.fcontext.clearRect(0, 0, this.state.width, this.state.height);
    this.init.bcontext.clearRect(0, 0, this.state.width, this.state.height);
    for(let i = 0;i <= (this.state.width / this.map.sX);i++){
      for(let j = 0;j <= (this.state.height / this.map.sY);j++){
        this.init.bcontext.drawImage(this.bg, 0, 0, 32, 32, i * 32, j * 32, 32, 32);
      }
    }

    for(let i = 0;i < x.length;i++){

    image.src = this.init.img[x[i].b];
    if(x[i].z === 2)
      this.init.fcontext.drawImage(image, x[i].x, x[i].y, x[i].w, x[i].h, x[i].l,  x[i].t, x[i].w,  x[i].h);
    else
      this.init.bcontext.drawImage(image, x[i].x, x[i].y, x[i].w, x[i].h, x[i].l,  x[i].t, x[i].w,  x[i].h);

  }
  }
  drawIsMove(x){
    this.init.mcontext.clearRect(0, 0, this.state.width, this.state.height);
  for(let i = 0;i < x.length;i++){
      this.init.mcontext.beginPath();
      this.init.mcontext.rect(x[i].x, x[i].y, x[i].w, x[i].h);
      this.init.mcontext.fillStyle = 'rgba(27, 136, 224, 0.83)';
      this.init.mcontext.fill();
    }
  }

  drawDown(e){
    let x = (Math.floor((e.clientX - 256 - this.state.mapLeft * this.map.sX) / this.map.sX) * this.map.sX)
    let y = (Math.floor((e.clientY - 100 - this.state.mapTop * this.map.sY) / this.map.sY) * this.map.sY)
    if(this.state.sourceX !== false){
    switch(e.button){
      case 0 :
        this.draw(x, y, 0);
        break
      case 2 :
        this.draw(x, y, 2);
        break
    }  }
    else{
      if(this.init.alt){
      switch(e.button){
      case 0 :
        this.init.drawIsMove = true;
        this.init.mouseDownX = e.clientX;
        this.init.mouseDownY = e.clientY;
        break;
    }
    }
    else
        this.findObjects(e);

   }
  }
drawMove(e){
  if(this.init.drawIsMove){
    this.init.mcontext.clearRect(this.init.mouseMoveX, this.init.mouseMoveY, this.init.mouseMoveW, this.init.mouseMoveH);
    this.init.mouseMoveX  = e.clientX > this.init.mouseDownX ? this.init.mouseDownX - 255 - (this.state.mapLeft * this.map.sX) : e.clientX - 255 - (this.state.mapLeft * this.map.sX);
    this.init.mouseMoveY  = e.clientY > this.init.mouseDownY ? this.init.mouseDownY - 100 - (this.state.mapTop * this.map.sY) : e.clientY - 100 - (this.state.mapTop * this.map.sY);
    this.init.mouseMoveW  = e.clientX - this.init.mouseDownX > 0 ? e.clientX - this.init.mouseDownX : this.init.mouseDownX - e.clientX;
    this.init.mouseMoveH  = e.clientY - this.init.mouseDownY > 0 ? e.clientY - this.init.mouseDownY : this.init.mouseDownY - e.clientY;
    this.init.mcontext.beginPath();
    this.init.mcontext.rect(this.init.mouseMoveX, this.init.mouseMoveY, this.init.mouseMoveW, this.init.mouseMoveH);
    this.init.mcontext.fillStyle = 'rgba(27, 136, 224, 0.83)';
    this.init.mcontext.fill();

  }
}
drawUp(){
  if(!this.state.sourceX && this.init.alt){
  this.init.drawIsMove = false;
  this.pushIsMove()
  }
}
pushIsMove(){
  let x = {};
  x.n = this.init.objectName;
  x.x = this.init.mouseMoveX;
  x.y = this.init.mouseMoveY;
  x.w = this.init.mouseMoveW;
  x.h = this.init.mouseMoveH;
  this.init.mouseMoveX = 0;
  this.init.mouseMoveY = 0;
  this.init.mouseMoveW = 0;
  this.init.mouseMoveH = 0;
  this.init.isMoveArr.push(x)
  const json = {
      map: this.init.mapArr,
      styles: this.init.arr,
      isMove: this.init.isMoveArr,
      npc: this.init.npcArr
    }
  this.drawObjectsSelect(x.x, x.y, x.w, x.h);
  this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json, objectNum: this.init.isMoveArr.length - 1, mapObjects: 2});
}
findObjects(e){
    let x = e.clientX - 255 - (this.state.mapLeft * this.map.sX);
    let y = e.clientY - 100 - (this.state.mapTop * this.map.sY);
    let l = null;
    if(e.button === 0){
      let arr = this.state.jsonParse.styles;
      for(let i = 0;i < arr.length;i++){
        if(arr[i].l <= x && x <= arr[i].l + arr[i].w && arr[i].t <= y && y <= arr[i].t + arr[i].h){
          this.setState({objectNum: i, mapObjects: 1});
          l = i;
        }
      }
      if(l >= 0)
      this.drawObjectsSelect(arr[l].l, arr[l].t, arr[l].w, arr[l].h);
    }
    if(e.button === 2){
      let arr = this.state.jsonParse.isMove;
      for(let i = 0;i < arr.length;i++){
        if(arr[i].x <= x && x <= arr[i].x + arr[i].w && arr[i].y <= y && y <= arr[i].y + arr[i].h){
          this.setState({objectNum: i, mapObjects: 2});
          l = i;
        }
      }
      if(l >= 0)
      this.drawObjectsSelect(arr[l].x, arr[l].y, arr[l].w, arr[l].h);
    }
}
drawObjectsSelect(x, y, w, h){
      this.init.oscontext.clearRect(0, 0, this.state.width, this.state.height);
      this.init.oscontext.beginPath();
      this.init.oscontext.rect(x, y, w, h);
      this.init.oscontext.fillStyle = 'rgba(255, 255, 255, 0.23)';
      this.init.oscontext.fill();
      this.init.oscontext.lineWidth = 1;
      this.init.oscontext.strokeStyle = 'black';
      this.init.oscontext.stroke();
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
              this.init.map.left = true
              break;
          case 68: //d
              this.init.map.right = true
              break;
          case 87: // w
              this.init.map.up = true
              break;
          case 83: //s
              this.init.map.down = true
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
              this.init.alt = true;
              break;

        }
  }
  mapKeyUp(e){
        switch(e.keyCode){
          case 65:
              this.init.map.left = false
              break;
          case 68:
              this.init.map.right = false
              break;
          case 87:
              this.init.map.up = false
              break;
          case 83:
              this.init.map.down = false
              break;
          case 18:
              this.init.alt = false
              break;

        }
  }
  opacityF(){
    this.setState({opacityF: this.state.opacityF ? 0 : 1});
  }
  opacityB(){
    this.setState({opacityB: this.state.opacityB ? 0 : 1});
  }
  opacityM(){
    this.setState({opacityM: this.state.opacityM ? 0 : 1});
  }
 drawGridX(){
  if(!this.state.gridX){
    this.init.gcontext.beginPath();
      for(let i = 1;i < (this.state.width / this.map.sX);i++){
      this.init.gcontext.moveTo(i * this.map.sX, this.map.sY);
      this.init.gcontext.lineTo(i * this.map.sX, this.state.height);
      this.init.gcontext.font = 'italic .5em Calibri';
      this.init.gcontext.textAlign = 'center';
      this.init.gcontext.fillText(i * this.map.sX, i * this.map.sX, 20);
    }
      this.init.gcontext.stroke();
}
  else{
      this.init.gcontext.clearRect(0, 0, this.state.width, this.state.height);
  }
  this.setState({gridX: !this.state.gridX});
}
drawGridY(){
  if(!this.state.gridY){
    this.init.gcontext.beginPath();
      for(let j = 1;j < (this.state.height / this.map.sY);j++){
      this.init.gcontext.moveTo(this.map.sX, j * this.map.sY);
      this.init.gcontext.lineTo(this.state.width, j * this.map.sY);
      this.init.gcontext.font = 'italic .5em Calibri';
      this.init.gcontext.textAlign = 'center';
      this.init.gcontext.fillText(j * this.map.sY, 20, j * this.map.sY + 4);
    }
      this.init.gcontext.stroke();
  }
      else{
      this.init.gcontext.clearRect(0, 0, this.state.width, this.state.height);
  }
  this.setState({gridY: !this.state.gridY});
}
  save(){
    if(this.init.alt){
    let map = {
      width: this.state.width,
      height: this.state.height
    }
    let json = {
      map: this.init.mapArr,
      styles: this.init.arr,
      isMove: this.init.isMoveArr,
      npc: this.init.npcArr
    }
    localStorage.dkbo = JSON.stringify(json);
    localStorage.dkbomap = JSON.stringify(map);
    }
  }
  load(){
    if(this.init.alt){
    const map = JSON.parse(localStorage.dkbomap);
    this.setState({width: map.width, height: map.height});
    this.drawJson(JSON.parse(localStorage.dkbo));
    }
  }
  clear(){
    if(this.init.alt){
      this.init.oscontext.clearRect(0, 0, this.state.width, this.state.height);
      this.init.npcArr = [];
      if(this.state.opacityF && this.state.opacityB){
        this.init.fcontext.clearRect(0, 0, this.state.width, this.state.height);
        this.init.bcontext.clearRect(0, 0, this.state.width, this.state.height);
        this.init.npcArr = [];
      }
      if(this.state.opacityM){
        this.init.mcontext.clearRect(0, 0, this.state.width, this.state.height);
        this.init.isMoveArr = [];
      }
      let json = {
        map: {},
        styles: this.init.arr,
        isMove: this.init.isMoveArr,
        npc: {}
      }
  this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json, mapObjects: null});
    }
  }
  immediateSave(){
      this.init.immediate = this.init.immediate ? false : true;
  }
  draw(x, y, z){
    let s = this.state;
    let image = new Image()
    image.src = this.init.img[this.state.sprites];
    let json = {
      n: this.init.objectName,
      l: x,
      t: y,
      w: s.sourceW,
      h: s.sourceH,
      b: this.state.sprites,
      x: s.sourceX,
      y: s.sourceY,
    };
    if(z === 2){
      json.z = 2
      this.init.fcontext.drawImage(image, s.sourceX, s.sourceY, s.sourceW, s.sourceH, x, y, s.sourceW, s.sourceH);
    }
    else
      this.init.bcontext.drawImage(image, s.sourceX, s.sourceY, s.sourceW, s.sourceH, x, y, s.sourceW, s.sourceH);
    this.drawObjectsSelect(x, y, s.sourceW, s.sourceH);
    this.init.arr.push(json)
    json = {
      map: this.init.mapArr,
      styles: this.init.arr,
      isMove: this.init.isMoveArr,
      npc: this.init.npcArr
    }
    this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json, objectNum: this.init.arr.length - 1, mapObjects: 1})
  }
  mapMove(){
    if(!this.init.alt){
    if(this.init.map.left && this.state.mapLeft - this.map.left <= 0)
      this.setState({mapLeft: this.state.mapLeft - this.map.left});
    if(this.init.map.right){
      this.setState({mapLeft: this.state.mapLeft - this.map.right});
    }
    if(this.init.map.up && this.state.mapTop - this.map.up <= 0 ){
    this.setState({mapTop: this.state.mapTop - this.map.up});
  }
    if(this.init.map.down){
    this.setState({mapTop: this.state.mapTop - this.map.down});
  }
    }
  }
  componentDidMount() {
    this.fCanvas = document.getElementById('objectFront');
    this.bCanvas = document.getElementById('objectBack');
    this.mCanvas = document.getElementById('objectIsMove');
    this.sCanvas = document.getElementById('spriteCanvas');
    this.osCanvas = document.getElementById('objectSelect');
    this.gCanvas = document.getElementById('grid');
    this.init.fcontext = this.fCanvas.getContext('2d');
    this.init.bcontext = this.bCanvas.getContext('2d');
    this.init.mcontext = this.mCanvas.getContext('2d');
    this.init.scontext = this.sCanvas.getContext('2d');
    this.init.oscontext = this.osCanvas.getContext('2d');
    this.init.gcontext = this.gCanvas.getContext('2d');
    window.addEventListener('keydown', this.mapKeyDown, false);
    window.addEventListener('keyup', this.mapKeyUp, false);
    this.bg = new Image();
    this.bg.src = bg;
    this.timer = setInterval(this.mapMove, this.init.mapSetinterval);
}
  handleObjectsRemove(){
    if(this.state.mapObjects){
    this.init.oscontext.clearRect(0, 0, this.state.width, this.state.height);
    let json = this.state.jsonParse;
    let x = this.state.mapObjects;
    switch(x){
      case 2:
        json.isMove.splice(this.state.objectNum, 1);
        break;
      case 1:
        json.styles.splice(this.state.objectNum, 1);
        break;
    }
      this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json, mapObjects: null});
      this.handleObjectsDraw(x);
  }
}
  handleObjectsDraw(x){
    if(this.state.mapObjects === 2 || x === 2)
      this.drawIsMove(this.state.jsonParse.isMove);
    if(this.state.mapObjects === 1 || x === 1)
      this.drawObjects(this.state.jsonParse.styles);
  }
  handleObjectsArea(){
      this.setState({objectNum: 0, mapObjects: this.state.mapObjects === 2 ? 1 : 2});
  }
  handleObjectsId(e){
    let x = Number(e.target.value);
    let arr = [];
    if(this.state.mapObjects === 1)
      arr = this.state.jsonParse.styles;
    if(this.state.mapObjects === 2)
      arr = this.state.jsonParse.isMove;
    if(!isNaN(Math.floor(x)) && x < arr.length && x >= 0){
      this.setState({objectNum: Math.floor(x)}), ()=>{
        let y = arr[this.state.objectNum];
        if(this.state.mapObjects === 1)
          this.drawObjectsSelect(y.l, y.t, y.w, y.h);
        if(this.state.mapObjects === 2)
          this.drawObjectsSelect(y.x, y.y, y.w, y.h);
      };
    }
  }
  handleObjectsName(e){
    let json = this.state.jsonParse;
    if(this.state.mapObjects !== 2)
      json.styles[this.state.objectNum].n = e.target.value;
    else
      json.isMove[this.state.objectNum].n = e.target.value;
    this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
  }
  handleObjectsX(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    if(this.state.mapObjects !== 2)
      json.styles[this.state.objectNum].l = x;
    else
      json.isMove[this.state.objectNum].x = x;
    this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
    if(this.init.immediate)
      this.handleObjectsDraw();
  }
  }
  handleObjectsY(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    if(this.state.mapObjects !== 2)
      json.styles[this.state.objectNum].t = x;
    else
      json.isMove[this.state.objectNum].y = x;
    this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
    if(this.init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsW(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    if(this.state.mapObjects !== 2)
      json.styles[this.state.objectNum].w = x;
    else
      json.isMove[this.state.objectNum].w = x;
    this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
    if(this.init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsH(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    if(this.state.mapObjects !== 2)
      json.styles[this.state.objectNum].h = x;
    else
      json.isMove[this.state.objectNum].h = x;
    this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
    if(this.init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsSX(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    json.styles[this.state.objectNum].x = x;
    this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
    if(this.init.immediate)
      this.handleObjectsDraw();
    }
  }
  handleObjectsSY(e){
    let x = Number(e.target.value);
    if(!isNaN(x)){
    let json = this.state.jsonParse;
    json.styles[this.state.objectNum].y = x;
    this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
    if(this.init.immediate)
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
      this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
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
      this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
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
      this.setState({json: JSON.stringify(json, null, '\t'), jsonParse: json});
    }
  }
  saveFCanvas() {
    const canvas = document.querySelector('#objectFront');
    const dataURL = canvas.toDataURL();
    window.open(dataURL);
  }
  saveBCanvas() {
    const canvas = document.querySelector('#objectBack');
    const dataURL = canvas.toDataURL();
    window.open(dataURL);
  }
	render() {
		const s = this.state;
	    return (
	      <main>
	      	<div id='map'   style={{
                            WebkitTransform: 'translate3D(' + s.mapLeft * this.map.sX + 'px,' + s.mapTop * this.map.sY + 'px,0)',
                            msTransform: 'translate3D(' + s.mapLeft * this.map.sX + 'px,' + s.mapTop * this.map.sY + 'px,0)',
                            transform: 'translate3D(' + s.mapLeft * this.map.sX + 'px,' + s.mapTop * this.map.sY + 'px,0)',
                            width: s.width,
                            height: s.height
                          }}
                          onMouseDown={::this.drawDown}
                          onMouseMove={::this.drawMove}
                          onMouseUp={::this.drawUp}
                          onContextMenu={::this.contextMenu}>

        <canvas width={s.width} height={s.height} style={{opacity: s.opacityB}} id='objectBack' />
        <canvas width={s.width} height={s.height} style={{opacity: s.opacityF}} id='objectFront' />
        <canvas width={s.width} height={s.height} style={{opacity: s.opacityM}} id='objectIsMove' />
        <canvas width={s.width} height={s.height} id='objectSelect' />
        <canvas width={s.width} height={s.height} id='grid' />
      </div>
      <Sprites  style={{
                  WebkitTransform: 'translateY(' + s.sprite.top * this.map.sY + 'px)',
                  msTransform: 'translateY(' + s.sprite.top * this.map.sY + 'px)',
                  transform: 'translateY(' + s.sprite.top * this.map.sY + 'px)'}}
                onWheel={::this.handleWheel}
                onMouseDown={::this.handleSpritesMouseDown}
                onContextMenu={this.contextMenu} >
        <canvas  width='256' height='12000' id='spriteCanvas' />
        <img src={this.init.img[s.sprites]} />
     </Sprites>
      <Top {...s} jsontext={::this.handleChange} spritesSrc={::this.handleSprite} objectname={::this.handleObjectName} mapWidth={::this.mapWidth} mapHeight={::this.mapHeight} />
      {s.mapObjects !== 2 && s.mapObjects !== null ?
        <Ui>
          <Button value='前圖' onClick={this.saveFCanvas} />
          <Button value='後圖' onClick={this.saveBCanvas}  />
          <Button id='del' value='刪除' onClick={this.handleObjectsRemove} />
          <Button id='draw' value='重畫' onClick={this.handleObjectsDraw}  />
          <Input id='area' title='區域層' value='物件區域' readOnly />
          <Input id='id' type='number' title='物件ID' value={s.objectNum} onChange={::this.handleObjectsId} />
          <Input id='name' title='物件名' value={s.jsonParse.styles[s.objectNum].n} onChange={::this.handleObjectsName} />
          <Input id='x' type='number' title='X 座標' value={s.jsonParse.styles[s.objectNum].l} onChange={::this.handleObjectsX} />
          <Input id='y' type='number' title='Y 座標' value={s.jsonParse.styles[s.objectNum].t} onChange={::this.handleObjectsY} />
          <Input id='width' type='number' title='物件寬' value={s.jsonParse.styles[s.objectNum].w} onChange={::this.handleObjectsW} />
          <Input id='height' type='number' title='物件高' value={s.jsonParse.styles[s.objectNum].h} onChange={::this.handleObjectsH} />
          <Input id='background' title='物件主圖' placeholder={s.jsonParse.styles[s.objectNum].b} readonly />
          <Input id='spriteX' type='number' title='物件拼圖 X 座標' value={s.jsonParse.styles[s.objectNum].x} onChange={::this.handleObjectsSX} />
          <Input id='spriteY' type='number' title='物件拼圖 Y 座標' value={s.jsonParse.styles[s.objectNum].y} onChange={::this.handleObjectsSY} />
          <Input id='zindex' title='物件前後層' placeholder={s.jsonParse.styles[s.objectNum].z} readOnly/>
        </Ui>  : null}
      {s.mapObjects === 2 ?
        <Ui>
          <Button value='前圖' onClick={this.saveFCanvas} />
          <Button value='後圖' onClick={this.saveBCanvas}  />
          <Button id='del' value='刪除' onClick={this.handleObjectsRemove} />
          <Button id='draw' value='重畫' onClick={this.handleObjectsDraw}  />
          <Input id='area' title='區域層' value='碰撞區域' readOnly />
          <Input id='id' type='number' title='物件ID' value={s.objectNum} onChange={::this.handleObjectsId} />
          <Input id='name' title='物件名' value={s.jsonParse.styles[s.objectNum].n} onChange={::this.handleObjectsName} />
          <Input id='x' type='number' title='X 座標' value={s.jsonParse.styles[s.objectNum].l} onChange={::this.handleObjectsX} />
          <Input id='y' type='number' title='Y 座標' value={s.jsonParse.styles[s.objectNum].t} onChange={::this.handleObjectsY} />
          <Input id='width' type='number' title='物件寬' value={s.jsonParse.styles[s.objectNum].w} onChange={::this.handleObjectsW} />
          <Input id='height' type='number' title='物件高' value={s.jsonParse.styles[s.objectNum].h} onChange={::this.handleObjectsH} />
          <Input id='events' type='number' title='事件ID' value={s.jsonParse.isMove[s.objectNum].e} onChange={::this.handleObjectsE} />
          <Input id='inMap' type='number' title='入場圖' value={s.jsonParse.isMove[s.objectNum].cm} onChange={::this.handleObjectsCM} />
          <Input id='inMapPoint' type='number' title='入場點' value={s.jsonParse.isMove[s.objectNum].cmm} onChange={::this.handleObjectsCMM} />
        </Ui>  : null}
	      </main>
	      )
	}
}
