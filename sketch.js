/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var jungle, invisiblejungle;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;
var eatsound, appleimg
var appleGroup

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  appleimg = loadImage("assets/apple.png");
  jumpSound = loadSound("assets/jump.mp3");
  collidedSound = loadSound("assets/collided.wav");
  eatsound = loadSound("assets/eatingsound.wav");
}

function setup() {
  createCanvas(950,600);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(50,200,20,50);
  kangaroo.addAnimation("running", kangaroo_running);
  kangaroo.addAnimation("collided", kangaroo_collided);
  kangaroo.scale = 0.15;
  //kangaroo.debug = true
  kangaroo.setCollider("circle",0,0,300)

  invisibleGround = createSprite(400,350,1600,10);
  invisibleGround.visible = false;

  gameOver = createSprite(450,200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5
  gameOver.visible = false

  restart = createSprite(450,300);
  restart.addImage(restartImg);
  restart.scale = 0.5
  restart.visible = false

  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  appleGroup = new Group()
  score = 0;

}

function draw() {
  background(255);
  
  // kangaroo.x=camera.positionX-270;
  // kangaroo.x=Camera.position.x-270;
   kangaroo.x=camera.position.x-270;
  // kangaroo.x=Camera.Position.X-270;
   
  if (gameState===PLAY){
    
    jungle.velocityX=-5

    if(jungle.x<200)
    {
       jungle.x=400
    }
   console.log(kangaroo.y)
    if(keyDown("space")&& kangaroo.y>270) {
      jumpSound.play();
      kangaroo.velocityY = -18;
    }
  
    kangaroo.velocityY = kangaroo.velocityY + 0.8
    spawnShrubs();
    spawnObstacles();
    SpawnApples()
    kangaroo.collide(invisibleGround);
    
    if(obstaclesGroup.isTouching(kangaroo)){
      collidedSound.play();
      gameState = END;
    }
    if(shrubsGroup.isTouching(kangaroo)){
      shrubsGroup[0].destroy()
      eatsound.play()
      score = score +2
    }
    if(appleGroup.isTouching(kangaroo)){
      appleGroup[0].destroy()
      eatsound.play()
      score = score +2
    }
  }
  else if (gameState === END) {
    gameOver.visible = true
    restart.visible = true;
    kangaroo.velocityY = 0;
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    appleGroup.setVelocityXEach(0);

    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    appleGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)) 
    {
        reset();
    }
  }
 
  drawSprites();
  textSize(25)
  fill("purple")
  text("Press space to jump! Help the Kangaroo to eat the plants and avoid the rocks!",20,60)
  text ("Score: " + score,20,30)
}

function spawnShrubs() {

  if (frameCount % 100 === 0) {

    // var shrub = createSprite(camera.position+500,330,40,10);
     var shrub = createSprite(camera.position.x+500,330,40,10);
    // var shrub = createSprite(camera.positionX+500,330,40,10);
    // var shrub = createSprite(Camera.position.x+500,330,40,10);

    shrub.velocityX = -(6 + 3*score/4)
    shrub.scale = 0.6;

    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: shrub.addImage(shrub1);
              break;
      case 2: shrub.addImage(shrub2);
              break;
      case 3: shrub.addImage(shrub3);
              break;
      default: break;
    }
         
    shrub.scale = 0.05;
    shrub.lifetime = 400;
    
    shrub.setCollider("rectangle",0,0,shrub.width/2,shrub.height/2)
    shrubsGroup.add(shrub);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    // var obstacle = createSprite(camera.Position.X+400,330,40,40);
    // var obstacle = createSprite(Camera.Position.x+400,330,40,40);
    var obstacle = createSprite(camera.position.x+400,330,40,40);
    // var obstacle = createSprite(camera.position.x.400,330,40,40);

    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(7 + 3*score/4)
    obstacle.scale = 0.15;   
 
    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}

function SpawnApples(){
  if(frameCount % 90 === 0){
    var apple = createSprite(930,120,40,10);
    apple.scale = 0.15; 
    apple.addImage(appleimg);
    apple.velocityX = -(5 + 3*score/4)
    apple.lifetime = 300
    appleGroup.add(apple)
  }
}

function reset()
{
  gameState = PLAY;
  kangaroo.changeAnimation("running", kangaroo_running);
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach()
  shrubsGroup.destroyEach();
  appleGroup.destroyEach();
  score = 0
  
}