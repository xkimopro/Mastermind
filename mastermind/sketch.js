var colors = [];
var quad = [];
var theCode = [];
var buttons = [];
var colorPick = 0;
var tempColorPick = 0;
var round;
var pins = [];
var rows = [];
var goButton;
var pop;

class row {
    constructor(active,index,quad){
    this.active = active;
    this.index = index;
    this.quad = quad;
    this.pins = [];
    this.reds = 0;
    this.whites = 0;

    for (var i=0; i<4; i++){
      this.pins[i] = new pin((150+((i)*100)), (50+(this.index)*50) ,this.quad[i],index);
    }

    }

    paint(){
      if (this.active == 0){
        for (var i=0; i<4; i++){
        this.pins[i].changeColor(0);
        this.pins[i].paint();
        }
      }
      else if (this.active == 1){
        for (var i=0; i<4; i++){
        this.pins[i].changeColor(colors[this.quad[i]]);
        this.pins[i].paint();
        }
      }
      else {
        for (var i=0; i<4; i++){
          for (var i=0; i<4; i++){
          this.pins[i].paint();
          }
        }
      }
    }
    setActive(active){
      this.active = active;
    }

}

class pin {
  constructor(x,y,c,i){
    this.x = x;
    this.y = y;
    this.c = c;
    this.index = i;
    this.hov = false;
    this.col = colors[c];
  }
  changeColor(col){
    this.col = col;
  }
  paint(){
    this.hov = (dist(mouseX,mouseY,this.x,this.y)<15);
    if (this.hov){
    fill(colors[colorPick]);
    ellipse(this.x,this.y,30);2
    }
    else {
    fill(this.col);
    ellipse(this.x,this.y,30);
    }
  }
  onClick(){
      this.col = colorPick;
  }
}

class colorButton {

  constructor(x,y,c){
  this.x = x;
  this.y = y;
  this.c = c;
  this.col = colors[c];
  this.op = false;
  }

  paint(){
  var myCol = this.col;
  if (this.op == false){
    noStroke();
    fill(myCol);
    rect(this.x, this.y, 55,55);
  }
  else {
    stroke(10);
    fill(myCol);
    rect(this.x, this.y, 55,55);
  }
  }


  changeAlpha(){
    if (mouseX >= this.x && mouseY >= this.y && mouseX <= this.x+55 &&  mouseY <= this.y+55){
    this.op = true;
    tempColorPick = this.c;
    }
    else {
    this.op = false;
    }
  }

  onClick(){
    if (this.op){
    colorPick = tempColorPick;
    pop.play();
    }
  }
}


function mousePressed(){
  for (var i=0; i<8; i++){
  buttons[i].onClick();
  }
  tempRow = rows[round];

  for (var i=0; i<4; i++){
    tempPin = tempRow.pins[i];
    if ((dist(mouseX,mouseY,tempPin.x,tempPin.y)<15)){
      (rows[round]).quad[i] = tempColorPick;
      pop.play();
  }
  }

}

function scoreDraw( reds, whites,h){

  for (var i=0; i<reds; i++){
    fill (200,0,0);
    ellipse(100-(i*20), (50+ h*50), 10);
  }

  for (var i=0; i<whites; i++){
    fill (255);
    ellipse(500+(i*20), (50+(h)*50), 10);
  }
  if (reds==4){
    alert("YOU WIN");
  }
  if (round == 11 && reds!=4){
    alert("YOU LOSE");
    exit();
  }
}

function dist(x1,y1,x2,y2){
  return (Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
}

function getRand(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function drawLine (code , y){
for (var i=0; i<4; i++){
  fill(colors[code[i]]);
  ellipse(150+(100*(i)), y, 30);
  }
}

function drawColorButton(x,y,colorIndex){
  if (mouseX >= x && mouseY >= y && mouseX <= x+55 && mouseY <= y+55){
  fill(colors[colorIndex]);
  rect(x, y, 55, 55);
  tempColorPick = colorIndex;
  }
  else {
  fill(colors[colorIndex]);
  tempColorPick = colorPick;
  }
  rect(x, y, 55, 55);

}

function colorSet(){
colors = [];
colors.push(color(255,0,0,200)); // red
colors.push(color(0,255,0,200)); //green
colors.push(color(0,204,204,200)); //blue
colors.push(color(255,153,51,200)); //orange
colors.push(color(255,255,255,200)); // white
colors.push(color(255,102,178,200)); // pink
colors.push(color(192,192,192,200)); // gray
colors.push(color(255,255,0,200)); // yellow
}

function setCode (code){
  var check = [];
  var randIndex = 0;
  for (var i=0; i<8; i++){
    check[i] = false;
  }

  for (var i=0; i<4; i++){
    randIndex = getRand(0,7);
    if (check[randIndex] == false){
      code[i] = randIndex;
      check[randIndex] = true;
    }
    else {
      while (check[randIndex]){
        randIndex = getRand(0,7);
        if (check[randIndex] == false){
          code[i] = randIndex;
          check[randIndex] = true;
          break;
        }
      }

    }
  }
}

function checkValidMove(){
  var check = [];
  var q = [];
  tempRow = rows[round];

  for (var i=0; i<8; i++){
    check[i] = false;
  }
  for (var i=0; i<4; i++){
    q[i] = tempRow.quad[i];
    check[q[i]] = true;
  }

  var counter = 0;
  for (var i=0; i<8; i++){
  if (check[i]){
    counter++;
  }
  }
  if (counter == 4){
  var whites = 0;
  var reds = 0;
  for (var i =0; i<4; i++){
      for (var j=0; j<4; j++){
          if (theCode[i] == q[j]){
              if (i==j){
                reds++;
              }
              else {
                whites++;
              }
          }
      }
  }
  rows[round].reds = reds;
  rows[round].whites = whites;
  round++;
  pop.play();
  }

}


function preload(){
  pop = loadSound("pop.wav");
  logo = loadImage('logo.png');
}
function setup() {
  round = 0;
  colorSet();
  setCode(theCode);
  for (var i=0; i<12; i++){
    setCode(quad);
    rows[i] = new row(0,i,quad);
  }


  for (var i=0; i<8; i++){
    buttons[i] = new colorButton(25+70*(i),700,i);
  }

  createCanvas(3*displayWidth/4,5*displayHeight/4);
  button = createButton('Submit Move');
}

function draw() {
  c1 = color("#159957");
  c2 = color("#155799");
  setGradient(c1, c2);
  button.mousePressed(checkValidMove);
  button.position(160,800);
  
  for (var i=0; i<8; i++){
    buttons[i].changeAlpha();
    buttons[i].paint();
  }
  for (var i=0; i<12; i++){
    rows[i].paint();
  }

  for (var i=0; i<=round; i++){
    if (i==round){
    rows[i].setActive(1);
    }
    else {
    scoreDraw(rows[i].reds, rows[i].whites, i);
    rows[i].setActive(2);
    }
  }
  image(logo, 0, 920);

}

function setGradient(c1, c2) {
  // noprotect
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}


