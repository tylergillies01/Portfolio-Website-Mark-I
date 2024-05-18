// CURRENT OBJECTIVE:
// Change the event listener to only work when they press the correct key

// Board variables
let boardHeight = 600;
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
let enemy1Width = 50;
let enemy1Height = 60;
let enemy1X = boardWidth/2 - enemy1Width/2;
let enemy1Y = 0;

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


window.onload = function(){
    // setup board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    
    context = board.getContext("2d");

    // Add the sprite
    // context.fillStyle="green";
    // context.fillRect(spriteX, spriteY, spriteW, spriteH);
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
    leftImg.src = "Assets/left_arrow.png"

    rightImg = new Image();
    rightImg.src = "Assets/right_arrow.png"

    upImg = new Image();
    upImg.src = "Assets/up_arrow.png"

    downImg = new Image();
    downImg.src = "Assets/down_arrow.png"


    // event listener for hitting enemies
    document.addEventListener("keydown", hitEnemy);

    startGame();
}


function startGame(){

    requestID = requestAnimationFrame(updateScreen);
    intervalID = setInterval(generateEnemy, 1000);
}


function updateScreen(){
    requestID = requestAnimationFrame(updateScreen);

    
    // reset the canvas
    context.clearRect(0,0,board.width,board.height);

    // redraw sprite
    // context.fillStyle="green";
    // context.fillRect(spriteX, spriteY, spriteW, spriteH);
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
        //console.log(currEnemy.img);
        // check if the sprite is leaving the hitbox and should be removed
        if(!inHitbox(currEnemy)){
            enemyArr.shift();
            misses += 1;
            damageSprite();
            continue;
        }
        currEnemy.y += 3;
        //context.fillStyle="red";
        //context.fillRect(currEnemy.x, currEnemy.y, currEnemy.w, currEnemy.h);
        context.drawImage(currEnemy.img, currEnemy.x, currEnemy.y, currEnemy.w, currEnemy.h);
    }
    
}


function hitEnemy(e){
    // get an array of the y coordinates of the enemies
    // get an array of the directions for the enemies. this will be used to check if the correct key was pressed
    let coords = [];
    let arrowDirs = [];
    for(let i = 0; i < enemyArr.length; i++){
        coords.push(enemyArr[i].y);
        arrowDirs.push(enemyArr[i].direction);
    }

    if(e.key == "ArrowLeft"){
        sprite.img = leftImgPlayer;
        spriteImg.src = sprite.img;
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }
    else if(e.key == "ArrowRight"){
        sprite.img = rightImgPlayer;
        spriteImg.src = sprite.img;
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }
    else if(e.key == "ArrowUp"){
        sprite.img = upImgPlayer;
        spriteImg.src = sprite.img;
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }
    else if(e.key == "ArrowDown"){
        sprite.img = downImgPlayer;
        spriteImg.src = sprite.img;
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.w, sprite.h);
    }



    // check if the first one is inside the hitbox
    if (coords[0] < spriteY && coords[0] > hitboxY){
        // now check it was the correct key
        if(e.key == "ArrowLeft" && arrowDirs[0] == "left"){
            //console.log("HIT");
            hits += 1;
            greenhitbox();
        }
        else if(e.key == "ArrowRight" && arrowDirs[0] == "right"){
            hits += 1;
            greenhitbox();
        }
        else if(e.key == "ArrowUp" && arrowDirs[0] == "up"){
            hits += 1;
            greenhitbox();
        }
        else if(e.key == "ArrowDown" && arrowDirs[0] == "down"){
            hits += 1;
            greenhitbox();
        }
        else{
            // MISS
            misses += 1;
            damageSprite();
        }
        coords.shift();
        enemyArr.shift();
        
    }
    else{
        // MISS
        coords.shift();
        enemyArr.shift();
        misses += 1;
        damageSprite();
    }
}


function generateEnemy(){
    let enemy = {
        h : enemy1Height,
        w : enemy1Width,
        x : enemy1X,
        y : enemy1Y,
        img : null,
        direction: null
    }


    let randnum = Math.floor(Math.random() * 4) + 1;

    if(randnum == 1){
        enemy.img = leftImg;
        enemy.direction = "left";
    }
    else if (randnum == 2){
        enemy.img = rightImg;
        enemy.direction = "right";
    }
    else if (randnum == 3){
        enemy.img = upImg;
        enemy.direction = "up";
    }
    else if (randnum == 4){
        enemy.img = downImg;
        enemy.direction = "down";
    }
    
    enemyArr.push(enemy);

    if (enemyArr.length > 5){
        enemyArr.shift();
    }

    
}

// Checks whether an enemy is inside the board
// helper function
function inHitbox(currEnemy){
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
