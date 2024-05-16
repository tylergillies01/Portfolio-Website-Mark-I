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
let hitboxH = 200;
let hitboxW = boardWidth;
let hitboxX = 0;
let hitboxY = spriteY - hitboxH;


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
    
    for (let i = 0; i < enemyArr.length; i++){
        let currEnemy = enemyArr[i];
        currEnemy.y += 5;
        context.fillStyle="red";
        context.fillRect(currEnemy.x, currEnemy.y, currEnemy.w, currEnemy.h);

        //console.log(enemyArr.length);

        
    }
    
    // for (let i = 0; i < enemyArr.length; i++){
    //     let currEnemy = enemyArr[i];
    //     console.log("!!!!!" + currEnemy.y)
    // }
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
