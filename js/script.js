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
        this.dir = 1
        this.truDeg = 0
        this.cannonMx = 0
        this.cannonMy = 0
    }

    renderCannon(mouseX,mouseY){
        if (this.originX > centerline) {
            this.dir = -1
        }
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
        this.cannonMx = this.originX+cannonLength*Math.cos(rad)*this.dir
        this.cannonMy = this.originY-cannonLength*Math.sin(rad)  
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.cannonMx, this.cannonMy)
        this.truDeg = this.deg
        // this.truDeg = this.deg
        // console.log("<90 degree", this.truDeg)

    } else if (this.deg > 90){
        rad = convertDegtoRad(this.deg-90)
        this.cannonMx = this.originX-cannonLength*Math.sin(rad)*this.dir
        this.cannonMy = this.originY-cannonLength*Math.cos(rad)
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.cannonMx, this.cannonMy)
        this.truDeg = this.deg

        // this.truDeg = this.truDeg + convertRadtoDeg(rad)
        // console.log(">90 degree", this.truDeg)

    } else if (this.deg === 90) {
        this.cannonMx = this.originX
        this.cannonMy = this.originY-cannonLength
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.cannonMx, this.cannonMy)
        this.truDeg = 90

    } else if (this.deg === 0) {
        this.cannonMx = this.originX+cannonLength
        this.cannonMy = this.originY
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.cannonMx, this.cannonMy)
        this.truDeg = 0

    } else if (this.deg === 180) {
        this.cannonMx = this.originX-cannonLength
        this.cannonMy = this.originY
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(this.cannonMx, this.cannonMy)
        this.truDeg = 180

    }
    // console.log("tru deg:",this.truDeg)
    // console.log("x:", cannonMx,"y:", this.cannonMy,"deg:", this.deg, "rad:", rad)
    // console.log("hypon:", Math.sqrt(Math.pow(cannonMx,2)+Math.pow(this.cannonMy,2)))
    cannon.closePath()
    // gameplayCtx.strokeStyle = this.color
    gameplayCtx.stroke(cannon)
    }

}

class projectile {
    constructor(Xi,Yi,Vi,Deg){
        this.side = 10
        this.t = 0
        this.Vi = 500
        this.Vx = 0
        this.Vyi = 0
        this.Vyf = 0
        this.Degi = 89
        this.Degc = 89
        this.Xi = Xi
        this.Xf
        this.Yi = Yi
        this.Yf 


        this.centerXi = this.Xi - this.side/2
        this.centerYi = this.Yi - this.side/2
        // this.centerXf = 0
        // this.centerYf = 0

    }

    render(){
        let projScale = 0.001
        // this.t = this.t*projScale
        if (this.t === 0){
            this.Degi = convertDegtoRad(this.Degi)
            this.Degc = convertDegtoRad(this.Degc)
            // console.log("converted i and c:",this.Degi,this.Degc)
        }
        // calculate initial Vix and Viy
        this.Vx = this.Vi*Math.cos(this.Degi)
        this.Vyi = this.Vi*Math.sin(this.Degi)
        this.Vyf = this.Vyi-grav*this.t
        

        console.log("proj t:",this.t)

        // calculate new motion angle
        this.Degc = Math.atan(this.Vyf/this.Vx)
        console.log("Vx:", this.Vx, "Vyi:", this.Vyi,"Vyf:", this.Vyf, "DegC:", this.Degc)
        
        //calculate vfx/vfy at t++ and set it as the next vix/viy

        this.Xf = this.Xi+this.Vx*this.t
        this.Yf = this.Yi+this.Vyi*this.t-grav*Math.pow(this.t,2)/2
        // this.Yf = this.Yi+()
        
        console.log("Xi:", this.Xi, "Xf:", this.Xf)
        console.log("Yi:", this.Yi, "Yf:", this.Yf, "YDetla:", this.Yf-this.Yi)
        
        this.Xi = this.Xf
        this.Yi = this.Yf
        this.Vyi = this.Vyf

        // this.t = this.t + gameSpeed/1000
        this.t++

        // console.log("deg:", this.Deg)
        
        // console.log("Vix:", this.Vix)

        
        // this.Vi = Math.sqrt(Math.pow(this.Vix,2)-Math.pow(this.Viy,2))
        // console.log("postcalc Vi:", this.Vi)
        
        // this.Deg = Math.atan(this.Viy/this.Vix)
        // this.Xi = this.Vi*Math.cos(this.Deg)*this.t
        // this.Yi = this.Vi*Math.sin(this.Deg)-grav*Math.pow(this.t,2)
        // console.log("postcalc Xi:", this.Xi)
        // console.log("postcalc Yi:", this.Yi)

        // console.log("centerX:",this.centerXi,"centerY:",this.centerYi)
        
        // gameplayCtx.fillStyle = "red"
        // gameplayCtx.fillRect(this.centerXi,this.centerYi,this.side,this.side)


    }

}

class Turret {
    constructor(x,y,side,color,shape){
        this.shape = shape
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
let centerline = gameplayCanvas.width/2
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
let firedFlag = false

// Create 
const triangle = new TriangleTurrent(PlayerTriXPos/scale,gameFloor,side,PlayerTriColor,"triangle")
const square = new Turret(PlayerSqXPos/scale,gameFloor,side,PlayerSqColor,"square")
const SqCannon = new GenerateCannon(square.centerx,square.centery)
const TriCannon = new GenerateCannon(triangle.centerx,triangle.centery)




//DOM CONTENT LOADED HERE
document.addEventListener("DOMContentLoaded", function(){
    
    currentPlayerText.innerText = `Current Player: ${currentPlayer}`



    // gameplayCanvas.addEventListener("mousemove", function(e){
        
    //     // console.log(e)
    //     // MouseCurrX = e.offsetX
    //     // MouseCurrY = e.offsetY
    //     const rect = gameplayCanvas.getBoundingClientRect()
    //     MouseCurrX = e.clientX - rect.left
    //     MouseCurrY = e.clientY - rect.top 
    //     // console.log(`x: ${MouseCurrX} y: ${MouseCurrY}`)
    // })


    // const testSquare = new Turret(0,0,100,100,"black")
    // testSquare.renderTurret()
    currCannon = TriCannon
    
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
                        firedFlag = true

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
        console.log("tru.deg passed:",TriCannon.truDeg )
        const miss = new projectile(0,0,30,45)

        const game = setInterval(function(){
            gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            GenerateLandscape(landscapeHeight)
            square.renderTurret()
            triangle.renderTurret()
            TriCannon.renderCannon(MouseCurrX,MouseCurrY)
            SqCannon.renderCannon(MouseCurrX,MouseCurrY)
            
            if (firedFlag === true) {
                
                miss.render()
                // firedFlag = false
            }
        },gameSpeed)

        function pause(arg){
            if (arg === true){
                pauseState = true
                clearInterval(game)
            } else {
                pauseState = false
                setInterval(game,gameSpeed)
            }
           
        }
   
    
})

//FUNCTIONS BELOW HERE
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