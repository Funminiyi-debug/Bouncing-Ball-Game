// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var para = document.querySelector('p')

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var count = 0
// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape (x, y, velX, velY, exists) { // this is a constructor function
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists
}

function Ball(x, y, velX, velY, exists, color, size) {
Shape.call(this, x, y, velX, velY, exists)	// this is a constructor function
  
  this.color = color;
  this.size = size;
}

function EvilCircle(x, y, exists){
	Shape.call(this, x, y, 20, 20, exists)
	this.color = 'white';
	this.size = 10;
}

EvilCircle.prototype.draw = function() {
	ctx.beginPath(); // to begin drawing on the 2D canvas element created on line 4
	ctx.lineWidth = 3;
	  ctx.strokeStyle = this.color; // to fill the color of the outer line
	  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // to draw a cicle. the x and y gives the positioning of the cicle, and the 0 and 2PI gives the start and ending position of the circle, making it a complete circle
	  ctx.stroke(); // to finish up drawing the stroke	
}

EvilCircle.prototype.checkBounds = function() {
	if ((this.x + this.size) >= width) {// x is the position at the centre and the size is the radius
    this.x -= this.size;// to reverse the polarity of the movement
  }

  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y += this.size;
  }

}

EvilCircle.prototype.setControls = function() {
	var _this = this;
	window.onkeydown = function(e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  }
}

EvilCircle.prototype.collisionDetect = function() {
	
	for (var j = 0; j < balls.length; j++) {
		
    if (balls[j].exists === true) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
	  

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
		balls[j].x = null
		balls[j].y = null 
		count--
		para.textContent = 'Balls Count ' + count
      }
	
	
    }
  }
  
}

Ball.prototype.draw = function() { // function to draw ball
  ctx.beginPath(); // to begin drawing on the 2D canvas element created on line 4
  ctx.fillStyle = this.color; // to fill the color of the drawn shape
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // to draw a cicle. the x and y gives the positioning of the cicle, and the 0 and 2PI gives the start and ending position of the circle, making it a complete circle
  ctx.fill(); // to finish up the path drawn in beginPath() function above
}

Ball.prototype.update = function() {// function to test if ball is at the edge of the shape
  if ((this.x + this.size) >= width) {// x is the position at the centre and the size is the radius
    this.velX = -(this.velX);// to reverse the polarity of the movement
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}


Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

var balls = []; // to add balls in an array

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';// to make the canvas a little transparent 
  ctx.fillRect(0, 0, width, height); // to cover the canvas with a rectangle. the 0,0 are the starting coordinates, while width, height are the ending coordinates
	var evilCircle	= new EvilCircle(20, 50, true)
	evilCircle.setControls()
  while (balls.length < 25) {// balls is the empty array above
    var size = random(10,20);
    var ball = new Ball(
      // ball position always drawn at least one ball width
      // away from the edge of the canvas, to avoid drawing errors
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
	  true,
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      size
    );
    balls.push(ball);
	count++
	para.textContent = 'Balls Count: ' + count
  }
  
  for (var i = 0; i < balls.length; i++) {
if (balls[i].exists === true){
	
   balls[i].draw();
   balls[i].update();
	balls[i].collisionDetect();

  }
  evilCircle.draw()
  evilCircle.checkBounds()
  evilCircle.collisionDetect()
  
  }


  requestAnimationFrame(loop);/* when this method is constantly run and passed the same function name, 
  it will run that function a set number of times per second to create a smooth animation. 
  This is generally done recursively — which means that the function is calling itself every time it runs,
  so it will run over and over again.*/
}

loop();
