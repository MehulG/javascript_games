var sprite_object = {

  source_x: 0,
  source_y: 0,
  source_width: 32,
  source_height: 32,

  x: 0,
  y: 0,
  width : 32,
  height : 32,

  vx: 0,
  vy: 0,

  visible: true,

  center_x: function(){
    return this.x + (this.width/2);
  },
  center_y: function(){
    return this.y + (this.height/2);
  },
  half_width: function(){
    return this.width/2;
  },
  half_height: function(){
    return this.height/2;
  }
};

// alien object
var alien_object = Object.create(sprite_object);
alien_object.NORMAL = 1;
alien_object.EXPLODED = 2;
alien_object.state = alien_object.NORMAL;
alien_object.update = function(){
this.source_x = this.state * this.width;
};
//message Object
var message_object = {
  x : 0,
  y : 0,
  visible : true,
  text : 'Message',
  font : 'normal 20px Helvetica',
  fillStyle : '00ff00',
  textBaseline: 'top'
};
