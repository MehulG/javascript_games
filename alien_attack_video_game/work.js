(function () {

  var canvas = document.querySelector('#canvas');
  var drawing_surface =  canvas.getContext('2d');

  //array to store objects
  var sprites = [];
  var assets = [];
  var missiles = [];
  var aliens = [];
  var messages = [];

  //background object
  var background = Object.create(sprite_object);
  background.source_y = 32;
  background.source_height = 320;
  background.source_width = 480;
  background.height = 320;
  background.width = 480;
  sprites.push(background);

  //cannon object
  var cannon = Object.create(sprite_object);
  cannon.x = (canvas.width - cannon.width) /2;
  cannon.y = (canvas.height - cannon.height - 10);
  sprites.push(cannon);

  //tilesheet image
  var image = new Image();
  image.src= 'images/image.png';
  image.addEventListener('load', loadHandler, false);
  assets.push(image);

  //loading sounds
  var music = document.querySelector('#music');        //backgrouond music
  music.addEventListener('canplaythrough', loadHandler, false);
  music.load();
  assets.push(music);
  music.muted = false;

  var shoot_sound = document.querySelector('#shoot');
  shoot_sound.addEventListener('canplaythrough', loadHandler, false);
  shoot_sound.load();
  assets.push(shoot_sound);

  var explosion_sound = document.querySelector('#explosion');
  explosion_sound.addEventListener('canplaythrough', loadHandler, false);
  explosion_sound.load();
  assets.push(explosion_sound);

  //message objects
  var score_display = Object.create(message_object);
  score_display.font = 'normal bold 30px game_font';
  score_display.fillStyle = '#00ff00';
  score_display.x = 380;
  score_display.y = 10;
  messages.push(score_display);

  //game over message
  var game_over_message = Object.create(message_object);
  game_over_message.font = 'normal bold 20px game_font';
  game_over_message.fillStyle = '#00ff00';
  game_over_message.x = 150;
  game_over_message.y = 140;
  game_over_message.visible = false;
  messages.push(game_over_message);

  var assets_loaded = 0;
  var alien_freq = 100;   //determines how freq aliens are created
  var alien_timer = 0;

  //game states
  var LOADING = 0;
  var PLAYING = 1;
  var OVER = 2;
  var game_state = LOADING;

  var RIGHT = 39;
  var LEFT = 37;
  var SPACE = 32;

  //direction
  var move_right = false;
  var move_left = false;

  //missile
  var shoot = false;
  var space_pressed = false;

  var score = 0;

  //buttons
  var reload = document.querySelector('#reload');
  reload.addEventListener('click', function(){
    location.reload();
  }, false);

  //unmute
  var mute = 0;
  var unmute = document.querySelector('#unmute');
  unmute.addEventListener('click', function(){
    mute++;
    if(mute%2 == 0){
      music.pause();
      unmute.innerHTML = 'Unmute background';
    }else {
      music.play();
      unmute.innerHTML = 'Mute background';
    }
  }, false);

  //keyboard listeners
  window.addEventListener('keydown',function(event){
    switch (event.keyCode) {
      case RIGHT:
        move_right = true;
        break;
      case LEFT:
        move_left = true;
        break;
      case SPACE:
        if (!space_pressed) {
          shoot = true;
          space_pressed = true;
        }
        break;
    }
  }, false);

  window.addEventListener('keyup', function(event){
    switch (event.keyCode) {
      case RIGHT:
        move_right = false;
        break;
      case LEFT:
        move_left = false;
        break;
      case SPACE:
        space_pressed = false;
        break;
    }
  }, false);

  update();

  function update() {

    requestAnimationFrame(update, canvas);

    switch (game_state) {
      case LOADING:
        console.log('loading...');
        break;
      case PLAYING:
        playgame();
        break;
      case OVER:
        endgame();
        break;
    }

    //render the game
    render();
  }

  //loadHandler

  function loadHandler() {
    assets_loaded++;
    console.log(assets_loaded, assets.length);
    if (assets_loaded == assets.length) {

      //remove Event Listener from imagesand sounds
      image.removeEventListener('load', loadHandler, false);
      music.removeEventListener('canplaythrough', loadHandler, false);
      shoot_sound.removeEventListener('canplaythrough', loadHandler, false);
      explosion_sound.removeEventListener('canplaythrough', loadHandler, false);

      //play music
      music.play();
      music.volume = 0.1;

      game_state = PLAYING;
    }
  }

  function playgame() {
    if (move_left && !move_right) {
      cannon.vx = -5;
    }
    if (move_right && !move_left) {
      cannon.vx = 5;
    }
    if(!move_left && !move_right){
      cannon.vx = 0;
    }

    if (shoot) {
      fire_missile();
      shoot = false;
    }

    //setting boundries
    cannon.x = Math.max(0,Math.min(cannon.x + cannon.vx, canvas.width - cannon.width));

    //moving the missiles
    for(var i = 0; i < missiles.length; i++){
      var missile = missiles[i];
      missile.y += missile.vy;

      //removing missiles once they reach top
      if (missile.y < canvas.y - missile.height) {
        removeObject(missile, sprites);
        removeObject(missile, missiles);
        i--;
      }
    }
    //making aliens
    alien_timer++;
    if (alien_timer == alien_freq) {
      make_alien();
      alien_timer = 0;
      //reduce time between creation of aliens
      if (alien_freq > 50) {
        alien_freq--;
      }
    }

    //looping through aliens and giving them downward motion
    for(var i = 0; i< aliens.length; i++){
      var alien = aliens[i];

      if (alien.state == alien.NORMAL) {
        alien.y += alien.vy;
      }

      //checking if alien reached bottom
      if (alien.y == canvas.height - alien.height) {
        game_state = OVER;
      }
    }

    //detecting collision between missile and alien
    for(var i = 0; i < aliens.length; i++){

      var alien = aliens[i];

      for(var j = 0; j < missiles.length; j++){
        missile = missiles[j];
        var hit = hitTestRectangle(alien,missile);
        if (hit && alien.state == alien.NORMAL) {
          destroy_alien(alien);
          //update score
          score++;
          removeObject(missile,missiles);
          removeObject(missile,sprites);
          j--;
        }
      }
    }

    //score update
    score_display.text = score;
  }

  function destroy_alien(alien) {

    //explosion sound play
    explosion_sound.currentTime = 0;
    explosion_sound.play();

    alien.state = alien.EXPLODED;
    alien.update();

    setTimeout(remove_alien,1000);
    function remove_alien() {
      removeObject(alien,aliens);
      removeObject(alien,sprites);
    }
  }

  function make_alien() {

    var alien = Object.create(alien_object);
    alien.source_x = 32;

    alien.y = - alien.height;

    //assign a random position
    alien.x = Math.floor(Math.random()*canvas.width/alien.width) * alien.width;

    //alien speed
    alien.vy = 1;

    sprites.push(alien);
    aliens.push(alien);
  }

  function removeObject(object_to_remove, array) {
    var i = array.indexOf(object_to_remove);
    if (i != 1) {
      array.splice(i,1);
    }
  }

  function fire_missile() {
    //creating missile object
    var missile = Object.create(sprite_object);
    missile.source_x = 96;
    missile.source_width = 16;
    missile.source_height = 16;
    missile.width = 16;
    missile.height = 16;

    //centering it over cannon
    missile.x = cannon.center_x() - missile.half_width();
    missile.y = cannon.y - missile.height;

    //speed of missile
    missile.vy = -8;

    //pushing into both arrays
    sprites.push(missile);
    missiles.push(missile);

    //playing sound
    shoot_sound.currentTime = 0;
    shoot_sound.play();
  }

  function endgame() {
    game_over_message.visible = true;
    game_over_message.text = 'GAME OVER';
  }

  function render() {

    drawing_surface.clearRect(0,0,canvas.width,canvas.height);

    //display sprites
    if (sprites.length != 0) {
      for(var i = 0; i < sprites.length; i++){
        var sprite = sprites[i];
        drawing_surface.drawImage(
          image,
          sprite.source_x , sprite.source_y,
          sprite.source_width,sprite.source_height,
          sprite.x, sprite.y,
          sprite.width, sprite.height
        );
      }
    }

    if (messages.length != 0) {
      for(var i = 0; i < messages.length; i++){
        var message = messages[i];
        if (message.visible) {
          drawing_surface.font = message.font;
          drawing_surface.fillStyle = message.fillStyle;
          drawing_surface.textBaseline = message.textBaseline;
          drawing_surface.fillText(message.text, message.x, message.y);
        }
      }
    }
  }

}());
