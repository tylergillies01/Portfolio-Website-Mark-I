// CURRENT OBJECTIVE:
// PROBLEM: if they just press all arrows at once it counts, need to make it so only the correct one works
// add backgrounds and effects
// score and score multipliers (ie combos and streaks)
// 

// Board variables
let boardHeight = 800;
let boardWidth = 600;
let context;

// Player sprite variables
let spriteH = 130;
let spriteW = 270;
let spriteX = boardWidth/2 - spriteW/2;
let spriteY = boardHeight - spriteH;

let idleImgPlayer = "Assets/wiz_idle.png"
let leftImgPlayer = "Assets/wiz_left_v2.png"
let rightImgPlayer = "Assets/wiz_right_v2.png"
let upImgPlayer = "Assets/wiz_up_v2.png"
let downImgPlayer = "Assets/wiz_down_v2.png"

let sprite = {
    h : spriteH,
    w : spriteW,
    x : spriteX,
    y : spriteY,
    img: idleImgPlayer
}


//Enemy variables
let enemyArr = [];
let enemy1Width = 84;
let enemy1Height = 81;
let enemy2Width = 168;
let enemy2Height = 81;
let enemyX = boardWidth/2 - enemy1Width/2;
let enemyY = 0;

let enemySpeed = 3;

// Hit zone variables
let hitboxH = 150;
let hitboxW = boardWidth;
let hitboxX = 0;
let hitboxY = spriteY - hitboxH;


// Score variables
let score = 0;
let hits = 0;
let misses = 0;

let requestID;
let intervalID;



//this varibale is used to track if you were just hit
// this fixes the problem of the hitbox not reacting well when you take damage
let currentlyDamaged = false;
// this one is the same but for mkaing the hitbox green on a good hit
let goodHit = false;


// tracks how long the game has gone in order to adjust difficulty
let timePlayed = 0;

let gameOver = false;

// tracks the currently pressed keys to check simultaneous presses
const keysPressed = {};
let checkTimeout;  // this fixes a problem with the multi presses not working

window.onload = function(){
    // setup board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    
    context = board.getContext("2d");

    // Add the sprite
    spriteImg = new Image();
    spriteImg.src = sprite.img;
    spriteImg.onload = function(){
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }


    // setup the hitbox
    context.fillStyle = "rgba(135, 206, 250, 0.5)";
    context.fillRect(hitboxX, hitboxY, hitboxW, hitboxH);

    // setup enemies
    leftImg = new Image();
    leftImg.src = "Assets/left_arrow_v2.png"

    rightImg = new Image();
    rightImg.src = "Assets/right_arrow_v2.png"

    upImg = new Image();
    upImg.src = "Assets/up_arrow_v2.png"

    downImg = new Image();
    downImg.src = "Assets/down_arrow_v2.png"

    leftdownImg = new Image();
    leftdownImg.src = "Assets/Multi-Arrows/leftdown_arrow.png"
    leftrightImg = new Image();
    leftrightImg.src = "Assets/Multi-Arrows/leftright_arrow.png"
    leftupImg = new Image();
    leftupImg.src = "Assets/Multi-Arrows/leftup_arrow.png"
    downrightImg = new Image();
    downrightImg.src = "Assets/Multi-Arrows/downright_arrow.png"
    rightupImg = new Image();
    rightupImg.src = "Assets/Multi-Arrows/rightup_arrow.png"
    updownImg = new Image();
    updownImg.src = "Assets/Multi-Arrows/updown_arrow.png"


    // event listener for hitting enemies
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    
        // Clear previous timeout if any
        if (checkTimeout) clearTimeout(checkTimeout);
    
        // Set a small delay to ensure all key presses are registered
        checkTimeout = setTimeout(hitEnemy, 20);
    });

    // Event listener for keyup event
    document.addEventListener('keyup', (event) => {
        // Set the key as no longer pressed in the keysPressed object
        keysPressed[event.key] = false;
    });

    startGame();
}


function startGame(){

    requestID = requestAnimationFrame(updateScreen);
    intervalID = setInterval(generateEnemy, 1000);

    // counts the time to adjust difficulty
    setInterval(countTime, 1000);
}


function updateScreen(){
    requestID = requestAnimationFrame(updateScreen);

    // reset the canvas
    context.clearRect(0,0,board.width,board.height);

    // redraw sprite
    context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);

    //redraw hitbox
    if(currentlyDamaged){
        context.fillStyle = "rgba(200, 50, 50, 0.5)"
    }
    else if(goodHit){
        greenhitbox();
    }
    else{
        context.fillStyle = "rgba(135, 206, 250, 0.5)";
    }
    context.fillRect(hitboxX, hitboxY, hitboxW, hitboxH);
    
    // show the score
    context.fillStyle = "black";
    context.font = "bold 20px Arial";
    context.textAlign = "left";
    context.textBaseline = 'middle';
    context.fillText("Hits: " + hits, 20, 20);
    context.fillText("Misses: " + misses, 20, 40);


    for (let i = 0; i < enemyArr.length; i++){
        let currEnemy = enemyArr[i];
        
        // check if the sprite is leaving the hitbox and should be removed
        if(!inBoard(currEnemy)){
            enemyArr.shift();
            misses += 1;
            damageSprite();
            continue;
        }
        
        currEnemy.y += enemySpeed;
        
        context.drawImage(currEnemy.img, currEnemy.x, currEnemy.y, currEnemy.w, currEnemy.h);
    }
    
}


function hitEnemy(e){
    if(keysPressed["ArrowLeft"]){
        sprite.img = leftImgPlayer;
        spriteImg.src = sprite.img;
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }
    else if(keysPressed["ArrowRight"]){
        sprite.img = rightImgPlayer;
        spriteImg.src = sprite.img;
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }
    else if(keysPressed["ArrowUp"]){
        sprite.img = upImgPlayer;
        spriteImg.src = sprite.img;
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }
    else if(keysPressed["ArrowDown"]){
        sprite.img = downImgPlayer;
        spriteImg.src = sprite.img;
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }



    // check if the first one is inside the hitbox
    firstEnemy = enemyArr[0];

    if (firstEnemy.y < spriteY && firstEnemy.y + firstEnemy.h > hitboxY) {
        // Debugging
        console.log('1) keysPressed:', keysPressed);
        console.log('2) firstEnemy.direction:', firstEnemy.direction);

        // Check the key and direction
        if (isCorrectKey("ArrowLeft") && firstEnemy.direction == "left") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowRight") && firstEnemy.direction == "right") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowUp") && firstEnemy.direction == "up") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowDown") && firstEnemy.direction == "down") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowDown", "ArrowRight") && firstEnemy.direction == "downright") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowLeft", "ArrowDown") && firstEnemy.direction == "leftdown") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowLeft", "ArrowRight") && firstEnemy.direction == "leftright") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowLeft", "ArrowUp") && firstEnemy.direction == "leftup") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowRight", "ArrowUp") && firstEnemy.direction == "rightup") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else if (isCorrectKey("ArrowUp", "ArrowDown") && firstEnemy.direction == "updown") {
            hits += 1;
            greenhitbox();
            playCoinSound();
        } else {
            // MISS
            misses += 1;
            damageSprite();
        }

        enemyArr.shift();
    }
}



function generateEnemy(){
    
    let randnum = Math.floor(Math.random() * 14) + 1;

    let enemy = {
        h : enemy1Height,
        w : enemy1Width,
        x : enemyX,
        y : enemyY,
        img : null,
        direction: null
    }

    if(randnum >= 9){
        enemy.h = enemy2Height
        enemy.w = enemy2Width
        enemy.x = boardWidth/2 - enemy.w/2;

    }

    switch (randnum) {
        case (1):
        case (2):
            enemy.img = leftImg;
            enemy.direction = "left";
            break;
        case (3):
        case (4):
            enemy.img = rightImg;
            enemy.direction = "right";
            break;
        case (5):
        case (6):
            enemy.img = upImg;
            enemy.direction = "up";
            break;
        case (7):
        case (8):
            enemy.img = downImg;
            enemy.direction = "down";
            break;
        case (9):
            enemy.img = leftdownImg;
            enemy.direction = "leftdown";
            break;
        case (10):
            enemy.img = leftrightImg;
            enemy.direction = "leftright";
            break;
        case (11):
            enemy.img = leftupImg;
            enemy.direction = "leftup";
            break;
        case (12):
            enemy.img = downrightImg;
            enemy.direction = "downright";
            break;
        case (13):
            enemy.img = rightupImg;
            enemy.direction = "rightup";
            break;
        case (14):
            enemy.img = updownImg;
            enemy.direction = "updown";
            break;
    }

    enemyArr.push(enemy);

    if (enemyArr.length > 5){
        enemyArr.shift();
    }

    
}

// Checks whether an enemy is inside the board
// helper function
function inBoard(currEnemy){
    if(currEnemy.y < hitboxY + hitboxH){
        return true;
    }
    else{
        return false;
    }
}

// helper function for when player misses and takes damage
// will check what the current sprite is and set the inverted version
function damageSprite(){
    if(sprite.img == leftImgPlayer){
        spriteImg.src = "Assets/wiz_left_hit.png";
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
        setTimeout(() => {
            spriteImg.src = sprite.img;
        }, 300);
    }
    else if(sprite.img == rightImgPlayer){
        spriteImg.src = "Assets/wiz_right_hit.png";
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
        setTimeout(() => {
            spriteImg.src = sprite.img;
        }, 300);
    }
    else if(sprite.img == upImgPlayer){
        spriteImg.src = "Assets/wiz_up_hit.png";
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
        setTimeout(() => {
            spriteImg.src = sprite.img;
        }, 300);
    }
    else if(sprite.img == downImgPlayer){
        spriteImg.src = "Assets/wiz_down_hit.png";
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
        setTimeout(() => {
            spriteImg.src = sprite.img;
        }, 300);
    }

    //redraw hitbox
    currentlyDamaged = true;
    context.fillStyle = "rgba(200, 50, 50, 0.5)"
    context.fillRect(hitboxX, hitboxY, hitboxW, hitboxH);
    setTimeout(() => {
        currentlyDamaged = false;
    }, 300);
    

    playHitSound();
}


// helper function to make the hitbox go gree nto react to successful hits
function greenhitbox(){
    goodHit = true;

    context.fillStyle = "rgba(144, 238, 144, 0.5)"
    context.fillRect(hitboxX, hitboxY, hitboxW, hitboxH);
    setTimeout(() => {
        goodHit = false;
    }, 200);
}


// helper function to track the time elapsed since starting the game
function countTime(){
    timePlayed+=1;

    // adjust difficulty based on time played
    setDifficulty();
}


// helper function to adjust the difficulty/speed of the arrows based on the time elapsed 
function setDifficulty(){
    if(timePlayed % 10 == 0){
        enemySpeed += 0.3;
    }
    
}

// helper function to ensure only certain keys are pressd and no others
// pass it the key you want it to be and it will check if that or those 2 are the only keys being pressed
function isCorrectKey(key1, key2=null){
    let key1Pressed = false;
    let key2Pressed = false;
    if(key2 == null){  //checking for single key
        for(let i in keysPressed){
            if(i !== key1 && keysPressed[i]){
                return false;
            }
        }
        return keysPressed[key1] === true;
    }
    else{ // checking for 2 keys
        for(let i in keysPressed){
            if (i === key1 && keysPressed[i]) {
                key1Pressed = true;
            } else if (i === key2 && keysPressed[i]) {
                key2Pressed = true;
            } else if (keysPressed[i]) {
                // Another key is pressed, so return false
                return false;
            }
        }
        return key1Pressed && key2Pressed;
    }
}




function playCoinSound(){
    if (!gameOver){
        var music = document.getElementById("coinSound");
        music.volume = 0.2;
        // this makes it reset each time
        music.currentTime = 0;
        music.play();
    }
    
}

function playHitSound(){
    if (!gameOver){
        var music = document.getElementById("hitSound");
        music.volume = 0.2;
        // this makes it reset each time
        music.currentTime = 0;
        music.play();
    }
    
}


