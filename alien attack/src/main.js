var ax = Math.floor(Math.random()*281);
var ay = 20;
var gx = 0;
var gy = 0;
var rem =8;
var fired = 0;
var stat = "";
var win = false;

var cannon = document.querySelector('#cannon');
var alien = document.querySelector('#alien');
var missile = document.querySelector('#missile');

alien.style.left = ax+'px';
var ix = document.querySelector('#inputX');
var output = document.querySelector('#output');
var iy = document.querySelector('#inputY')

var button = document.querySelector('button');
button.style.cursor = "pointer";
button.addEventListener("click", play, false);

window.addEventListener('keydown', play1, false);
function play1(event) {
  if(event.keyCode == 13)
  play();
}
function play(){
  if(isNaN(ix.value) || isNaN(iy.value)){
    output.innerHTML = 'enter numbers only';
    ix.value = "";
    iy.value = "";
  }else {
    rem--;
    fired++;
    stat = "Shots: "+ fired + "\tRemaining: "+ rem;

    gx = parseInt(ix.value);
    gy = parseInt(iy.value);

    if (gx >= ax && gx <= (ax+20) && gy >= ay && gy <= (ay+20)) {
      win = true;
      missile.parentNode.removeChild(missile);
      alien.parentNode.removeChild(alien);
      endgame();
    }
    else {
      output.innerHTML = "MISS! <br>" + stat;
      ix.value = "";
      iy.value = "";
    }
    if (rem == 0) {
      endgame();
    }
    if(!win){
      ax = Math.floor(Math.random()*281);
      ay += 30;
      console.log(ax+" "+ay);
    }
    render();
  }
}
function render(){
  alien.style.left = ax + "px";
  alien.style.top = ay + "px";

  cannon.style.left = gx + "px";

  missile.style.left = gx + "px";
  missile.style.top = gy + "px";
}

function endgame(){
  if(win){
    output.innerHTML = "Hit! You saved the planet!" + "<br>"+ "It only took you " + fired + " shots.<br>reload the page to  play again.";
    exp.style.top = ay +'px';
    explosion();
  }
  else{
    output.innerHTML = "You lost!<br>The planet is destroyed by aliens<br>reload the page to  play again.";
    alien.parentNode.removeChild(alien);
    missile.parentNode.removeChild(missile);
    exp.style.top = ay +30 +'px';
    explosion();
  }
  button.disable = true;
  button.removeEventListener("click", play, false);
  window.removeEventListener("keydown", play1, false);
}

function explosion(){
  //var exp = document.createElement('div');
  //document.body.appendChild(exp);
  //exp.setAttribute("id","exp");
  //exp.style.background = url('../images/explosion.png');
  exp.style.left = ax +'px';
  exp.style.width = '20px';
  exp.style.height = '20px';
}
