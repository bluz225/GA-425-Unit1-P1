//FETCH DOM ELEMENT
const gameplayCanvas = document.querySelector("#gameplay-canvas")
const menuCanvas = document.querySelector("#menu-canvas")
const menuElements = document.querySelectorAll(".menu")
const gameplayElements = document.querySelectorAll(".gameplay")
const startButton = document.querySelector("#start-Button")
const gameplayCtx = gameplayCanvas.getContext("2d")
const currentPlayerText = document.querySelector("#current-Player")

// CANVAS SETUP
gameplayCanvas.setAttribute("height", getComputedStyle(gameplayCanvas)["height"])
gameplayCanvas.setAttribute("width", getComputedStyle(gameplayCanvas)["width"])

//CLASS SETUP
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

    } else if (this.deg > 90){
        rad = convertDegtoRad(this.deg-90)
        cannonMx = cannonLength*Math.sin(rad)
        cannonMy =  cannonLength*Math.cos(rad)
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX-cannonMx, this.originY-cannonMy)

    } else if (this.deg === 90) {
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX,this.originY-cannonLength)

    } else if (this.deg === 0) {
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX+cannonLength, this.originY)

    } else if (this.deg === 180) {
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.originX-cannonLength, this.originY)

    }
    
    // console.log("x:", cannonMx,"y:", cannonMy,"deg:", this.deg, "rad:", rad)
    // console.log("hypon:", Math.sqrt(Math.pow(cannonMx,2)+Math.pow(cannonMy,2)))
    cannon.closePath()
    // gameplayCtx.strokeStyle = this.color
    gameplayCtx.stroke(cannon)


    }

}

class projectile {
    constructor(Xi,Yi,Vi,Deg){
        this.t = 0
        this.Vi = Vi
        this.Deg = Deg
        this.Xi = Xi
        this.Yi = Yi

    }

    render(){

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
const gameSpeed = 100
let currentPlayer = "triangle"
let currCannon
let pauseState = false

// Create 
const triangle = new TriangleTurrent(PlayerTriXPos/scale,gameFloor,side,PlayerTriColor)
const square = new Turret(PlayerSqXPos/scale,gameFloor,side,PlayerSqColor)
const SqCannon = new GenerateCannon(square.centerx,square.centery)
const TriCannon = new GenerateCannon(triangle.centerx,triangle.centery)

//DOM CONTENT LOADED HERE
document.addEventListener("DOMContentLoaded", function(){
    
    currentPlayerText.innerText = `Current Player: ${currentPlayer}`
    GenerateLandscape(landscapeHeight)


    gameplayCanvas.addEventListener("mousemove", function(e){
        
        // console.log(e)
        // MouseCurrX = e.offsetX
        // MouseCurrY = e.offsetY
        const rect = gameplayCanvas.getBoundingClientRect()
        MouseCurrX = e.clientX - rect.left
        MouseCurrY = e.clientY - rect.top 
        // console.log(`x: ${MouseCurrX} y: ${MouseCurrY}`)
    })


    // const testSquare = new Turret(0,0,100,100,"black")
    // testSquare.renderTurret()
    currCannon = TriCannon
    

    const game = setInterval(gameLoop,gameSpeed)
    
    
        document.addEventListener("keydown", function(e){
            if (pauseState === false) {
                const speed = 1
                // console.log(e.key)
                // console.dir(e.key)
                switch(e.key) {
                    case("w"):
                    case("ArrowUp"):
                        currCannon.deg += speed
                        break
                    case("s"):
                    case("ArrowDown"):
                        currCannon.deg -= speed
                        

                        break
                    case(" "):
                        // console.log(currentPlayer)
                        // currCannon.deg -= speed
                        
                        playerSwitch(currentPlayer)
                        
                        console.log("Spacebar was pressed")
                    break
                    case(" "):
                        // console.log(currentPlayer)
                        // currCannon.deg -= speed
                        
                        playerSwitch(currentPlayer)
                        
                        console.log("Spacebar was pressed")
                    break  
                    case("Escape"):
                        pause(true)
                        
                        console.log("Paused")
                    break              
                }
            
            } else {
                switch(e.key) {
                    case("Escape"):
                        pause(false)
                    console.log("Unpaused")
                    break  
            }
        }
        })


 
    
    
    
})



    




//FUNCTIONS BELOW HERE
function pause(arg){
    if (arg === true){
        pauseState = true
        clearInterval(gameLoop)
    } else {
        pauseState = false
        setInterval(gameLoop,gameSpeed)
    }
   
}

function gameLoop(){
    gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
    GenerateLandscape(landscapeHeight)
    square.renderTurret()
    triangle.renderTurret()
    TriCannon.renderCannon(MouseCurrX,MouseCurrY)
    SqCannon.renderCannon(MouseCurrX,MouseCurrY)
}



function playerSwitch(cPlayer){
    if (cPlayer === "triangle") {
        currentPlayer = "square"
        currentPlayerText.innerText = `Current Player: ${currentPlayer}`
        currCannon = SqCannon

    } else if(cPlayer === "square") {
        currentPlayer = "triangle"
        currentPlayerText.innerText = `Current Player: ${currentPlayer}`
        currCannon = TriCannon

    }
}


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



function convertY(originalheight) {
    return gameplayCanvasHeight-originalheight
}

function revertY(convertedheight) {
    return gameplayCanvasHeight-convertedheight
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