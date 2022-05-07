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
const grav = 9.81
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
const pi = Math.PI

//DOM CONTENT LOADED HERE
document.addEventListener("DOMContentLoaded", function(){
    GenerateLandscape(landscapeHeight)
    const triangle = new TriangleTurrent(PlayerTriXPos/scale,gameFloor,side,PlayerTriColor)
    const square = new Turret(PlayerSqXPos/scale,gameFloor,side,PlayerSqColor)

    gameplayCanvas.addEventListener("mousemove", function(e){
        
        // console.log(e)
        // MouseCurrX = e.offsetX
        // MouseCurrY = e.offsetY
        const rect = gameplayCanvas.getBoundingClientRect()
        MouseCurrX = e.clientX - rect.left
        MouseCurrY = e.clientY - rect.top 
        // console.log(`x: ${MouseCurrX} y: ${MouseCurrY}`)
    })

    const SqCannon = new GenerateCannon(square.centerx,square.centery)
    const TriCannon = new GenerateCannon(triangle.centerx,triangle.centery)
    // const testSquare = new Turret(0,0,100,100,"black")
    // testSquare.renderTurret()

    setInterval(function(){
        gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
        GenerateLandscape(landscapeHeight)
        square.renderTurret()
        triangle.renderTurret()
        TriCannon.renderCannon(MouseCurrX,MouseCurrY)
        SqCannon.renderCannon(MouseCurrX,MouseCurrY)
        
        // SqCannon.renderCannon(MouseCurrX,MouseCurrY)
    },100)
    
    
    document.addEventListener("keydown", function(e){
        const speed = 1
        switch(e.key) {
            case("w"):
            TriCannon.deg = TriCannon.deg + speed
            console.log("w pressed")
                break
            case("s"):
            TriCannon.deg = TriCannon.deg - speed
            console.log("s pressed")
                break          
        }
    })
    
    
    
    
})



    




//FUNCTIONS AND CLASSES BELOW HERE
function convertRadtoDeg(rad){
    return rad*180/pi
}

function convertDegtoRad(deg){
    return deg*pi/180
}



function GenerateLandscape(height){
    gameplayCtx.fillStyle = "green"
    gameplayCtx.fillRect(0,gameplayCanvasHeight-height, gameplayCanvasWidth,height)
}

class GenerateCannon{
    constructor(originX,originY){
        this.originX = originX
        this.originY = originY
        this.deg = 45 // degrees
    }

    renderCannon(mouseX,mouseY){

    let cannonOx = 0 
    let cannonOy = 0
    let cannonMx = 0
    let cannonMy = 0
    let cannonLength = 45*scale
    let rad = 0
    let cannon = new Path2D()
    
    if (this.deg < 0) {
        this.deg = 0
    } else if(this.deg > 180) {
        this.deg = 180
    }


    if (this.deg < 90) {
        rad = convertDegtoRad(this.deg)
        cannonMx = cannonLength*Math.cos(rad)
        cannonMy =  cannonLength*Math.sin(rad)  
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX+cannonMx, this.originY-cannonMy)
        cannon.closePath()
    } else if (this.deg > 90){
        rad = convertDegtoRad(this.deg-90)
        cannonMx = cannonLength*Math.sin(rad)
        cannonMy =  cannonLength*Math.cos(rad)
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX-cannonMx, this.originY-cannonMy)
        cannon.closePath()
    } else if (this.deg === 90) {
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX,this.originY-cannonLength)
        cannon.closePath()
    } else if (this.deg === 0) {
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX+cannonLength, this.originY)
        cannon.closePath()
    } else if (this.deg === 180) {
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX-cannonLength, this.originY)
        cannon.closePath()
    }
    
    // console.log("x:", cannonMx,"y:", cannonMy,"deg:", this.deg, "rad:", rad)
    // console.log("hypon:", Math.sqrt(Math.pow(cannonMx,2)+Math.pow(cannonMy,2)))

    // gameplayCtx.strokeStyle = this.color
    gameplayCtx.stroke(cannon)


    }

}

function convertY(originalheight) {
    return gameplayCanvasHeight-originalheight
}

function revertY(convertedheight) {
    return gameplayCanvasHeight-convertedheight
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