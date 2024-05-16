// CURRENT OBJECTIVE:
// create the "strike zone"
// then make something happen when you press a button when an enemy is in the zone

// Board variables
let boardHeight = 600;
let boardWidth = 600;
let context;

// Player sprite variables
let spriteH = 50;
let spriteW = 30;
let spriteX = boardWidth/2;
let spriteY = boardHeight - spriteH;

let sprite = {
    h : spriteH,
    w : spriteW,
    x : spriteX,
    y : spriteY
}

//Enemy variables
let enemyArr = [];
let enemy1Width = 30;
let enemy1Height = 50;
let enemy1X = boardWidth/2;
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

window.onload = function(){
    // setup board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    
    context = board.getContext("2d");

    // Add the sprite
    context.fillStyle="green";
    context.fillRect(spriteX, spriteY, spriteW, spriteH);
    
    // setup the hitbox
    context.fillStyle = "rgba(135, 206, 250, 0.5)";
    context.fillRect(hitboxX, hitboxY, hitboxW, hitboxH);


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
    context.fillStyle="green";
    context.fillRect(spriteX, spriteY, spriteW, spriteH);

    //redraw hitbox
    context.fillStyle = "rgba(135, 206, 250, 0.5)";
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
        if(!inHitbox(currEnemy)){
            enemyArr.shift();
            misses += 1;
            continue;
        }
        currEnemy.y += 5;
        context.fillStyle="red";
        context.fillRect(currEnemy.x, currEnemy.y, currEnemy.w, currEnemy.h);
        
    }
    
}


function hitEnemy(){
    // get an array of the y coordinates of the enemies
    let coords = [];
    for(let i = 0; i < enemyArr.length; i++){
        coords.push(enemyArr[i].y);
    }

    // check if the first one is inside the hitbox
    if (coords[0] < spriteY && coords[0] > hitboxY){
        //console.log("HIT");
        coords.shift();
        enemyArr.shift();
        hits += 1;
    }
    else{
        //console.log("MISS");
        coords.shift();
        enemyArr.shift();
        misses += 1;
    }
}


function generateEnemy(){
    let enemy = {
        h : enemy1Height,
        w : enemy1Width,
        x : enemy1X,
        y : enemy1Y,
        img : null
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
