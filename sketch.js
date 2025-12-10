// CS30 Major Project, Cooking Game
// Elaine King
// 11/19/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

//Patience variables for timed orders
const MAX_PATIENCE = 100;
const BUTTON_WIDTH = 250;
const BUTTON_HEIGHT = 100;

//background images, buttons and icons
let startImg;
let grillImg;

let playButton;
let tutorialButton;

// patties
let rawPatty;
let beingCookedPatty;
let perfectPatty;
let overcookedPatty;

// toppings
let pickle;
let cheese;
let tomato;
let onion;
let lettuce;

// sauces
let bbq;
let mustard;
let ketchup;
let mayo;

// sound effects
let click;
let backgroundMusic;
let sizzle;
let sauceSqueeze;


let isHovered = false;
let state = "grill";


class Customer {
  constructor() {
    this.order = this.generateOrder();
    this.patience = MAX_PATIENCE;
    
  }

  generateOrder() {
    
  }
}

// either make this class an extention or maybe not depending on how it all goes
class Patty {
  constructor(x, y) {
    // setting size/location
    this.x = x;
    this.y = y;
    this.size = 100;

    // setting beginning state and cooking variables
    this.state = "raw";
    this.isDragging = false;
    this.onGrill = false;
  }

  updatePatty() {
    if (this.onGrill) {
      cookingTime ++;   // set the constants
      if (cookingTime < RAW) {
        this.state = "raw";
      }
      else if (cookingtime > RAW & cookingtime < COOKED) {
        this.state = "halfCooked";
      }
      else if (cookingtime >= COOKED && cookingTime <= PERFECT) {
        this.state = "perfect";
      }
      else {
        this.state = "overcooked";
      }
    }
    if (this.isDragging) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  display() {
    if (this.state === "raw"){
      image(rawPatty, this.x, this.y, this.size, this.size);
    }
  }
}

function preload() {
  // images/sounds all being loaded before they are used

  // background images, icons and buttons
  startImg = loadImage("assets/intro.png");
  grillImg = loadImage("assets/grillbackground.png");
  playButton = loadImage("assets/playbutton.png");

  // patties
  rawPatty = loadImage("assets/rawpatty.png");
  mediumPatty = loadImage("assets/perfectpatty.png");
  overcookedPatty = loadImage("assets/overcookedpatty.png");
  
  // toppings
  onion = loadImage("assets/onion.png");
  tomato = loadImage("assets/tomato.png");
  pickle = loadImage("assets/pickle.png");
  cheese = loadImage("assets/slicedcheese.png");
  lettuce = loadImage("assets/lettuce.png");

  // sauces
  ketchup = loadImage("assets/ketchup.png");
  bbq = loadImage("assets/bbq.png");
  mustard = loadImage("assets/mustard.png");
  mayo = loadImage("assets/mayo.png");

  // sound effects
  click = loadSound("assets/click.mp3");
}

function setup() {
  createCanvas(displayWidth, displayHeight);

}

function draw() {
  background(220);
  drawState();
}

function drawState() {
  if (state === "start"){
    // displays the intro image and the play button
    imageMode(CENTER);
    image(startImg, width/2, height/2, width, height);
    checkHover();
    if (!isHovered) {
      image(playButton, width/2, height/1.3, BUTTON_WIDTH, BUTTON_HEIGHT);
    }
    else {
      image(playButton, width/2, height/1.3, BUTTON_WIDTH*1.5, BUTTON_HEIGHT*1.5);
    }
  }
  if (state === "tutorial"){
    background("blue");
  }
  if (state === "grill"){
    
    
  }
  if (state === "assembly"){
  
  }
}

function mousePressed() {
  if (state === "start" && isHovered) {
    click.play();
    state = "tutorial";
  }
  if (state === "grill"){
    
  }
  if (state === "assembly") {
    
  }
}

// checks if the mouse is hovering above buttons/items and gives back true/false
function checkHover() {
  if (state === "start"){
    if (mouseX < width/2 + BUTTON_WIDTH/2 && mouseX > width/2 - BUTTON_WIDTH/2 && mouseY < height/2*1.5 + BUTTON_HEIGHT/2 && mouseY > height/2*1.5 - BUTTON_HEIGHT/2) {
      isHovered = true;
    }
    else {
      isHovered = false;
    }
  }
  if (state === "tutorial"){

  }
  if (state === "grill"){

  }
  if (state === "assembly"){
  
  } 
}

// kills the window if they do something bad
function die() {
  sleep(1000);
  window.close();
}

// Receipt in corner - can be brought out/pushed in

// Introductory Dialogue, background and gather player name/ tutorial that can be SKIPPED