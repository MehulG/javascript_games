var stage = document.querySelector('#stage');
var output = document.querySelector('#output');
var reload = document.querySelector('#reload');

reload.addEventListener("click", replay, false);

function replay(){
  location.reload();
}

var map = [
  [0,2,0,0,0,3],
  [0,0,0,1,0,0],
  [0,1,0,0,0,0],
  [0,0,0,0,2,0],
  [0,2,0,1,0,0],
  [0,0,0,0,0,0]
];
var game_obj =[
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,5,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [4,0,0,0,0,0]
];

var water = 0;
var island = 1;
var pirate = 2;
var home = 3;
var ship = 4;
var monster = 5;

var size = 64;

var row = map.length;
var col = map[0].length;

var ship_row;
var ship_col;
var mon_row;
var mon_col;

var food = 10;
var gold = 10;
var exp = 0;
var msg = 'Use arrow keys to find a way home.';

for(var r = 0; r < row; r++){
  for(var c = 0; c < col; c++){
    if (game_obj[r][c] == ship) {
      ship_row = r;
      ship_col = c;
    }
    if (game_obj[r][c] == monster) {
      mon_col = c;
      mon_row = r;
    }
  }
}


window.addEventListener('keydown',keydownHandler, false);

var up = 38;
var down = 40;
var left = 39;
var right = 37;

render();

function keydownHandler(event){

  if (event.keyCode == 37 ||event.keyCode == 38 ||event.keyCode == 39 ||event.keyCode == 40) {

    switch (event.keyCode) {
      case up:
        if(ship_row > 0){
          game_obj[ship_row][ship_col] = 0;
          ship_row--;
          game_obj[ship_row][ship_col] = ship;
        }
        break;
      case down:
        if (ship_row < row-1) {
          game_obj[ship_row][ship_col] = 0;
          ship_row++;
          game_obj[ship_row][ship_col] = ship;
        }
        break;
      case right:
        if (ship_col > 0) {
          game_obj[ship_row][ship_col] = 0;
          ship_col--;
          game_obj[ship_row][ship_col] = ship;
        }
        break;
      case left:
      if (ship_col < col-1) {
        game_obj[ship_row][ship_col] = 0;
        ship_col++;
        game_obj[ship_row][ship_col] = ship;
        }
        break;
    }
    mon_move();


    switch (map[ship_row][ship_col]) {
      case water:
        msg = 'You sail open seas.';
        break;
      case pirate:
        fight();
        break;
      case island:
        trade();
        break;
      case home:
        endGame();
        break;
    }
    if (ship_row == mon_row && ship_col == mon_col) {
      console.log("1");
      endGame();
    }


    food--;


    if(food<=0 || gold<=0){
      endGame();
    }

    render();

  }
}
function mon_move(){
  var up =1;
  var down =2;
  var left =3;
  var right = 4;

  var valid_dir =[];
  var dir = undefined;

  if (mon_row>0) {
    var above = map[mon_row - 1][mon_col];
    if (above === water) {
      valid_dir.push(up);
    }
  }
  if (mon_row < row-1) {
    var below = map[mon_row+1][mon_col];
    if (below === water) {
      valid_dir.push(down);
    }
  }
  if (mon_col>0) {
    var left_side = map[mon_row][mon_col - 1];
    if (left_side === water) {
      valid_dir.push(left);
    }
  }
  if (mon_row < col-1) {
    var right_side = map[mon_row][mon_col+1]
    if (right_side === water) {
      valid_dir.push(right);
    }
  }

  if (valid_dir.length != 0) {
    var ran = Math.floor(Math.random()*valid_dir.length);
    dir = valid_dir[ran];
  }

  switch (dir) {
    case up:
      game_obj[mon_row][mon_col] = 0;
      mon_row--;
      game_obj[mon_row][mon_col] = monster;
      break;
    case down:
      game_obj[mon_row][mon_col] = 0;
      mon_row++;
      game_obj[mon_row][mon_col] = monster;
      break;
    case left:
      game_obj[mon_row][mon_col] = 0;
      mon_col--;
      game_obj[mon_row][mon_col] = monster;
      break;
    case right:
      game_obj[mon_row][mon_col] = 0;
      mon_col++;
      game_obj[mon_row][mon_col] = monster;
      break;
  }
}

function trade(){
  var food_avl = exp + gold;
  var cost = Math.ceil(Math.random()*food_avl);

  if (gold > cost) {
    gold -= cost;
    food += food_avl;
    exp += 2;

    msg = 'You buy ' + food_avl +' bags food for ' + cost +' gold.';
  }
  else {
    exp+=1;
    msg = 'You do not have enough gold to buy food.';
  }
}

function fight(){
  var ship_st = Math.ceil((food+gold)/2);
  var p_st = Math.ceil(Math.random() * ship_st * 2);

  if(p_st > ship_st){
    var steal = Math.round(p_st / 2);
    gold -= steal;
    exp+=2;
    msg = 'You fight but lose.' + steal +' Gold was stolen from you.';
  }
  else{
    var p_gold = Math.round(p_st/2);
    gold += p_gold;
    exp += 3;
    msg = 'You fight and win.' + p_gold +' Gold was seiged from pirates.';
  }
}

function endGame() {
  if(map[ship_row][ship_col] == home){
      msg = 'You made home ALIVE.<br> Your score: '+ (food+gold+exp);
  }
  else if(ship_row == mon_row && ship_col == mon_col){
    console.log('msg');
    msg = "Your ship has been swallowed by a sea monster!";
  }else{
    if (gold<=0) {
      msg = 'You LOSE. You\'ve run out of gold';
    }if (food<=0) {
      msg = 'You LOSE. You\'ve run out of food';
    }
  }
  //console.log('last');
  window.removeEventListener("keydown", keydownHandler, false);
  render();
}

function render(){
  if (stage.hasChildNodes()== true) {
    for(var i = 0; i < row*col; i++){
      stage.removeChild(stage.firstChild);
    }
  }
  for(var r = 0; r < row; r++){
    for(var c = 0; c< col; c++){

      var cell = document.createElement('img');
      cell.setAttribute("class", "cell");
      stage.appendChild(cell);

      switch (map[r][c]) {
        case water:
          cell.src = '../images/water.png';
          break;
        case island:
          cell.src = '../images/island.png';
          break;
        case home:
          cell.src = '../images/home.png';
          break;
        case pirate:
          cell.src = '../images/pirate.png';
          break;
      }

      switch (game_obj[r][c]) {
        case ship:
          cell.src = '../images/ship.png';
          break;
        case monster:
          cell.src = '../images/monster.png';
          break;
      }

      cell.style.top = r*size +'px';
      cell.style.left = c*size +'px';
    }
  }

  output.innerHTML = msg;
  output.innerHTML+= '<br>Gold:  '+ gold+'  Food: '+food+'  Experience: '+exp;

}
