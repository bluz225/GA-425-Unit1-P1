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
        } else {
            this.dir = 1
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
        const XY = generateAngledLineXY(this.originX,this.originY,cannonLength,rad,this.dir)
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(XY[0], XY[1])
        this.truDeg = convertRadtoDeg(rad)
        this.cannonMx = XY[0]
        this.cannonMy = XY[1]

        // this.truDeg = this.deg
        // console.log("<90 degree", this.truDeg)

    } else if (this.deg > 90){
        rad = convertDegtoRad(this.deg) 
        const XY = generateAngledLineXY(this.originX,this.originY,cannonLength,rad,this.dir)
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(XY[0], XY[1])
        this.truDeg = convertRadtoDeg(rad)
        this.cannonMx = XY[0]
        this.cannonMy = XY[1]
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
    console.log("tru deg:",this.truDeg)
    // console.log("x:", cannonMx,"y:", this.cannonMy,"deg:", this.deg, "rad:", rad)
    // console.log("hypon:", Math.sqrt(Math.pow(cannonMx,2)+Math.pow(this.cannonMy,2)))
    cannon.closePath()
    // gameplayCtx.strokeStyle = this.color
    gameplayCtx.stroke(cannon)
    }

}

class projectile {
    constructor(Xi,Yi,Vi,Deg,dir){
        this.length = 10
        this.t = 0
        this.Vi = Vi
        this.Vx = 0
        this.Vyi = 0
        this.Vyf = 0
        this.Degi = Deg
        this.Xi = Xi
        this.Xf
        this.Yi = Yi
        this.Yf 
        this.dir = dir
        this.hit = false

    }

    render(Xi,Yi,deg,dir){
        
        let projScale = 1
        let missile = new Path2D()
        grav = 9.81
        let tStep = 1

        console.log("vi:", this.Vi)
        
        // set intial settings at time 0
        if (this.t === 0) {
            
            this.Degi = deg
            this.dir = dir
            this.Xi = Xi
            this.Yi = Yi
            this.Degi = convertDegtoRad(this.Degi)
            console.log("unconv Deg i:", this.Degi, "conv Deg i", convertRadtoDeg(this.Degi))
            this.Vx = this.Vi*Math.cos(this.Degi)*this.dir

        }
        // starts rendering missile
        console.log("Vx:", this.Vx, "Vyi:", this.Vyi,"Vyf:", this.Vyf, "Degi:", this.Degi)
        console.log("Xi:", this.Xi, "Xf:", this.Xf)
        console.log("Yi:", this.Yi, "Yf:", this.Yf, "YDetla:", this.Yf-this.Yi)

        // draws starting point of missile (back of missile)
        missile.moveTo(this.Xi, this.Yi)
        console.log("proj t:",this.t)
        // console.log("unconv Deg i:", this.Degi, "conv Deg i", convertRadtoDeg(this.Degi))

        console.log("tri Xi",this.Xi,"tri Yi",this.Yi)
        
        // calculate initial Vix and Viy
        
        this.Vyi = -1*this.Vi*Math.sin(this.Degi)+grav*this.t
        
        // iterate time step
        this.t = this.t + 0.01
        console.log("proj t+t:",this.t)

        let missileXYf = generateAngledLineXY(this.Xi,this.Yi,this.length,this.Degi,this.dir)
        missile.lineTo(missileXYf[0], missileXYf[1])
        
        missile.closePath()
        gameplayCtx.strokeStyle = "red"
        gameplayCtx.stroke(missile)

        // calculate new motion angle
        // this.Vyf = this.Vyi+grav*this.t
        this.Vyf = this.Vyi
        

        this.Xf = (this.Xi+this.Vx*this.t)
        this.Yf = (this.Yi+this.Vyi*this.t+grav*Math.pow(this.t,2)/2)
        
        this.Degi = Math.atan(-1*this.Vyi/this.Vx)
        Math.abs()
        this.Vi = Math.sqrt(Math.pow(this.Vyf,2)+Math.pow(this.Vx,2))

        this.Xi = this.Xf
        this.Yi = this.Yf

    }

}

// class Turret with square default
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
        // render square
        gameplayCtx.strokeStyle = this.color
        gameplayCtx.strokeRect(this.x,this.y, this.side,this.side)
    }
}

class TriangleTurrent extends Turret{
    constructor(x,y,side,color){
        super(x,y,side,color)

    }

    renderTurret(){
        // draw triangle lines
        let triangle = new Path2D()
        triangle.moveTo(this.side/2+this.x, 0+this.y)
        triangle.lineTo(this.side+this.x, this.side+this.y)
        triangle.lineTo(0+this.x, this.side+this.y)
        triangle.closePath();
        
        // render triangle drawn
        gameplayCtx.strokeStyle = this.color
        gameplayCtx.stroke(triangle)

    }
}

// GLOBAL VARIABLES
const scale = 1
let grav = 9.81
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
const gameSpeed = 128 // 60pfs is 16
let currentPlayer = "triangle"
let currCannon
let pauseState = false
let firedFlag = false
let projSpeed = 100

// Create objects
const triangle = new TriangleTurrent(PlayerTriXPos/scale,gameFloor,side,PlayerTriColor,"triangle")
const square = new Turret(PlayerSqXPos/scale,gameFloor,side,PlayerSqColor,"square")
const SqCannon = new GenerateCannon(square.centerx,square.centery)
const TriCannon = new GenerateCannon(triangle.centerx,triangle.centery)
const TriShot = new projectile(TriCannon.cannonMx,TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
const SqShot = new projectile(SqCannon.cannonMx,SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)




//DOM CONTENT LOADED HERE
document.addEventListener("DOMContentLoaded", function(){

    
    currentPlayerText.innerText = `Current Player: ${currentPlayer}`
    
    const game = setInterval(function(){
        gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
        GenerateLandscape(landscapeHeight)
        square.renderTurret()
        triangle.renderTurret()
        TriCannon.renderCannon(MouseCurrX,MouseCurrY)
        SqCannon.renderCannon(MouseCurrX,MouseCurrY)
        
        if (firedFlag === true) {
            
            TriShot.render(TriCannon.cannonMx, TriCannon.cannonMy,TriCannon.truDeg,TriCannon.dir)
            // firedFlag = false
        }
    },gameSpeed)



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
//outputs X and Y coordinates of line end based on origin XY requested length and degrees in radians
//using right angle geomtry formulas
// also takes into account left and right direction (-1 = left, 1 = right)
function generateAngledLineXY(oX,oY,l,rad,dir){
    let Xf = 0
    let Yf = 0
    Xf = oX + l*Math.cos(rad)*dir
    Yf = oY - l*Math.sin(rad)
    return [Xf, Yf]
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
    //Axis Aligned bounding box collisional algorithm
    // AABB Colision Detection
    const hitLeft = TriShot.x + missile.width >= gameFloor
    // console.log("ogre left:", ogreLeft)
    const hitRight = TriShot.x <= ogre.x + ogre.width
    // console.log("ogre Right:", ogreRight)
    const hitTop = TriShot.y + hero.height >= ogre.y
    // console.log("ogre Top:", ogreTop)
    const hitBot = TriShot.y <= ogre.y + ogre.height
    // console.log("ogre Top:", ogreTop)

    if (hitLeft === true && hitRight===true && hitTop === true && hitBot === true) {
        // console.log("hit")
        ogre.alive = false
        movementDisplay.innerText= "you killed Shrek! Who is the monster now?"
        clearInterval(gameLoopInterval)

    }
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