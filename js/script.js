


//FETCH DOM ELEMENTS
const menuCanvas = document.querySelector("#menu-canvas")
const menuElements = document.querySelectorAll(".menu")
const gameplayElements = document.querySelectorAll(".gameplay")
const startButton = document.querySelector("#start-Button")
const currentPlayerText = document.querySelector("#current-Player")

// CANVAS SETUP
const gameplayCanvas = document.querySelector("#gameplay-canvas")
const gameplayCtx = gameplayCanvas.getContext("2d")
gameplayCanvas.setAttribute("height", getComputedStyle(gameplayCanvas)["height"])
gameplayCanvas.setAttribute("width", getComputedStyle(gameplayCanvas)["width"])

const projectileCanvas = document.querySelector("#projectile-canvas")
const projectileCtx = projectileCanvas.getContext("2d")
projectileCanvas.setAttribute("height", getComputedStyle(projectileCanvas)["height"])
projectileCanvas.setAttribute("width", getComputedStyle(projectileCanvas)["width"])

const explosionCanvas = document.querySelector("#explosion-canvas")
const explosionCtx = explosionCanvas.getContext("2d")
explosionCanvas.setAttribute("height", getComputedStyle(explosionCanvas)["height"])
explosionCanvas.setAttribute("width", getComputedStyle(explosionCanvas)["width"])

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

    let cannonLength = 45*scale
    let rad = 0
    let cannon = new Path2D()

    if (this.originX > centerline) {
        this.dir = -1
    } else {
        this.dir = 1
    }
    
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

    cannon.closePath()
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

    render(Xi,Yi,length,degreeRad,direction,color){
        let missile = new Path2D()
        missile.moveTo(Xi, Yi)
        const missileXYf = generateAngledLineXY(Xi,Yi,length,degreeRad,direction)
        missile.lineTo(missileXYf[0], missileXYf[1])
        missile.closePath()
        projectileCtx.strokeStyle = color
        projectileCtx.stroke(missile)
    }

    projectileMove(Xi,Yi,Vi,deg,dir){
        // let missile = new Path2D()
        let tStep = 0.01
      
        // set intial settings at time 0
        if (this.t === 0) {
            this.Vi = Vi
            this.Degi = deg
            this.dir = dir
            this.Xi = Xi
            this.Yi = Yi
            this.Degi = convertDegtoRad(this.Degi)
            
            // calculate initial x velocity, this does not change in projectile motion
            this.Vx = this.Vi*Math.cos(this.Degi)*this.dir
        }

        this.Vyi = -1*this.Vi*Math.sin(this.Degi)+grav*this.t
        this.render(this.Xi,this.Yi,this.length,this.Degi,this.dir,"red")
        // iterate time step
        this.t = this.t + tStep
        //Calculate and assign next step projectile motion parameters
        this.Vyf = this.Vyi
        this.Xf = (this.Xi+this.Vx*this.t)
        this.Yf = (this.Yi+this.Vyi*this.t+grav*Math.pow(this.t,2)/2)
        this.Degi = Math.atan(-1*this.Vyi/this.Vx)
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
        hitBoxArr[1] = {
            top: this.y,
            left: this.x,
            right: this.x+this.side,
            name: "square"
        }
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

        hitBoxArr[2] = {
            top: this.y,
            left: this.x,
            right: this.x+this.side,
            name: "triangle"
        }

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
const gameSpeed = 32 // 60pfs is 16
let currentPlayer = "triangle"
let currCannon
let currProj
let pauseState = false
let firedFlag = false
let projSpeed = 100
let winFlag = false
let collisionFlag = false

// Create objects
const triangle = new TriangleTurrent(PlayerTriXPos/scale,gameFloor,side,PlayerTriColor,"triangle")
const square = new Turret(PlayerSqXPos/scale,gameFloor,side,PlayerSqColor,"square")
const SqCannon = new GenerateCannon(square.centerx,square.centery)
const TriCannon = new GenerateCannon(triangle.centerx,triangle.centery)
const TriShot = new projectile(TriCannon.cannonMx,TriCannon.cannonMy,0,TriCannon.truDeg,TriCannon.dir)
const SqShot = new projectile(SqCannon.cannonMx,SqCannon.cannonMy,0,SqCannon.truDeg,SqCannon.dir)
const hitBoxArr = ["","",""]




//DOM CONTENT LOADED HERE
document.addEventListener("DOMContentLoaded", function(){
    // grab height of the landscape

    currCannon = TriCannon
    const game = setInterval(function gameLoop() {
        if (pauseState === false){
            hitBoxArr[0] = {
                top: revertY(landscapeHeight),
                left: 0,
                right: gameplayCanvasWidth,
                name: "land"
            }
    
    
    
    
            currentPlayerText.innerText = `Current Player: ${currentPlayer}`
    
    
            gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            GenerateLandscape(landscapeHeight)
            square.renderTurret()
    
            // console.log("hitboxArr:",hitBoxArr)
            triangle.renderTurret()
            // grab current position of the tanks 
    
            TriCannon.renderCannon(MouseCurrX,MouseCurrY)
            SqCannon.renderCannon(MouseCurrX,MouseCurrY)
            TriShot.render(TriCannon.cannonMx,TriCannon.cannonMy,0,0,0,"black")
            projectileCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            if (firedFlag === true && collisionFlag === false) {
                console.log("fired flag", firedFlag)
                console.log("collision flag",collisionFlag)
                console.log("currentPlayer:", currentPlayer)
                if (currentPlayer === "triangle") {
                    console.log("Triangle fired")
                    TriShot.projectileMove(TriCannon.cannonMx, TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
                    collisionDetection(TriShot.Xi,TriShot.Yi)
                    // pauseState = true 
                    
                            
                } else if (currentPlayer === "square"){
                    console.log("Square fired")
                    SqShot.render(SqCannon.cannonMx, SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)
                    collisionDetection(SqShot.Xi,SqShot.Yi)
                    // pauseState = true    
                    
                }
    
            }
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

                        // playerSwitch(currentPlayer)
                        
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

        
        function pause(arg){
            if (arg === true){
                pauseState = true
                // clearInterval(game,0)
            } else if (arg === false) {
                pauseState = false
                // game = setInterval(gameLoop,gameSpeed)
            }
           
        }
   
})

//FUNCTIONS BELOW HERE

function drawExplosion(x,y){
    // let expl = new Path2D()
    explosionCtx.beginPath()
    explosionCtx.arc(x,y,5,0,2*pi)
    explosionCtx.closePath()
    explosionCtx.fill()
    explosionCanvas.style.zIndex = "3"
}


// detect collision with something and stops the setInterval (WIP)
// renders explosions.(WIP)
// checks if someone was damaged.(WIP)
function collisionDetection(Xf,Yf){
    let Xcollide = 0
    let Ycollide = 0
    let hitName =""
    //Axis Aligned bounding box collisional algorithm
    // AABB Colision Detection
    hitBoxArr.forEach(function(i){
        const hitTop = i.top <= Yf
        const hitLeft = i.left <= Xf
        const hitRight = i.right >= Xf
        console.log("-------")
        console.log("hit Top:", hitTop, i.name,"top:", i.top, "Yf", Yf)
        console.log("hit Left:", hitLeft,i.name,"left:", i.left, "Xf", Xf)
        console.log("hit Right:", hitRight,i.name,"right:", i.right, "Xf", Xf)
        if (hitTop === true && hitLeft === true && hitRight === true) {
            Xcollide = Xf
            Ycollide = Yf
            hitName = i.name

            // projectileCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            collisionFlag = true
            console.log("explode on", i.name)
            pauseState = true 
            firedFlag = false

            if (currentPlayer === "triangle") {

                TriShot.render(TriCannon.cannonMx, TriCannon.cannonMy,0,TriCannon.truDeg,TriCannon.dir)

                // pauseState = true 
                        
            } else if (currentPlayer === "square"){

                SqShot.render(SqCannon.cannonMx, SqCannon.cannonMy,0,SqCannon.truDeg,SqCannon.dir)

                // pauseState = true    
                
            }
            projectileCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            setTimeout(function explosionInterval(){
                drawExplosion(TriShot.Xi-60,TriShot.Yi-60)
            },1000)
            explosionCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            playerSwitch(currentPlayer)
            
            
            // playerSwitch(currentPlayer)
            // clearInterval(game)
            
            // playerSwitch(currentPlayer)
            
            // let 
            // ctx.beginPath();
            // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
            // ctx.stroke();
        }
    })

    // const hitLeft = TriShot.x + missile.width >= gameFloor
    // // console.log("ogre left:", ogreLeft)
    // const hitRight = TriShot.x <= ogre.x + ogre.width
    // // console.log("ogre Right:", ogreRight)
    // const hitTop = TriShot.y + hero.height >= ogre.y
    // // console.log("ogre Top:", ogreTop)
    // const hitBot = TriShot.y <= ogre.y + ogre.height
    // // console.log("ogre Top:", ogreTop)

    // if (hitLeft === true && hitRight===true && hitTop === true && hitBot === true) {
    //     // console.log("hit")
    //     ogre.alive = false
    //     movementDisplay.innerText= "you killed Shrek! Who is the monster now?"
    //     clearInterval(gameLoopInterval)

    // }
}

//player switcher
function playerSwitch(cPlayer){
    if (cPlayer === "triangle") {
        currentPlayer = "square"
        currentPlayerText.innerText = `Current Player: ${currentPlayer}`


    } else if(cPlayer === "square") {
        currentPlayer = "triangle"
        currentPlayerText.innerText = `Current Player: ${currentPlayer}`


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

// converts radians to degrees
function convertRadtoDeg(rad){
    return rad*180/pi
}

// converts degrees to radians
function convertDegtoRad(deg){
    return deg*pi/180
}


// generates intial landscape
function GenerateLandscape(height){
    gameplayCtx.fillStyle = "green"
    gameplayCtx.fillRect(0,gameplayCanvasHeight-height, gameplayCanvasWidth,height)
}


//convert canvas height to normal Y height
function convertY(originalheight) {
    return gameplayCanvasHeight-originalheight
}

//convert normal Y height to canvas height
function revertY(convertedheight) {
    return gameplayCanvasHeight-convertedheight
}







// switches between menu screen and gameplay screen (WIP)
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