// TODO:
// need to fix the sprite size in the front


// Set up intial variables

// Canvas variables
let boardHeight = 256;
let boardWidth = 700;
let context; // this is going to be used to draw on the board

// Player Variables
let playerH = 26;
let playerW = 43;
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
spikeX = 700;
spikeY = boardHeight - spikeHeight;

// Now set  up the images of of spikes
let spike1Img;
let spike2Img;
let spike3Img;


// Now initialize the physics
let velocityX = -4;  // moving right to left
let velocityY = 0;  // currently grounded
let gravity = 0.2


let gameOver = false;
let score = 0;

// These will fix the problem of the game speeding up on repeated playthroughs
// without clearing the interval and canceling the animationrequests between games, they will start running concurrently, thus getting faster
// particularly the animationframes
let intervalID;
let requestID;

let checkbox;

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
    spriteImg.src = "Assets/wolf_run.png";
    
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

    // initialize the Play button and add an event listener to start the game
    let playButton = document.getElementById("playButton");
    playButton.addEventListener("click", function(){
        clearInterval(intervalID);
        playButton.style.display = "none";
        startGame();
    });

    // initialize the sound checkbox
    checkbox = document.getElementById("isSound");
    
}

// Main function for the game
function startGame(){
    // reset game variables
    gameOver = false;
    score = 0;
    spikeArr = [];
    
    // start the animation and spike generation
    requestID = requestAnimationFrame(updateScreen);
    intervalID = setInterval(generateSpike, 1300);  // generate a new spike every second

    // event listener for jumping
    document.addEventListener("keydown", spriteJump);


    //SOUNDS
    // start music
    playMusic();
    

    // Event listener to pause the music when the tab loses focus
    document.addEventListener("visibilitychange", pauseMusicOnBlur);

    // Event listener for changing the sound checkbox
    checkbox.addEventListener("change", playMusic);

    //this one fixes the problem of after pressing the box, the space key can no longer toggle it 
    checkbox.addEventListener("keydown", function(event) {
        if (event.key === " ") {
            event.preventDefault();
        }
    });
}


// update the screeen every frame
function updateScreen(){
    requestID = requestAnimationFrame(updateScreen);
    
    if (gameOver){
        playButton.style.display = "block";
        return;
    }

    // reset the canvas
    context.clearRect(0,0,board.width,board.height);


    // display the score to the screen
    context.fillStyle = "black";
    context.font = "bold 20px Arial";
    context.textAlign = "left";
    context.textBaseline = 'middle';
    context.fillText(score, 20, 20);
    // add to the score
    score += 1;

    //update the sprite
    velocityY += gravity;
    sprite.y = Math.min(sprite.y + velocityY, playerY);  // apply gravity but make sure we dont go past the ground


    // check whether the sprite is in the air
    // if it is, change to the jump animation, if not, run animation
    if (sprite.y == playerY && gameOver == false){
        spriteImg.src = "Assets/wolf_run.png";
    }
    else if (sprite.y != playerY && gameOver == false){
        spriteImg.src = "Assets/wolf_jump.png";
    }
    context.drawImage(spriteImg, sprite.x, sprite.y, sprite.width, sprite.height);


    // update the spikes
    // need to loop through the array of spikes
    for (let i = 0; i < spikeArr.length; i++){
        let curr = spikeArr[i];
        curr.x += velocityX;
        context.drawImage(curr.img, curr.x, curr.y, curr.width, curr.height);
        
        // now detect collison
        if (detectCollision(sprite, curr)){
            gameOver = true;
            playButton.style.display = "block";

            clearInterval(intervalID);
            window.cancelAnimationFrame(requestID);

            // change the sprite to dead by clearing current and reseting
            context.clearRect(sprite.x, sprite.y, sprite.width, sprite.height);
            spriteImg.src = "Assets/wolf_dead.png";
            
            context.drawImage(spriteImg, sprite.x, sprite.y, sprite.width, sprite.height);
            
            pauseMusic();
        }
    }
}   


function spriteJump(e){
    if (gameOver){
        return;
    }  // so that it stops when the game has ended
    
    // need to listen for key events
    if (e.code == "Space" && sprite.y == playerY){
        // Play the jump sound only if we are currently on the ground
        if (sprite.y == playerY){
            playJumpSound();
        }

        velocityY = -6;
    }
}


function generateSpike(){
    if (gameOver){
        return;
    }  // so that it stops when the game has ended


    // make a struct for spike
    spike = {
        img : null,
        x : spikeX,
        y : spikeY,
        width : null,
        height : spikeHeight
    }  // we dont know the image or the width yet

    let chance = Math.random();
    if (chance > 0.8){
        spike.img = spike3Img;
        spike.width = spike3Width;
        spikeArr.push(spike);
    }
    else if (chance > 0.6){
        spike.img = spike2Img;
        spike.width = spike2Width;
        spikeArr.push(spike);
    }
    else if (chance > 0.25){
        spike.img = spike1Img;
        spike.width = spike1Width;
        spikeArr.push(spike);
    }


    // need to clean out the array of cactuses so we dont use too much memory
    if (spikeArr.length > 7){
        spikeArr.shift();
    }
}


function detectCollision(a, b){
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}



// MUSIC
function pauseMusic() {
    var music = document.getElementById("backgroundMusic");
    music.pause();
}

// Play the music
function playMusic() {
    if (!checkbox.checked && !gameOver){
        var music = document.getElementById("backgroundMusic");
        music.volume = 0.6;
        music.play();
    }
    else{
        pauseMusic();
    }
    
}


function playJumpSound(){
    if (!checkbox.checked && !gameOver){
        var music = document.getElementById("jumpSound");
        music.volume = 0.2;
        // this makes it reset each time
        music.currentTime = 0;
        music.play();
    }
    
}

// Function to pause the music when the tab is not visible
function pauseMusicOnBlur() {
    if (document.hidden) {
        pauseMusic();
    }
    else{
        if (!gameOver){
            playMusic();
        }
        
    }
}

