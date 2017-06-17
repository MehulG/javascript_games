function hitTestRectangle(r1, r2)
{
  //A variable to determine whether there's a collision
  var hit = false;

  //Calculate the distance vector
  var vx = r1.center_x() - r2.center_x();
  var vy = r1.center_y() - r2.center_y();

  //Figure out the combined half-widths and half-heights
  var combinedhalf_widths = r1.half_width() + r2.half_width();
  var combinedhalf_heights = r1.half_height() + r2.half_height();

  //Check for a collision on the x axis
  if(Math.abs(vx) < combinedhalf_widths)
  {
    //A collision might be occuring. Check for a collision on the y axis
    if(Math.abs(vy) < combinedhalf_heights)
    {
      //There's definitely a collision happening
      hit = true;
    }
    else
    {
      //There's no collision on the y axis
      hit = false;
    }
  }
  else
  {
    //There's no collision on the x axis
    hit = false;
  }

  return hit;
}
