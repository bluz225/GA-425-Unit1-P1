//DECLARE QUERY SELECTORS
const gameplayCanvas = document.querySelector("#gameplay-canvas")
const menuCanvas = document.querySelector("#menu-canvas")
const menuElements = document.querySelectorAll(".menu")
const gameplayElements = document.querySelectorAll(".gameplay")
const startButton = document.querySelector("#start-Button")
const gameplayCtx = gameplayCanvas.getContext("2d")

// CANVAS SETUP
gameplayCanvas.setAttribute("height", getComputedStyle(gameplayCanvas)["height"])
gameplayCanvas.setAttribute("width", getComputedStyle(gameplayCanvas)["width"])

// GLOBAL VARIABLES
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
let MouseCurrX = 0
let MouseCurrY = 0

//DOM CONTENT LOADED HERE
document.addEventListener("DOMContentLoaded", function(){
    GenerateLandscape(landscapeHeight)
    const triangle = new TriangleTurrent(PlayerTriXPos,gameFloor,side,PlayerTriColor)
    const square = new Turret(PlayerSqXPos,gameFloor,side,PlayerSqColor)
    square.renderTurret()
    triangle.renderTurret()
    gameplayCanvas.addEventListener("mousemove", function(e){
        // console.log(`x: ${e.offsetX} y: ${e.offsetY}`)
        MouseCurrX = e.offsetX
        MouseCurrY = e.offsetY
    })

    const SqCannon = new GenerateCannon(square.centerx,square.centery)

    setInterval(function(){

        
        SqCannon.renderCannon(MouseCurrX,MouseCurrY)
    },100)
    
    
})

    




//FUNCTIONS AND CLASSES BELOW HERE
function GenerateLandscape(height){
    gameplayCtx.fillStyle = "green"
    gameplayCtx.fillRect(0,gameplayCanvasHeight-height, gameplayCanvasWidth,height)
}

class GenerateCannon{
    constructor(originX,originY){
        this.originX = originX
        this.originY = originY

    }

    renderCannon(mouseX,mouseY){
    console.log()
    // console.log(`Origin x: ${this.originX} Origin y: ${this.originY} Mouse x: ${mouseX} Mouse y: ${mouseY}`)
    
    //equations for determining length and position of the cannon mouth
    let m = (mouseY-this.originY)/(mouseX-this.originY) // slope relative to mouse position
    console.log("slope:", m)
    let cannonLength = 50

    
    let cannon = new Path2D()
    cannon.moveTo(this.originX, this.originY)
    cannon.lineTo(this.originX+cannonLength, this.originY-cannonLength)
    cannon.closePath()

    // gameplayCtx.strokeStyle = this.color
    gameplayCtx.stroke(cannon)


    }

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

    renderTurret(){
        // gameplayCtx.fillStyle = this.color
        // gameplayCtx.fillRect(this.x,this.y, this.side,this.side)
    
        gameplayCtx.strokeStyle = this.color
        gameplayCtx.strokeRect(this.x,this.y, this.side,this.side)
    }
}

class TriangleTurrent extends Turret{
    constructor(x,y,side,color){
        super(x,y,side,color)

    }

    renderTurret(){
        let triangle = new Path2D()
        triangle.moveTo(this.side/2+this.x, 0+this.y)
        triangle.lineTo(this.side+this.x, this.side+this.y)
        triangle.lineTo(0+this.x, this.side+this.y)
        triangle.closePath();
    
        gameplayCtx.strokeStyle = this.color
        gameplayCtx.stroke(triangle)


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