  //Create variables here
  var foodS,foodStock,database;
  var dog,happyDog,dogImg,happyImg,foodObj;
  var feed,addFood;
  var fedTime,lastFed;
  var changeState,readState;
  var bedroom,washroom,garden;
  var sadImg;

function preload()
{
  //load images here
  dogImg=loadImage("dogImg.png");
  happyImg=loadImage("dogImg1.png");
  bedroom=loadImage("Bed Room.png");
  washroom=loadImage("Wash Room.png");
  garden=loadImage("Garden.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj=new Food()
  foodStock=database.ref('Food');
  foodStock.on("value",readStock)
  
  dog=createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale=0.2;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  
}

function draw() {  
  background("deeppink");

  //if(keyWentDown(UP_ARROW)){
  //writeStock(foodS);
  //dog.addImage(happyImg);
  //}else if(keyWentUp(UP_ARROW)){
  //dog.addImage(dogImg);
  //}

  if(gameState!="Hungry"){
 feed.hide()
 addFood.hide()
 dog.remove()
  }else{
    feed.show()
    addFood.show()
    dog.addImage(dogImg);
  }

  currentTime=hour()
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden()
  }else if(currentTime==(lastFed+2)){
    update("Sleeping")
    foodObj.bedroom()
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washroom()
  }else{
    update("Hungry")
    foodObj.display()
  }

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val()
  });
  fill("white")
  textSize(15);
  if(lastFed>=12){
  text("Last Feed:"+ lastFed%12 +"PM",200,30);
  }else if(lastFed==0){
  text("Last Feed: 12 AM",200,30)
  }else{
    text("Last Feed:"+ lastFed +"AM",200,30);
  }
  
  

  drawSprites();

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyImg);

foodObj.updateFoodStock(foodObj.getFoodStock()-1)
database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()
  })
}

  function addFoods(){
foodS++
database.ref('/').update({
  Food:foodS 
  })
}

function update(state){
database.ref('/').update({
  gameState:state
})


}




