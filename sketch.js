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
let state = "start";


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
      cookingTime ++;   // fix these somenumbers
      if (cookingTime < SOMENUMBERHERE) {
        this.state = "raw";
      }
      else if (cookingtime > SOMESORTOFNUMBER & cookingtime < SOMENUMBER) {
        this.state = "beingCooked";
      }
      else if (cookingtime >= SOMENUMBER && cookingTime <= SOMEOTHERNUMBER) {
        this.state = "perfect";
      }
      else {
        this.state = "overcooked";
      }
    }
  }
}

function preload() {
  // images all being loaded before they are used


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
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

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
    image(playButton, width/2, height/2*1.5, BUTTON_WIDTH, BUTTON_HEIGHT);
  }
  if (state === "tutorial"){
    background("blue");
  }
  if (state === "grill"){
    background(grillImg);
  }
  if (state === "assembly"){

  }
}

function mousePressed() {
  if (state === "start" && mouseX < width/2 + BUTTON_WIDTH/2 && mouseX > width/2 - BUTTON_WIDTH/2 && mouseY < height/2*1.5 + BUTTON_HEIGHT/2 && mouseY > height/2*1.5 - BUTTON_HEIGHT/2) {
    state = "tutorial";
  }
  if (state === "grill"){

  }
}

// Receipt in corner - can be brought out/pushed in

// Introductory Dialogue, background and gather player name/ tutorial that can be SKIPPED