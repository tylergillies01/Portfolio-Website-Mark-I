// Set up intial variables

// Canvas variables
let boardHeight = 500;
let boardWidth = 700;

// Player Variables
let playerH = 100;
let playerW = 150;
let playerX = 50;
let playerY = boardHeight - playerH;

// Create struct for the sprite just to simplify things
let sprite = {
    x : playerX,
    y : playerY,
    width : playerW,
    height : playerH
}

// Now have a function for when the page loads
// this is going to initialize the window
window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
}