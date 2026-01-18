
const ASEMBLY_X = 100;
const ASSEMBLY_START_Y = 100;
const ITEM_SIZE = 90;
const ITEM_PADDING = 20;

//assembly variables
const BURGER_X = 966;
const BURGER_Y = 700;
const LAYER_HEIGHT = 28;

// patties
let rawPatty, cookingPatty, perfectPatty, overcookedPatty;
let rawPatties = 0;
let halfPatties = 0;
let perfectPatties = 0;
let burntPatties = 0;

let sauces = [];
let sauceLayers = [];

let burgerStack = [];

// sauces being dragged
let sauceBeingDragged = "";
let sauceX = 0;
let sauceY = 0;

let assemblyItems = [];

//buns
let bunBottom;
let bunTop;

// toppings
let pickle, cheese, tomato, onion, lettuce;
let pickleStock = 0;
let tomatoStock = 0;
let lettuceStock = 0;
let onionStock = 0;
let cheeseStock;

// sauces
let bbq, mustard, ketchup, mayo;
let bbqSquirt, mustardSquirt, ketchupSquirt, mayoSquirt;

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


//draw undo button 
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

function drawBurger() {
  let y = BURGER_Y;
  imageMode(CENTER);

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