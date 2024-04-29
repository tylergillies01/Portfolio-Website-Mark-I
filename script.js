// Set up intial variables

// Canvas variables
let boardHeight = 300;
let boardWidth = 700;
let context; // this is going to be used to draw on the board

// Player Variables
let playerH = 48;
let playerW = 80;
let playerX = 50;
let playerY = boardHeight - playerH;

// Create struct for the sprite just to simplify things
let sprite = {
    x : playerX,
    y : playerY,
    width : playerW,
    height : playerH
}

//Now initialize the "enemies" or spikes
let spikeArr = [];

spike1Width = 32;
spike2Width = 64;
spike3Width = 96;

spikeHeight = 32;
spikeX = 600;
spikeY = boardHeight - spikeHeight;

// Now set  up the images of of spikes
let spike1Img;
let spike2Img;
let spike3Img;


// Now initialize the physics
let velocityX = -8;  // moving right to left
let velocityY = 0;  // currently grounded
let gravity = 0.4


let gameOver = false;
let score = 0;



// Now have a function for when the page loads
// this is going to initialize the window
window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // this will be used to draw on the board

    // context.fillStyle="red";
    // context.fillRect(sprite.x,sprite.y,sprite.width,sprite.height);

    // Add the Sprite
    spriteImg = new Image();
    spriteImg.src = "Assets/80x48Wolf_Run.gif";
    spriteImg.onload = function(){
        context.drawImage(spriteImg, sprite.x, sprite.y, sprite.width, sprite.height);
    }
    

    // Add the spikes
    spike1Img = new Image();
    spike2Img = new Image();
    spike3Img = new Image();
    spike1Img.src = "Assets/1spikes.png"
    spike2Img.src = "Assets/2spikes.png"
    spike3Img.src = "Assets/3spikes.png"


    requestAnimationFrame(updateScreen);
    setInterval(generateSpike, 1000);  // generate a new spike every second

}

// update the screeen every frame
function updateScreen(){
    requestAnimationFrame(updateScreen);

    //update the sprite
    context.drawImage(spriteImg, sprite.x, sprite.y, sprite.width, sprite.height);

    // update the spikes
    // need to loop through the array of spikes
    for (let i = 0; i < spikeArr.length; i++){
        let curr = spikeArr[i];
        context.drawImage(curr.img, curr.x, curr.y, curr.width, curr.height);
    }
}


function generateSpike(){
    // make a struct for spike
    spike = {
        img : null,
        x : spikeX,
        y : spikeY,
        width : null,
        height : spikeHeight
    }  // we dont know the image or the width yet

    let chance = Math.random();
    if (chance > 0.9){
        spike.img = spike3Img;
        spike.width = spike3Width;
        spikeArr.push(spike);
    }
    else if (chance > 0.7){
        spike.img = spike2Img;
        spike.width = spike2Width;
        spikeArr.push(spike);
    }
    else if (chance > 0.5){
        spike.img = spike1Img;
        spike.width = spike1Width;
        spikeArr.push(spike);
    }
}