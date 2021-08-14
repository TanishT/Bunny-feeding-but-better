const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Render = Matter.Render;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine, world;
var ground, rope, fruit, fruitOptions, fruitLink;
var bunny, bunnyImg;
var bgImg, fruitImg;
var cutButton, blower;
var blink, sad, eat;

var bkSound, eatSound, cutSound, sadSound, airSound;

function preload(){
  bgImg = loadImage("background.png");
  fruitImg = loadImage("melon.png");
  bunnyImg = loadImage("rabbit.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  sad = loadAnimation("sad_2.png","sad_3.png");
  bkSound = loadSound("sound1.mp3");
  eatSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air.wav");
  cutSound = loadSound("rope_cut.mp3");
  sadSound = loadSound("sad.wav");

  blink.playing = true;
  eat.playing=true;
  eat.looping=false;
  sad.playing = true;
  sad.looping = false;
  blink.frameDelay = 10;
  eat.frameDelay = 20;
  sad.frameDelay = 20;
  cutSound.looping = false;
}

function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth; 
    canH = displayHeight; 
    createCanvas(displayWidth+80, displayHeight);
  } 
  else {
    canW = windowWidth; 
    canH = windowHeight; 
    createCanvas(windowWidth, windowHeight);
  }
  bkSound.play();
  bkSound.setVolume(0.2);
  engine = Engine.create();
  world = engine.world;

  ground = new Ground(200,canH-10,2*canW,20);
  console.log(ground.body);
  rope1 = new Rope(7,{x:40, y:30});
  rope2 = new Rope(7,{x:245, y:40});
  rope3 = new Rope(8,{x:390, y:210});

  fruitOptions = {
    density:0.001
  }
  fruit = Bodies.circle(300,300,15,fruitOptions);
  Composite.add(rope1.body,fruit);
  fruitLink1 = new Link(rope1, fruit);
  fruitLink2 = new Link(rope2, fruit);
  fruitLink3 = new Link(rope3, fruit);

  bunny = createSprite(250,height-70,100,100);
  bunny.addImage(bunnyImg);
  bunny.scale = 0.2;

  bunny.addAnimation("blinking",blink);
  bunny.addAnimation("eating",eat);
  bunny.addAnimation("crying",sad);
  bunny.changeAnimation("blinking");

  cutButton1 = createImg("cut_btn.png");
  cutButton1.position(20,30);
  cutButton1.size(50,50);
  cutButton1.mouseClicked(drop1);

  cutButton2 = createImg("cut_btn.png");
  cutButton2.position(220,30);
  cutButton2.size(50,50);
  cutButton2.mouseClicked(drop2);

  cutButton3 = createImg("cut_btn.png");
  cutButton3.position(360,200);
  cutButton3.size(50,50);
  cutButton3.mouseClicked(drop3);

  blower = createImg("balloon.png");
  blower.position(100,200);
  blower.size(90,90);
  blower.mouseClicked(airblow);

  muteButton = createImg("mute.png");
  muteButton.position(canW-100,20);
  muteButton.size(50,50);
  muteButton.mouseClicked(mute);
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
}

function draw() 
{
  background(bgImg);
  
  Engine.update(engine);
  ground.show();
  rope1.show();
  rope2.show();
  rope3.show();
  imageMode(CENTER);
  if(fruit!=null){
    image(fruitImg,fruit.position.x, fruit.position.y,50,50); 
  }

  if(collide(fruit,bunny)){
    bunny.changeAnimation("eating");
    eatSound.play();
    fruit = null;
  }

  if(fruit!=null && fruit.position.y>=550){
    bunny.changeAnimation("crying");
    fruit=null;
    bkSound.stop();
    sadSound.play();
  }

  drawSprites(); 
}

function drop1(){
  cutSound.play();
  rope1.break();
  fruitLink1.detach();
  fruitLink1 = null;
}

function drop2(){
  cutSound.play();
  rope2.break();
  fruitLink2.detach();
  fruitLink2 = null;
}

function drop3(){
  cutSound.play();
  rope3.break();
  fruitLink3.detach();
  fruitLink3 = null;
}

function collide(fruit,sprite){
  if(fruit!=null){
    var d = dist(fruit.position.x, fruit.position.y, sprite.position.x,sprite.position.y);
    if(d<=80){
      console.log(fruit)
      console.log(sprite);
      World.remove(world, fruit);
      fruit = null;
      return true;
    }else{
      return false;
    }
  }
}

function airblow(){
  Body.applyForce(fruit, {x:0, y:0}, {x:0.01, y:0});
  airSound.play();
}

function mute(){
  if(bkSound.isPlaying()){
    bkSound.stop();
  }else{
    bkSound.play();
  }
}




