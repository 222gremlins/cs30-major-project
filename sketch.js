// CS30 Major Project, Cooking Game
// Elaine King
// 11/19/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


// look into setting textAlign or imagemode through setting it to something ex. textAlign = ...

const GAME_WIDTH = 1900;
const GAME_HEIGHT  = 900;
const GRILL_WIDTH = 750;
const GRILL_HEIGHT = 575;
const GRILL_X = 550;
const GRILL_Y = 200;
const SLOT_SIZE = 120;


const NAV_HEIGHT = 80;
const NAV_BUTTONS = ["produce", "grill", "assembly", "register"];

const ASEMBLY_X = 345;
const ASSEMBLY_START_Y = 100;
const ITEM_SIZE = 90;
const ITEM_PADDING = 20;

const ASSEMBLY_ITEMS = [
  "bun top",
  "patty",
  "cheese",
  "pickle",
  "lettuce",
  "tomato",
  "bun bottom"
];

const CUSTOMERS = [
  "monkey",
  "son",
  "cinema",
  "tim",
  "john"
];

//Patience variables 
const MAX_PATIENCE = 100;
const BUTTON_WIDTH = 250;
const BUTTON_HEIGHT = 100;

let currentCustomer;

const RAW_PATTY_X = 295;
const RAW_PATTY_Y = 560;
const RAW_PATTY_SIZE = 100;
const HALF_TIME = 150;
const PERFECT_TIME = 300;
const BURNT_TIME = 500;

//background images, buttons and icons
let startImg;
let grillImg;
let assemblyImg;

let playButton;
let tutorialButton;

// patties
let rawPatty, cookingPatty, perfectPatty, overcookedPatty;
let rawPatties = 0;
let halfPatties = 0;
let perfectPatties = 0;
let burntPatties = 0;
let totalPatties = rawPatties + halfPatties + perfectPatties + burntPatties;

// toppings
let pickle, cheese, tomato, onion, lettuce;
let pickleStock = 0;
let cheeseStock = 0;
let tomatoStock = 0;
let lettuceStock = 0;
let onionStock = 0;

// sauces
let bbq, mustard, ketchup, mayo;
let bbqSquirt, mustardSquirt, ketchupSquirt, mayoSquirt;

// sound effects
let click, backgroundMusic, sizzle, sauceSqueeze;

let isHovered = false;
let heldItem = 0; //null if no item is held

// game state variable
let state = "grill";

// testing things
let grillSlots = [];
let burgerStack = [];
let unlockedSlots = 2;
let tutorialButtonPressed = true;
let income;

class Customer {
  constructor() {
    this.order = this.generateOrder();
    this.patience = MAX_PATIENCE;
    
  }
  update() {
    this.patience--;
  }

  isAngry() {
    return this.patience <= 0;
  }
  generateOrder() {
    let base = ["bun bottom", "patty", "bun top"];
    let extras = ["cheese", "lettuce", "tomato", "pickle", "onion", "mayo", "ketchup", "mustard"];
  }
  display() {
    fill(255);
    rect(50, 150, 260, 300, 20);
    fill(0);
    textSize(18);
    text("ORDER:", 70, 190);

    for (let i = 0; i < this.order.length; i++) {
      text("- " + this.order[i], 70, 220 + i * 30);
    }

    text("custmer patience: " + this.patience, 70, 350);
  }
}

// either make this class an extention or maybe not depending on how it all goes
class Patty {
  constructor(slot) {
    // setting size/location
    this.size = SLOT_SIZE * 0.8;
    this.x = slot.x + SLOT_SIZE/2 - this.size/2;
    this.y = slot.y + SLOT_SIZE/2 - this.size/2;

    // setting beginning state and cooking variables
    this.state = "raw";
    this.onGrill = true;
    this.cookingTime = 0;
  }

  updatePatty() {
    if (this.onGrill) {
      this.cookingTime ++;   // set the constants
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
    
    console.log(this.state);
  }

  display() {
    imageMode(CORNER);
    if (this.state === "raw"){
      image(rawPatty, this.x, this.y, this.size, this.size);
    }
    if (this.state === "half") {
      image(cookingPatty, this.x, this.y, this.size, this.size);
    }
    if (this.state === "perfect") {
      image(perfectPatty, this.x, this.y,this.size, this.size);
    }
    if (this.state === "overcooked") {
      image(overcookedPatty, this.x, this.y, this.size, this.size);
    }
  }
  isHovered() {
    return mouseHover(this.x, this.y, this.size, this.size);
  }
}

function preload() {
  // images/sounds all being loaded before they are used

  // background images, icons and buttons
  startImg = loadImage("assets/intro.png");
  grillImg = loadImage("assets/grillbackground.png");
  playButton = loadImage("assets/playbutton.png");
  assemblyImg = loadImage("assets/assemblybackground.png");

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
  currentCustomer = new Customer();
  
}
function draw() {
  background(220);
  drawState();
  drawNavBar();
  
}

function drawState() {
  if (state === "start"){
    // displays the intro image and the play button
    imageMode(CENTER);
    image(startImg, GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT);
    imageMode(CORNER);
    checkHover();
    if (!isHovered) {
      imageMode(CENTER);
      image(playButton, GAME_WIDTH/2, GAME_HEIGHT/1.3, BUTTON_WIDTH, BUTTON_HEIGHT);
    }
    else {
      imageMode(CENTER);
      image(playButton, GAME_WIDTH/2, GAME_HEIGHT/1.3, BUTTON_WIDTH*1.5, BUTTON_HEIGHT*1.5);
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
    text("REGISTER", GAME_WIDTH/2, 100);

    currentCustomer.display();

    textSize(22);
    text("Click to submit burger here", GAME_WIDTH/2, 222);
  }
  if (state === "assembly"){
    background("black");
    imageMode(CENTER);
    image(assemblyImg, GAME_WIDTH/2, GAME_HEIGHT/2-50 , GAME_WIDTH*0.7, GAME_HEIGHT*0.8);
    setupAssembly();
    drawSauces();
    circle(966, 650, 5);
  }
  if (state === "grill"){
    imageMode(CORNER);
    image(grillImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    imageMode(CENTER);
    fill("gray");
    rect(GRILL_X, GRILL_Y, GRILL_WIDTH, GRILL_HEIGHT, 20);

    imageMode(CORNER);
    image(rawPatty, RAW_PATTY_X, RAW_PATTY_Y, 225, 120);
    imageMode(CENTER);

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
    fill("red");
    circle(1465, 700, 6);
    
    //not sure how to fix this 
    if (halfPatties > 0) {
      image(cookingPatty, 1465, 700, 225, 120);
    }
    else if (perfectPatties > 0) {
      image(perfectPatty, 1465, 700, 225, 120);
    }
    else {
      image(overcookedPatty, 1465, 700, 225, 120);
    }
  }
  if (state === "produce") {
    //trays
    fill("gray");
    rect(0, 0, GAME_WIDTH/4, GAME_HEIGHT);
    rect(GAME_WIDTH/4, 0, GAME_WIDTH/4, GAME_HEIGHT);
    rect(GAME_WIDTH/2, 0, GAME_WIDTH/4, GAME_HEIGHT);
    rect(GAME_WIDTH-GAME_WIDTH/4, 0, GAME_WIDTH/4, GAME_HEIGHT);
    // at top of tray/buckets
    fill("white");
    rect(20, 20, GAME_WIDTH/4-40, GAME_HEIGHT/2-40);
    rect(GAME_WIDTH/4+20, 20, GAME_WIDTH/4-40, GAME_HEIGHT/2-4-40);
    rect(GAME_WIDTH/2+20, 20, GAME_WIDTH/4-40, GAME_HEIGHT/2-40);
    rect(GAME_WIDTH-GAME_WIDTH/4+20, 0+20, GAME_WIDTH/4-40, GAME_HEIGHT/2-40);
  }
}

function drawAssemblyItem(img, x, y, stock) {
  fill(255);
  rect(x - 10, y - 10, ITEM_SIZE + 20, ITEM_SIZE + 20, 12);
  stock = str(stock);
  image(img, x, y, ITEM_SIZE, ITEM_SIZE);

  // stock label
  fill(0);
  textSize(18);
  textAlign(CENTER); 
  text(stock, x + ITEM_SIZE, y);
}

function drawSauces() {
  imageMode(CENTER);
  image(ketchup, 1215, 600, 100, 300);
  image(mustard, 1335, 600, 100, 300);
  image(mayo, 1445, 600, 100, 300);
  image(bbq, 1555, 600, 100, 300);
}

function mousePressed() {
  if (state === "start" && isHovered) {
    click.play();
    state = "tutorial";
  }
  if (state === "produce"){
    let producePicked;
    if (mouseHover(200, 200, 100, 100)) {
      producePicked = "lettuce";
      choppingProgress = 0;
    }
    if (mouseHover(350, 200, 100, 100)) {
      producePicked = "tomato";
      choppingProgress = 0;
    }
    if (producePicked){
      choppingProgress++;
      if (choppingProgress >= FINISH_CHOPPING){
        produceStock = producePicked + 1;
        producePicked = "";
        choppingProgress = 0;
      }
    }

  }

  if (state === "grill"){
    //puts patty onto grill
    if (mouseHover(RAW_PATTY_X, RAW_PATTY_Y, 225, 120)) {
      let slot = findEmptySlot();
      if (slot){
        slot.patty = new Patty(slot);
        click.play();
      }
    }
    // the slots
    for (let slot of grillSlots) {
      if(slot.patty && mouseHover(slot.x, slot.y, SLOT_SIZE, SLOT_SIZE)){
        if (slot.patty.state === "raw") {
          rawPatties++;
        }
        if (slot.patty.state === "half") {
          halfPatties++;
        }
        if (slot.patty.state === "perfect") {
          perfectPatties++;
        }
        if (slot.patty.state === "overcooked") {
          burntPatties++;
        }
        slot.patty = 0;
        click.play();
      }
    }
  }

  if (state === "assembly") {
    let item = "";
    let produceStock = 5;
    if (item === "lettuce" || item === "tomato" || item === "pickle" || item === "cheese") {
      if (produceStock <= 0) {
        textSize(24);
        fill("red");
        text("Out of " + item + "!", GAME_WIDTH/2, GAME_HEIGHT/2);
      }
      burgerStack.push(item);
    }
  }
  if (state !== "start") {
    if (mouseY > height - NAV_HEIGHT) {
      let index = floor(mouseX/(GAME_WIDTH/NAV_BUTTONS.length));
      state = NAV_BUTTONS[index];
    }
  }
  if (state === "register") {
    if (checkOrder(currentCustomer)) {
      currentCustomer = new Customer();
      burgerStack = [];
    }
  }
}



// checks if the mouse is hovering above buttons/items and gives back true/false
function checkHover() {
  if (state === "start"){
    if (mouseX < GAME_WIDTH/2 + BUTTON_WIDTH/2 && mouseX > GAME_WIDTH/2 - BUTTON_WIDTH/2 && mouseY < GAME_HEIGHT/2*1.5 + BUTTON_HEIGHT/2 && mouseY > GAME_HEIGHT/2*1.5 - BUTTON_HEIGHT/2) {
      isHovered = true;
    }
    else {
      isHovered = false;
    }
    // }
    // if (state === "tutorial"){

    // }
    // if (state === "grill"){
    //   if (mouseX > RAW_PATTY_X && mouseX < RAW_PATTY_X + 100 && mouseY > RAW_PATTY_Y && mouseY < RAW_PATTY_Y + 100) {
    //     isHovered = true;
    //   }
    //   else {
    //     isHovered = false;
    //   }
    // }
    // if (state === "assembly"){
    
  } 
}

function mouseHover(x, y, w, h) {
  return mouseX > x && mouseX < x + w &&
         mouseY > y && mouseY < y + h;
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
  if (state !== "start") {
    let buttonWidth = GAME_WIDTH / NAV_BUTTONS.length;
  
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
      textSize(24); 
      text(NAV_BUTTONS[i], x + buttonWidth/2, y + NAV_HEIGHT/2);
    }
    textAlign(LEFT);
  }
}

function setupAssembly() {
  let assemblyY = ASSEMBLY_START_Y;

  imageMode(CORNER);
  
  // // patty
  // drawAssemblyItem(perfectPatty, ASEMBLY_X, assemblyY, perfectPatties);
  // assemblyY += ITEM_SIZE + ITEM_PADDING;
  // drawAssemblyItem(patty, ASEMBLY_X, );
  // tomato
  drawAssemblyItem(tomato, ASEMBLY_X, assemblyY, tomatoStock);
  assemblyY += ITEM_SIZE + ITEM_PADDING;
  // lettuce
  drawAssemblyItem(lettuce, ASEMBLY_X, assemblyY, lettuceStock);
  assemblyY += ITEM_SIZE + ITEM_PADDING;
  // onion
  drawAssemblyItem(onion, ASEMBLY_X, assemblyY, onionStock);
  assemblyY += ITEM_SIZE + ITEM_PADDING; 
  // pickle
  drawAssemblyItem(pickle, ASEMBLY_X, assemblyY, pickleStock);
  assemblyY += ITEM_SIZE + ITEM_PADDING;
  // cheese
  drawAssemblyItem(cheese, ASEMBLY_X, assemblyY, cheeseStock);
  assemblyY += ITEM_SIZE + ITEM_PADDING;

  let x = 800;
  let y = 500;

  for (let item of burgerStack) {
    if (item === "patty") {
      image(perfectPatty, x - 50, y, 100, 40);
      y -= 35;
    }
  }
}

function setupGrillSlots() {
  grillSlots = [];
  let paddingX = (GRILL_WIDTH-SLOT_SIZE*3)/4;
  let paddingY = (GRILL_HEIGHT-SLOT_SIZE*3)/4;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let x = GRILL_X + paddingX + col * (SLOT_SIZE + paddingX);
      let y = GRILL_Y + paddingY + row * (SLOT_SIZE + paddingY);
      grillSlots.push({
        x: x,
        y: y,
        patty: 0,
        locked: grillSlots.length >= unlockedSlots
      });
    }
  }
}

function findEmptySlot() {
  for (let slot of grillSlots) {
    if (!slot.locked && slot.patty === 0) {
      return slot;
    }
  }
}

function addToBurger(item) {
  burgerStack.push(item);
}

function checkOrder(customer) {
  if (burgerStack.length !== customer.order.length) {
    return false;
  }
  for (let i = 0; i < burgerStack.length; i++) {
    if (burgerStack[i] !== customer.order[i]) {
      return false;
    } 
  }
  return true;
}

// kills the window if they do something bad
function die() {
  sleep(1000);
  window.close();
}

// Receipt in corner - can be brought out/pushed in

// Introductory Dialogue, background and gather player name/ tutorial that can be SKIPPEDFcl