// CS30 Major Project, Cooking Game
// Elaine King
// 11/19/2025
//
// Extra for Experts:
// I broke it down into systems which made it easier to manage and debug, I am proud of the logic behind everything even though the code looks "simple", I made it
// so when the sauce is dropped it lands exactly where the mouse is instead of snapping to a grid, I made a customer class that generates random orders and images,
// I also added sound effects and background music to make the game more immersive... not my best work to be honest but it works well enough!


//Game dimensions
const GAME_WIDTH = 1900;
const GAME_HEIGHT  = 900;

//grill constants
const GRILL_WIDTH = 750;
const GRILL_HEIGHT = 575;
const GRILL_X = 550;
const GRILL_Y = 200;
const SLOT_SIZE = 120;

//assembly constants
const UNDO_X = 1350;
const UNDO_Y = 100;
const UNDO_W = 200;
const UNDO_H = 60;
const ASEMBLY_X = 100;
const ASSEMBLY_START_Y = 100;
const ITEM_SIZE = 90;
const ITEM_PADDING = 20;

//navigation bar constants
const NAV_HEIGHT = 80;
const NAV_BUTTONS = ["produce", "grill", "assembly", "register"];

//patty cooking constants
const BUTTON_WIDTH = 250;
const BUTTON_HEIGHT = 100;

const RAW_PATTY_X = 295;
const RAW_PATTY_Y = 560;
const RAW_PATTY_SIZE = 100;
const HALF_TIME = 150;
const PERFECT_TIME = 300;
const BURNT_TIME = 500;

//assembly variables
const BURGER_X = 966;
const BURGER_Y = 700;
const LAYER_HEIGHT = 28;

// chopping variables
let producePicked = "";

//burger assembly arrays
let assemblyItems = [];
let burgerStack = [];

//grill slots
let grillUpgraded = false;
let grillSlots = [];
let unlockedSlots = 1;

//produce minigame variables
let chopTargets = [];
let inChopGame = false;
let chopItem = "";
let chopsNeeded = 0;

// sauces being dragged
let sauceBeingDragged = "";
let sauceX = 0;
let sauceY = 0;
let sauces = [];
let sauceLayers = [];

//money system/rating and appliance upgrades
// starting money
let money = 50; 
let slotCost = 25;
let grillSpeedLevel = 1;
let lastRating = "";
let lastPayout = 0;
let showFeedback = false;
let feedbackTimer = 0;

//produce variables
const PRODUCE_TRAYS = [
  { item: "lettuce", x: 20 },
  { item: "tomato",  x: GAME_WIDTH/4 + 20 },
  { item: "onion",   x: GAME_WIDTH/2 + 20 },
  { item: "pickle",  x: GAME_WIDTH - GAME_WIDTH/4 + 20 }
];

let lettuceChop, tomatoChop, onionChop, pickleChop;

//customers
let currentCustomer;
let customerImages = [];

//background images, buttons and icons
let startImg;
let grillImg;
let assemblyImg;
let cuttingBoardImg;
let speechImg;
let playButton;

// // patties
let rawPatty, cookingPatty, perfectPatty, overcookedPatty;
let rawPatties = 0;
let halfPatties = 0;
let perfectPatties = 0;
let burntPatties = 0;

// //buns
let bunBottom;
let bunTop;

// // toppings
let pickle, cheese, tomato, onion, lettuce;
let pickleStock = 0;
let tomatoStock = 0;
let lettuceStock = 0;
let onionStock = 0;
let cheeseStock;

// // sauces
let bbq, mustard, ketchup, mayo;

let thinkingMonkey, son;

// sound effects
let click, backgroundMusic, sizzle, sauceSqueeze;
let grillIsSizzling = false;

let isHovered = false; 

// game state variable
let state = "start";


//customer class
class Customer {
  constructor() {
    this.order = this.generateOrder();
    this.image = random(customerImages);
    this.dialogue = random(["I'd like a burger, please!", "Can I get a burger?", "Make me a burger!", "I'm hungry for a burger!", "Smells good! I'll have a burger!"]);
  }
  draw(x, y) {
    imageMode(CENTER);
    image(this.image, x, y, 300, 300);
    imageMode(CORNER);
  }
  generateOrder() {
    let order = [];

    let extras = ["cheese", "lettuce", "tomato", "pickle", "onion"];
    let sauces = ["ketchup", "mustard", "mayo", "bbq sauce"];

    order.push("bun bottom");

    let pattyCount = random(0, 2); 
    for (let i = 0; i < pattyCount; i++) {
      order.push("patty");
    }
    //creates a random topping/sauce count for the order
    let extraCount = floor(random(0, 4));
    //built in shuffle function from p5.js
    shuffle(extras, true);

    for (let i = 0; i < extraCount; i++) {
      order.push(extras[i]);
    }
    // 70% chance of sauce on the order
    if (random() < 0.7) {
      order.push(random(sauces));
    }

    order.push("bun top");
    return order;
  }
  
  display() {
    drawReceipt();
  }
}

// patty class
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
      this.cookingTime += grillSpeedLevel;   // set the constants
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
  cuttingBoardImg = loadImage("assets/cuttingboard.png");
  playButton = loadImage("assets/playbutton.png");
  assemblyImg = loadImage("assets/assemblybackground.png");
  speechImg = loadImage("assets/speech-bubble.png");
  
  //customers
  thinkingMonkey = loadImage("assets/thinkingmonkey.jpg");
  son = loadImage("assets/son.jpg");
  
  // patties
  rawPatty = loadImage("assets/rawpatty.png");
  cookingPatty = loadImage("assets/cookingpatty.png");
  perfectPatty = loadImage("assets/perfectpatty.png");
  overcookedPatty = loadImage("assets/overcookedpatty.png");
  
  //buns
  bunBottom = loadImage("assets/bunbottom.png");
  bunTop = loadImage("assets/buntop.png");

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
  
  // produce chop game images
  lettuceChop = loadImage("assets/lettucechop.jpg");
  tomatoChop = loadImage("assets/tomatochop.png");
  onionChop = loadImage("assets/onionchop.jpg");
  pickleChop = loadImage("assets/picklechop.jpg");

  // sound effects
  click = loadSound("assets/click.mp3");
  sizzle = loadSound("assets/sizzle.mp3");
  backgroundMusic = loadSound("assets/backgroundmusic.mp3");
  sauceSqueeze = loadSound("assets/saucesqueeze.mp3");
}

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  backgroundMusic.setLoop(true);
  backgroundMusic.play();
  setupGrillSlots();
  customerImages = [thinkingMonkey, son];
  currentCustomer = new Customer();
  sauces = [
  { name: "ketchup", img: ketchup, x: 1215, y: 600 },
  { name: "mustard", img: mustard, x: 1335, y: 600 },
  { name: "mayo", img: mayo, x: 1445, y: 600 },
  { name: "bbq sauce", img: bbq, x: 1555, y: 600 }
];
}
function draw() {
  background(220);
  drawState();
  drawNavBar();
  drawMoney();
}

//draws all of the states and holds what they do
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

  //register state
  if (state === "register") {

    // displays the register screen with the customer and submit button
    background("green");
    makeTextNice(0, CENTER, 40);
    text("REGISTER", GAME_WIDTH/2, 100);
    currentCustomer.display();
    fill("lightgreen");
    rect(1200, 720, 300, 80, 20);
    makeTextNice(255, CENTER, 28);
    text("SUBMIT BURGER", 1350, 760);

    // draws the customer and their dialogue
    currentCustomer.draw(GAME_WIDTH/2, GAME_HEIGHT/2);
    image(speechImg, GAME_WIDTH/2-300, GAME_HEIGHT/2-200, speechImg.width*0.5, speechImg.height*0.5);
    makeTextNice(0, CENTER, 20);
    text(
      currentCustomer.dialogue,
      GAME_WIDTH/2 - 270,
      GAME_HEIGHT/2 - 200,
      220,
      80
    );
    // shows feedback for the last burger submitted
    if (showFeedback) {
      fill(255, 240);
      rect(GAME_WIDTH/2 - 250, 150, 500, 140, 20);
      makeTextNice(0, CENTER, 28);
      text(lastRating, GAME_WIDTH/2, 200);
      makeTextNice("green", CENTER, 24);
      text("+ $" + lastPayout, GAME_WIDTH/2, 240);
      feedbackTimer--;
      if (feedbackTimer <= 0) {
        showFeedback = false;
      }
    }
  }

  //assembly state
  if (state === "assembly"){
    // displays the assembly screen with the items to build the burger
    assemblyItems = [];
    background("black");
    imageMode(CENTER);
    image(assemblyImg, GAME_WIDTH/2, GAME_HEIGHT/2-50 , GAME_WIDTH*0.7, GAME_HEIGHT*0.8);
    drawAssembly();
    drawSauces();
    circle(966, 650, 5);
    drawUndoButton();
  }

  //grill state
  if (state === "grill"){
    // displays the grill screen with the grill and patties
    imageMode(CORNER);
    image(grillImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    imageMode(CENTER);
    fill("gray");
    rect(GRILL_X, GRILL_Y, GRILL_WIDTH, GRILL_HEIGHT, 20);
    
    imageMode(CORNER);
    image(rawPatty, RAW_PATTY_X, RAW_PATTY_Y, 225, 120);
    imageMode(CENTER);
    
    // the slots
    for (let slot of grillSlots) {
      if (slot.locked) {
        fill("#383737ff");
      } 
      else {
        fill("#636060ff");
      }
      
      rect(slot.x, slot.y, 120, 120, 15);

      // buy slot text
      if (slot.locked) {
        fill(255);
        textSize(14);
        textAlign(CENTER, CENTER);
        text("Buy Slot for 25$", slot.x + 60, slot.y + 60);
      }
      
      if (slot.patty) {
        slot.patty.updatePatty();
        slot.patty.display();
      }
    }
    // upgrade cook speed button
    if (!grillUpgraded) {
      rect(1000, 100, 300, 80, 15);
      makeTextNice(0, CENTER, 22);
      text("Upgrade Cook Speed($50)", 1150, 130);
      fill("red");
    }

    // checks if any patties are on the grill to play sizzle sound
    let anyPatty = false;
    for (let slot of grillSlots) {
      if (slot.patty) {
        anyPatty = true;
    }
  }
  // stops sizzle sound if no patties are on grill
    if (!anyPatty && grillIsSizzling) {
      sizzle.stop();
      grillIsSizzling = false;
    }
  }

  //produce state
  if (state === "produce") {
    //trays
    fill("gray");
    for (let tray of PRODUCE_TRAYS) {
    fill("white");
    rect(tray.x, 20, GAME_WIDTH/4 - 40, GAME_HEIGHT/2 - 40, 20);

    // tray item text and image
    makeTextNice(0, CENTER, 28);
    text(tray.item.toUpperCase(), tray.x + (GAME_WIDTH/8) - 20, 60);
    let img = getProduceImage(tray.item);
    if (img) {
      imageMode(CENTER);
      image(
        img,
        tray.x + (GAME_WIDTH/8) - 20,
        GAME_HEIGHT/4 + 30,
        120,
        120
      );
      imageMode(CORNER);
    }
  }
    // chopping game
    if (inChopGame) {
      imageMode(CORNER);
      image(cuttingBoardImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
      fill(0);
      makeTextNice(0, CENTER, 32);
      text("Chop the " + chopItem + "!", GAME_WIDTH/2, 80);
      let img;
      if (chopItem === "lettuce") {
        img = lettuceChop;
      }
      else if (chopItem === "tomato") {
        img = tomatoChop;
      }   
      else if (chopItem === "onion") {
        img = onionChop;
      }
      else if (chopItem === "pickle") {
        img = pickleChop;
      }
      imageMode(CENTER);
      for (let target of chopTargets) {
       image(img, target.x, target.y, target.size, target.size);
      }   
    imageMode(CORNER);
    }
  }
}


function mousePressed() {
  if (state === "start" && isHovered) {
    click.play();
    state = "register";
  }
  if (state === "produce"){
    // clicking chop targets
    if (inChopGame) {
      for (let i = chopTargets.length - 1; i >= 0; i--) {
        let target = chopTargets[i];
        if (dist(mouseX, mouseY, target.x, target.y) < target.size / 2) {
          chopTargets.splice(i, 1);
          click.play();
        }
      }
      if (chopTargets.length === 0) {
        finishChopping();
      }
      return;
    }
    // clicking trays
    for (let tray of PRODUCE_TRAYS) {
      if (mouseHover(tray.x, 20, GAME_WIDTH/4 - 40, GAME_HEIGHT/2 - 40)) {
        chopItem = tray.item;
        producePicked = tray.item;
        inChopGame = true;
        spawnTargets();
        click.play();
      }
    }
  }
  
  if (state === "grill") {
    //puts patty onto grill
    if (mouseHover(RAW_PATTY_X, RAW_PATTY_Y, 225, 120)) {
      let slot = findEmptySlot();
      if (slot){
        slot.patty = new Patty(slot);
        click.play();
        if (!grillIsSizzling) {
          sizzle.loop();
          grillIsSizzling = true;
        }
      }
    }
  }
  for (let slot of grillSlots) {
    if (slot.locked && mouseHover(slot.x, slot.y, SLOT_SIZE, SLOT_SIZE) && state !== "start") {
      if (money >= slotCost) {
        money -= slotCost;
        slot.locked = false;
        unlockedSlots++;
        click.play();
      }
      return;
    }
    if (mouseHover(1000, 100, 300, 80)) {
      if (money >= 50) {
        money -= 50;
        grillSpeedLevel++;
        grillUpgraded = true;
        click.play();
      }
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
  
  if (state === "assembly") {
    for (let item of assemblyItems) {
      if (mouseHover(item.x, item.y, ITEM_SIZE, ITEM_SIZE)) {
        if (item.name === "bun bottom") {
          if (!burgerStack.includes("bun bottom")) {
            burgerStack.push("bun bottom");
            click.play();
          }
          return;
        }
        if (item.name === "bun top") {
          if (
            burgerStack.includes("bun bottom") && !burgerStack.includes("bun top")
          ) {
            burgerStack.push("bun top");
            click.play();
          }
          return;
        }
        if (item.name === "patty" && perfectPatties > 0) {
          burgerStack.push("patty");
          perfectPatties--;
          click.play();
          return;
        }
        if (item.name === "lettuce" && lettuceStock > 0) {
          burgerStack.push("lettuce");
          lettuceStock--;
          click.play();
          return;
        }
      if (item.name === "tomato" && tomatoStock > 0) {
        burgerStack.push("tomato");
        tomatoStock--;
        click.play();
        return;
      }
      if (item.name === "onion" && onionStock > 0) {
        burgerStack.push("onion");
        onionStock--;
        click.play();
        return;
      }
      if (item.name === "pickle" && pickleStock > 0) {
        burgerStack.push("pickle");
        pickleStock--;
        click.play();
        return;
      }
      if (item.name === "cheese") {
        burgerStack.push("cheese");
        click.play();
        return;
      }
    }
    //sauce bottles being clicked and dragged
    for (let sauce of sauces) {
      if (mouseX > sauce.x - 50 &&
        mouseX < sauce.x + 50 &&
        mouseY > sauce.y - 150 &&
        mouseY < sauce.y + 150){
          sauceBeingDragged = sauce;
          sauceX = mouseX;
          sauceY = mouseY;
          click.play();
        }
      }
      undoPressed();
    }
  }
  //stops the sizzle sound when navigating away from grill state
  if (state !== "start") {
    if (mouseY > height - NAV_HEIGHT) {
      let index = floor(mouseX/(GAME_WIDTH/NAV_BUTTONS.length));
      state = NAV_BUTTONS[index];
      if (state !== "grill" && grillIsSizzling) {
        sizzle.stop();
        grillIsSizzling = false;
      }
      if (state === "grill") {
        for (let slot of grillSlots) {
          if (slot.patty) {
            sizzle.loop();
            grillIsSizzling = true;
          }
        }
      }
    }
  }
  // submit burger button in register state and rates burger
  if (state === "register") {
    if (mouseHover(1200, 720, 300, 80)) {
      if (burgerStack.length === 0) {
        lastRating = "No burger submitted!";
        lastPayout = 0;
        
        showFeedback = true;
        feedbackTimer = 180;
        click.play();
        return;
      }
      let rating = rateBurger(currentCustomer, burgerStack);
      lastRating = rating.text + " (" + rating.stars + "★)";
      lastPayout = rating.stars * 10;
      
      money += lastPayout;
      showFeedback = true;
      feedbackTimer = 180; 
      
      burgerStack = [];
      sauceLayers = [];
      currentCustomer = new Customer();
      click.play();
    }
  }
}

function mouseDragged() {
  if (sauceBeingDragged) {
    sauceX = mouseX;
    sauceY = mouseY;
  }
}

function mouseReleased() {
  if (!sauceBeingDragged) return;
  // this makes the sauce land exactly where the mouse dropped it
  let distance = dist(mouseX, mouseY, BURGER_X, BURGER_Y);
  if (distance < 120) {
    sauceLayers.push({
      type: sauceBeingDragged.name,
      x: mouseX,
      y: mouseY
    });
    sauceSqueeze.play();
  }
  sauceBeingDragged = "";
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
  }
}

function mouseHover(x, y, w, h) {
  return mouseX > x && mouseX < x + w &&
  mouseY > y && mouseY < y + h;
}

//the main navigation bar at the bottom
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

// draws each assembly item with its stock
function drawAssembly() { 
  fill(0);
  rect(0,0, 530, GAME_HEIGHT)
  assemblyItems = [];
  const COLUMN_GAP = ITEM_SIZE + 40;
  const ITEMS_PER_COLUMN = 4;
  let x = ASEMBLY_X;
  let y = ASSEMBLY_START_Y;
  let count = 0;
  const ITEMS = [
    ["bun bottom", bunBottom],
    ["bun top", bunTop],
    ["patty", perfectPatty],
    ["lettuce", lettuce],
    ["tomato", tomato],
    ["onion", onion],
    ["pickle", pickle],
    ["cheese", cheese]
  ];
  for (let item of ITEMS) {
    assemblyItems.push({
      name: item[0],
      img: item[1],
      x,
      y
    });
    y += ITEM_SIZE + ITEM_PADDING;
    count++;
    if (count === ITEMS_PER_COLUMN) {
      count = 0;
      y = ASSEMBLY_START_Y;
      x += COLUMN_GAP;
    }
  }
  imageMode(CORNER);
  for (let item of assemblyItems) {
    drawAssemblyItem(item.img, item.x, item.y, getStock(item.name));
  }
  drawBurger();
}

// sets up the grill slots
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

// finds an empty slot on the grill
function findEmptySlot() {
  for (let slot of grillSlots) {
    if (!slot.locked && slot.patty === 0) {
      return slot;
    }
  }
}

// finishes the chopping minigame and adds the produce to stock
function finishChopping() {
  if (producePicked === "lettuce") {
    lettuceStock++;
  } 
  if (producePicked === "tomato") {
    tomatoStock++;
  }
  if (producePicked === "onion") {
    onionStock++;
  }
  if (producePicked === "pickle") {
    pickleStock++;
  }
  click.play();
  chopItem = "";
  inChopGame = false;
  chopTargets = [];
}

//draw undo buttons 
function drawUndoButton() {
  fill("red");
  rect(UNDO_X, UNDO_Y, UNDO_W, UNDO_H, 12);
  makeTextNice(0, CENTER, 22);
  text("UNDO", UNDO_X + UNDO_W/2, UNDO_Y + UNDO_H/2);
}

function undoPressed() {
  if (mouseHover(UNDO_X, UNDO_Y, UNDO_W, UNDO_H)) {
    if (burgerStack.length > 0) {
      let removedItem = burgerStack.pop();
      if (removedItem === "lettuce") {
        lettuceStock++;
      }
      else if (removedItem === "tomato") {
        tomatoStock++;
      }
      else if (removedItem === "onion") {
        onionStock++;
      }
      else if (removedItem === "pickle") {
        pickleStock++;
      }
      else if (removedItem === "patty") {
        perfectPatties++;
      }
    }
    sauceLayers.pop();
    click.play();
  }
}

// spawns chop targets in random locations
function spawnTargets() {
  chopTargets = [];
  for (let i = 0; i < 4; i++) {
    let targetX = random(200, GAME_WIDTH - 200);
    let targetY = random(180, GAME_HEIGHT - NAV_HEIGHT - 150);
    chopTargets.push({x: targetX, y: targetY, size: 80});
  }
}

// sets text properties
function makeTextNice(colour, alignment, size) {
  fill(colour);
  textAlign(alignment);
  textSize(size);
}

// draws the receipt in the register state
function drawReceipt() {
  fill(255);
  rect(GAME_WIDTH - 400, 150, 350, 500, 20);
  
  makeTextNice(0, LEFT, 20);
  text("RECEIPT", GAME_WIDTH - 360, 190);
  
  text("Order:", GAME_WIDTH - 360, 230);
  for (let i = 0; i < currentCustomer.order.length; i++) {
    text("- " + currentCustomer.order[i], GAME_WIDTH - 360, 260 + i * 22);
  }
  
  let y = 260 + currentCustomer.order.length * 22 + 20;
  text("Your Burger:", GAME_WIDTH - 360, y);
  
  for (let i = 0; i < burgerStack.length; i++) {
    text("- " + burgerStack[i], GAME_WIDTH - 360, y + 30 + i * 22);
  }
  let sauceY = y + 30 + burgerStack.length * 22;
  
  for (let sauce of sauceLayers) {
    text("- " + sauce.type, GAME_WIDTH - 360, sauceY);
    sauceY += 22;
  }
}

function drawMoney() {
  if (state !== "start") {
    fill(255);
    rect(GAME_WIDTH - 170, 10, 170, 70, 12);
    makeTextNice(0, RIGHT, 28);
    text("Money: $" + money, GAME_WIDTH - 20, 40);
  }
}

// gets the stock of each assembly item
function getStock(item) {
  if (item === "lettuce") {
    return lettuceStock;
  }
  if (item === "tomato") {
    return tomatoStock;
  }
  if (item === "onion") {
    return onionStock;
  }
  if (item === "pickle") {
    return pickleStock;
  }
  if (item === "cheese") {
    return "unlimited";
  }
  if (item === "patty") {
    return perfectPatties;
  }
  return "unlimited"; 
}

function getProduceImage(item) {
  if (item === "lettuce") {
    return lettuce;
  }
  if (item === "tomato") {
    return tomato;
  }
  if (item === "onion") {
    return onion;
  }
  if (item === "pickle") {
    return pickle;
  }
}

// draws the burger stack in assembly state
function drawBurger() {
  let y = BURGER_Y;
  imageMode(CENTER);
  // draws each item in the burger stack
  for (let item of burgerStack) {
    if (item === "bun bottom") {
      image(bunBottom, BURGER_X, y, 140, 60);
      y -= 35;
    }
    else if (item === "patty") {
      image(perfectPatty, BURGER_X, y, 140, 40);
      y -= LAYER_HEIGHT;
    }
    else if (item === "lettuce") {
      image(lettuce, BURGER_X, y, 140, 30);
      y -= LAYER_HEIGHT;
    }
    else if (item === "tomato") {
      image(tomato, BURGER_X, y, 140, 30);
      y -= LAYER_HEIGHT;
    }
    else if (item === "onion") {
      image(onion, BURGER_X, y, 140, 30);
      y -= LAYER_HEIGHT;
    }
    else if (item === "pickle") {
      image(pickle, BURGER_X, y, 140, 30);
      y -= LAYER_HEIGHT;
    }
    else if (item === "cheese") {
      image(cheese, BURGER_X, y, 140, 30);
      y -= LAYER_HEIGHT;
    }
    else if (item === "bun top") {
      image(bunTop, BURGER_X, y, 140, 60);
      y -= 35;
    }
  }
  // draws each sauce layer on top of the burger
  for (let sauce of sauceLayers) {
    noStroke();
    
    if (sauce.type === "ketchup") {
      fill(200, 0, 0, 180);
    }
    if (sauce.type === "mustard") {
      fill(230, 200, 40, 180);
    }
    if (sauce.type === "mayo") {
      fill(245, 245, 230, 180);
    }
    if (sauce.type === "bbq sauce") {
      fill(90, 40, 20, 180);
    }
    ellipse(sauce.x, sauce.y, 55, 14);
  }
  imageMode(CORNER);
}

// rates the burger based on accuracy
function rateBurger(customer, burger) {
  let correct = 0;
  
  for (let item of burger) {
    if (customer.order.includes(item)) {
      correct++;
    }
  }
  for (let sauce of sauceLayers) {
    if (customer.order.includes(sauce.type)) {
      correct++;
    }
  }
  
  let accuracy = correct / customer.order.length;
  
  if (accuracy === 1) {
    return { stars: 5, text: "Perfect!" };
  }
  if (accuracy >= 0.8) {
    return { stars: 4, text: "Great!" };
  }
  if (accuracy >= 0.6) {
    return { staSrs: 3, text: "Okay" };
  }
  if (accuracy >= 0.4) {
    return { stars: 2, text: "Meh…" };
  }
  return { stars: 1, text: "Terrible" };
}

// draws each assembly item with its stock badge
function drawAssemblyItem(img, x, y, stock) {
  fill(255);
  rect(x - 10, y - 10, ITEM_SIZE + 20, ITEM_SIZE + 20, 12);

  // item image
  image(img, x, y, ITEM_SIZE, ITEM_SIZE);

  // stock badge
  fill(0, 150);
  rect(x + ITEM_SIZE - 30, y + ITEM_SIZE - 30, 30, 30, 8);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(stock === "unlimited" ? "∞" : stock, x + ITEM_SIZE - 15, y + ITEM_SIZE - 15);

  textAlign(LEFT);
}

// draws the sauce bottles in assembly state
function drawSauces() {
  imageMode(CENTER);
  for (let sauce of sauces) {
    if (sauceBeingDragged !== sauce) {
      image(sauce.img, sauce.x, sauce.y, 100, 300);
    }
  }
  if (sauceBeingDragged) {
    image(sauceBeingDragged.img, sauceX, sauceY, 100, 300);
  }
  imageMode(CORNER);
}