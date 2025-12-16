// CS30 Major Project, Cooking Game
// Elaine King
// 11/19/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const GAME_WIDTH = 1900;
const GAME_HEIGHT  = 900;
const GRILL_WIDTH = 500;
const GRILL_HEIGHT = 500;

const NAV_HEIGHT = 80;
const NAV_BUTTONS = ["tutorial", "grill", "assembly", "register"];

const ASSEMBLY_ITEMS = [
  "bun top",
  "patty",
  "cheese",
  "pickle",
  "lettuce",
  "tomato",
  "bun botoom"
];

//Patience variables 
const MAX_PATIENCE = 100;
const BUTTON_WIDTH = 250;
const BUTTON_HEIGHT = 100;


const RAW_PATTY_X = 100;
const RAW_PATTY_Y = 300;
const HALF_TIME = 180;
const PERFECT_TIME = 360;
const BURNT_TIME = 540;

//background images, buttons and icons
let startImg;
let grillImg;

let playButton;
let tutorialButton;

// patties
let rawPatty, cookingPatty, perfectPatty, overcookedPatty;

// toppings
let pickle, cheese, tomato, onion, lettuce;

// sauces
let bbq, mustard, ketchup, mayo;

// sound effects
let click, backgroundMusic, sizzle, sauceSqueeze;


let isHovered = false;
let state = "grill";

// testing things
let grillSlots = [];
let unlockedSlots = 2;
let tutorialButtonPressed = true;

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
    this.onGrill = false;
    this.cookingTime = 0;
  }

  updatePatty() {
    if (this.onGrill) {
      this.cookingTime ++;   // set the constants
    }
    if (this.cookingTime <= HALF_TIME) {
      this.state = "raw";
    }
    else if (this.cookingTime <= PERFECT_TIME) {
      this.state = "half";
    }
    else if (this.cookingTime <= BURNT_TIME) {
      this.state = "perfect";
    }
    else {
      this.state = "overcooked";
    }


     
  }

  display() {
    //imageMode(CENTER);
    if (this.state === "raw"){
      image(rawPatty, this.x, this.y, this.size, this.size);
    }
    else if (this.state === "half") {
      image(cookingPatty, this.x, this.y, this.size, this.size);
    }
    else if (this.state === "perfect") {
      image(perfectPatty, this.x, this.y,this.size, this.size);
    }
    else if (this.state === "overcooked") {
      image(overcookedPatty, this.x, this.y, this.size, this.size);
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
  cookingPatty = loadImage("assets/cookingpatty.png");
  perfectPatty = loadImage("assets/perfectpatty.png");
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
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  setupGrillSlots();
  
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
    imageMode(CORNER);
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
    // will be trying to add a video here for the tutorial and then will also have a screen with just words explaining it in case the video does not load/other issues
    if (tutorialButtonPressed) {
      background("#E5DACA");
      displayText();
    }
    else {

    }
    //  If a single string is passed, as in '/assets/topsecret.mp4', a single video is loaded. 
    // An array of strings can be used to load the same video in different formats. 
    // ex, ['/assets/topsecret.mp4', '/assets/topsecret.ogv', '/assets/topsecret.webm'].
    //  This is useful for ensuring that the video can play across different browsers with different capabilities. 
  }
  if (state === "register") {
    background("green");

    fill(0);
    textSize(40);
    textAlign(CENTER);
    text("REGISTER", width / 2, 122);

    textSize(22);
    text("customer orders & money will go here", width / 2, 222);
  }
  if (state === "assembly"){
    fill("white");
    rect(600, 120, 400, 500, 20);

    fill(0);
    textSize(32);
    textAlign(CENTER);
    text("ASSEMBLY AREA", 800, 110);

    fill("#E5DACA");
    rect(100, 150, 200, 500, 20);

    textSize(22);
    fill(0);
    text("INGREDIENTS", 200, 110);

    for (let i = 0; i < ASSEMBLY_ITEMS.length; i++) {
      let y = 200 + i*45;

      fill("white");
      rect(150, y, 100, 30, 10);

      fill(0);
      textSize(18);
      textAlign(CENTER, CENTER);
      text(ASSEMBLY_ITEMS[i], 200, y + 15);
      textAlign(LEFT);
    }
    fill(150);
    textSize(18);
    text("burger builds here?", 800, 300);
  }
  if (state === "grill"){
    checkHover();
    fill("gray");
    rect(300, 150, GRILL_WIDTH, GRILL_HEIGHT, 20);
    
    image(rawPatty, RAW_PATTY_X, RAW_PATTY_Y, 100, 100);

    fill(0);
    textSize(16);
    textAlign(CENTER);
    text("RAW PATTY", RAW_PATTY_X + 50, RAW_PATTY_Y + 120);

    for (let slot of grillSlots) {
      if (slot.locked) {
        fill("#383737ff");
      } 
      else {
        fill("#636060ff");
      }

      rect(slot.x, slot.y, 120, 120, 15);

      if (slot.locked) {
        fill(255);
        textSize(14);
        textAlign(CENTER, CENTER);
        text("LOCKED", slot.x + 60, slot.y + 60);
      }

      if (slot.patty) {
        slot.patty.updatePatty();
        slot.patty.display();
      }

    }
  }
  drawNavBar();
}

function mousePressed() {
  if (state === "start" && isHovered) {
    click.play();
    state = "tutorial";
  }
  else if (state === "grill"){
    for (let slot of grillSlots) {
      if (isHovered) {
        if (!slot.locked && slot.patty === 0) {
          slot.patty = new Patty(slot.x + 10, slot.y + 10);
          slot.patty.onGrill = true;
        }
      }
    }
  }
  else if (state === "assembly") {
    
  }
  if (state !== "start") {
    if (mouseY > height - NAV_HEIGHT) {
      let index = floor(mouseX / (width / NAV_BUTTONS.length));
      state = NAV_BUTTONS[index];
    }
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
    if (mouseX > RAW_PATTY_X && mouseX < RAW_PATTY_X + 100 && mouseY > RAW_PATTY_Y && mouseY < RAW_PATTY_Y + 100) {
      isHovered = true;
    }
    else {
      isHovered = false;
    }
  }
  if (state === "assembly"){
  
  } 
}

function displayText() {
  if (state === "tutorial") {
    textSize(32);
    fill("#F69F95");
    //stroke("#FFE2A6");
    strokeWeight(4);
    text('tutorial!', GAME_WIDTH/2, BUTTON_HEIGHT);
    textAlign(CENTER);
    text("King's Burgeria", GAME_WIDTH/2, BUTTON_HEIGHT+50);
  }
}

function drawNavBar() {
  let buttonWidth = width / NAV_BUTTONS.length;

  for (let i = 0; i < NAV_BUTTONS.length; i++) {
    let x = i *buttonWidth;
    let y = height - NAV_HEIGHT;
    if (state === NAV_BUTTONS[i]){
      fill('#bae571');
    }
    else {
      fill('#6ec259');
    }
    rect(x, y, buttonWidth, NAV_HEIGHT);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24); //maybe toUpperCase()
    text(NAV_BUTTONS[i], x + buttonWidth / 2, y + NAV_HEIGHT / 2);
  }
  textAlign(LEFT);
}

function setupGrillSlots() {
  let startX = 330;
  let startY = 180;
  let spacing = 160;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      grillSlots.push({
        x: startX + col*spacing,
        y: startY + row*spacing,
        patty: 0,
        locked: grillSlots.length >= unlockedSlots
      });
    }
  }
}

// kills the window if they do something bad
function die() {
  sleep(1000);
  window.close();
}

// Receipt in corner - can be brought out/pushed in

// Introductory Dialogue, background and gather player name/ tutorial that can be SKIPPED