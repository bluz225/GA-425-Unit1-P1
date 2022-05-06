//delcare query selectors
const gameplayCanvas = document.querySelector("#gameplay-canvas")
const menuCanvas = document.querySelector("#menu-canvas")
const menuElements = document.querySelectorAll(".menu")
const gameplayElements = document.querySelectorAll(".gameplay")
const startButton = document.querySelector("#start-Button")
const gameplayCtx = gameplayCanvas.getContext("2d")

// set up canvas
gameplayCanvas.setAttribute("height", getComputedStyle(gameplayCanvas)["height"])
gameplayCanvas.setAttribute("width", getComputedStyle(gameplayCanvas)["width"])

// variables
const scale = 1

let menufront = true
let gameplayCanvasHeight = gameplayCanvas.height
let gameplayCanvasWidth = gameplayCanvas.width
const side = 50*scale
let PlayerTriXPos = 100*scale
let PlayerTriColor = "black"
let PlayerSqXPos = 1300*scale
let PlayerSqColor = PlayerTriColor
const landscapeHeight = 100*scale
const gameFloor = (gameplayCanvasHeight-side-landscapeHeight)


document.addEventListener("DOMContentLoaded", function(){

    // console.log("canvas height:", gameplayCanvasHeight)
    // console.log("canvas width:",gameplayCanvasWidth)

    GenerateLandscape(landscapeHeight)
    // renderTriangle(100,100,side, "blue") // not sure why y=100 makes it smaller
    const triangle = new rendTri(PlayerTriXPos,gameFloor,side,PlayerTriColor)
    const square = new Turret(PlayerSqXPos,gameFloor,side,PlayerSqColor)
    console.log(square)
    // console.log(triangle)
    square.render()
    triangle.render()

    GenerateCannon(square.x,square.y)

    gameplayCanvas.addEventListener("mousemove", function(e){
        // console.log(`x: ${e.offsetX} y: ${e.offsetY}`)
    })


})

function GenerateLandscape(height){
    gameplayCtx.fillStyle = "green"
    gameplayCtx.fillRect(0,gameplayCanvasHeight-height, gameplayCanvasWidth,height)
}

function GenerateCannon(x,y){
    console.log("X:", x)
    console.log("y:", y)
}


class Turret {
    constructor(x,y,side,color){
        this.x = x
        this.y = y
        this.side = side
        this.color = color
        this.alive = true
        this.centerx = x+side/2
        this.centery = y+side/2
    }

    render(){
        // gameplayCtx.fillStyle = this.color
        // gameplayCtx.fillRect(this.x,this.y, this.side,this.side)
    
        gameplayCtx.strokeStyle = this.color;
        gameplayCtx.strokeRect(this.x,this.y, this.side,this.side);
    }
}

class rendTri extends Turret{
    constructor(x,y,side,color){
        super(x,y,side,color);

    }

    render(){
        let triangle = new Path2D();
        triangle.moveTo(this.side/2+this.x, 0+this.y);
        triangle.lineTo(this.side+this.x, this.side+this.y);
        triangle.lineTo(0+this.x, this.side+this.y);
        triangle.closePath();
    
        // Fill path
        // gameplayCtx.fillStyle = this.color;
        // gameplayCtx.fill(triangle, 'evenodd');
        gameplayCtx.strokeStyle = this.color;
        gameplayCtx.stroke(triangle);


    }
}


function collisionDetection(){

}

function screenSwitch() {
    if (menufront === true){
        gameplayElements.forEach(function(i){
            i.classList.add("negOneZ")
        })

        menuElements.forEach(function(i){
            i.classList.add("posOneZ")
        })

    } else {
        gameplayElements.forEach(function(i){
            i.classList.add("posOneZ")
        })

        menuElements.forEach(function(i){
            i.classList.add("negOneZ")
        })
    }
}