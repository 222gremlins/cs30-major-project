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
    makeTextNice(0, CENTER, 40);
    text("REGISTER", GAME_WIDTH/2, 100);
    currentCustomer.display();
    fill("lightgreen");
    rect(1200, 720, 300, 80, 20);
    makeTextNice(255, CENTER, 28);
    text("SUBMIT BURGER", 1350, 760);
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
  if (state === "assembly"){
    assemblyItems = [];
    background("black");
    imageMode(CENTER);
    image(assemblyImg, GAME_WIDTH/2, GAME_HEIGHT/2-50 , GAME_WIDTH*0.7, GAME_HEIGHT*0.8);
    drawAssembly();
    drawSauces();
    circle(966, 650, 5);
    drawUndoButton();
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
        text("Buy Slot for 25$", slot.x + 60, slot.y + 60);
      }
      
      if (slot.patty) {
        slot.patty.updatePatty();
        slot.patty.display();
      }
    }
    if (!grillUpgraded) {
      rect(1000, 100, 300, 80, 15);
      makeTextNice(0, CENTER, 22);
      text("Upgrade Cook Speed($50)", 1150, 130);
      fill("red");
    }
    let anyPatty = false;
    for (let slot of grillSlots) {
      if (slot.patty) {
        anyPatty = true;
    }
  }
    if (!anyPatty && grillIsSizzling) {
      sizzle.stop();
      grillIsSizzling = false;
    }
  }
  if (state === "produce") {
    //trays
    fill("gray");
    for (let tray of PRODUCE_TRAYS) {
    fill("white");
    rect(tray.x, 20, GAME_WIDTH/4 - 40, GAME_HEIGHT/2 - 40, 20);

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