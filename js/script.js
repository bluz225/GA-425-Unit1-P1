


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
        this.deg = 65 // degrees
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
        this.Xi = Xi
        this.Yi = Yi
        let missile = new Path2D()
        missile.moveTo(Xi, Yi)
        const missileXYf = generateAngledLineXY(this.Xi,this.Yi,length*scale,degreeRad,direction)
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
            this.Vi = Vi*scale
            this.Degi = deg
            this.dir = dir
            this.Xi = Xi
            this.Yi = Yi
            this.Degi = convertDegtoRad(this.Degi)
            console.log("deg:",deg)
            // calculate initial x velocity, this does not change in projectile motion
            this.Vx = this.Vi*Math.cos(this.Degi)*this.dir
            
        }

        this.Vyi = (this.Vi*Math.sin(this.Degi)-grav*this.t)
        this.render(this.Xi,this.Yi,this.length,this.Degi,this.dir,"red")
        // iterate time step
        this.t = this.t + tStep
        //Calculate and assign next step projectile motion parameters
        this.Vyf = this.Vyi
        this.Xf = this.Xi+this.Vx*this.t
        this.Yf = (this.Yi+this.Vyi*this.t-grav*Math.pow(this.t,2)/2)
        // console.log(grav)
        this.Degi = Math.atan(this.Vyi/this.Vx*this.dir)
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
        triangle.moveTo(this.x, this.y)
        triangle.lineTo(this.x+this.side, this.y)
        triangle.lineTo(this.x+this.side/2, this.side+this.y)
        // triangle.lineTo(this.side+this.x, this.side+this.y)
        // triangle.lineTo(0+this.x, this.side+this.y)
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
const scale = 0.5
let grav = 9.81**scale
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
const gameFloor = landscapeHeight
let MouseCurrX = 0
let MouseCurrY = 0
const pi = Math.PI
const gameSpeed = 32 // 60pfs is 16
let currentPlayer = "triangle"
let currCannon
let currProj
let pauseState = false
let firedFlag = false
let projSpeed = 120
let winFlag = false
let collisionFlag = false
let explosionRadius = 10
const projs = []

// Create objects
const triangle = new TriangleTurrent(PlayerTriXPos/scale,gameFloor,side,PlayerTriColor,"triangle")
const square = new Turret(PlayerSqXPos/scale,gameFloor,side,PlayerSqColor,"square")
const SqCannon = new GenerateCannon(square.centerx,square.centery)
const TriCannon = new GenerateCannon(triangle.centerx,triangle.centery)
let TriShot = new projectile(TriCannon.cannonMx,TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
let SqShot = new projectile(SqCannon.cannonMx,SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)

const hitBoxArr = ["","",""]

//DOM CONTENT LOADED HERE
document.addEventListener("DOMContentLoaded", function(){
    // reset origins of all canvas to normal Cartisian coordinate system (origin at bottom left)
    gameplayCtx.translate(0,gameplayCanvas.height)
    gameplayCtx.scale(1,-1)
    gameplayCtx.save()

    projectileCtx.translate(0,projectileCanvas.height)
    projectileCtx.scale(1,-1)
    projectileCtx.save()
    
    explosionCtx.translate(0,explosionCanvas.height)
    explosionCtx.scale(1,-1)
    explosionCtx.save()




    currCannon = TriCannon
    // const game = setInterval(gameLoop,gameSpeed)
    
    
    
    window.requestAnimationFrame(gameLoop)



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
                
                if (currentPlayer === "triangle"){
                    currCannon = TriCannon
                } else if (currentPlayer === "square"){
                    currCannon = SqCannon
                }
                const speed = 1
                // console.log(e.key)
                // console.dir(e.key)
                switch(e.key) {
                    case("w"):
                    case("ArrowUp"):
                        currCannon.deg += speed
                        console.log(currCannon)
                        break

                    case("s"):
                    case("ArrowDown"):
                        currCannon.deg -= speed
                        console.log(currCannon)
                        break

                    case(" "):
                        // console.log(currentPlayer)
                        // currCannon.deg -= speed
                        firedFlag = true

                        // playerSwitch(currentPlayer)

                        window.requestAnimationFrame(projFired)
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

function projFired() {


    if (firedFlag === true && collisionFlag === false) {
        // projectileCtx.clearRect(0,0,projectileCanvas.width,projectileCanvas.height)                
        // console.log("proj fireloop running")
        if (currentPlayer === "triangle") {
            // console.log("Triangle fired")
            
            TriShot.projectileMove(TriCannon.cannonMx, TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
            console.log("Tri Deg:",TriShot.Degi)
            collisionDetection(TriShot.Xi,TriShot.Yi)
            pauseState = true 
            
                    
        } else if (currentPlayer === "square"){
            // console.log("Square fired")

            SqShot.projectileMove(SqCannon.cannonMx, SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)
            collisionDetection(SqShot.Xi,SqShot.Yi)
            pauseState = true    
            
        }

        window.requestAnimationFrame(projFired)
    }    
}

function gameLoop() {

    if (pauseState === false){
        hitBoxArr[0] = {
            top: landscapeHeight,
            left: 0,
            right: gameplayCanvasWidth,
            name: "land"
        }

        currentPlayerText.innerText = `Current Player: ${currentPlayer}`

        gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
        GenerateLandscape(landscapeHeight)
        console.log("gameloop running")

        // console.log("hitboxArr:",hitBoxArr)
        
        // grab current position of the tanks 
        square.renderTurret()
        triangle.renderTurret()
        TriCannon.renderCannon(MouseCurrX,MouseCurrY)
        SqCannon.renderCannon(MouseCurrX,MouseCurrY)
        // console.log(SqCannon)
       

        // console.log("triCan:",TriCannon.cannonMx,"triShot:",TriShot.Xi)


        explosionCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
        
        
    }

    window.requestAnimationFrame(gameLoop)
    
}

function drawExplosion(x,y){
    // let expl = new Path2D()
    explosionCtx.beginPath()
    explosionCtx.arc(x,y,explosionRadius,0,2*pi)
    explosionCtx.closePath()
    explosionCtx.fill()
    explosionCanvas.style.zIndex = "3"
}


// detect collision with something and stops the setInterval (WIP)
// renders explosions.(WIP)
// checks if someone was damaged.(WIP)
function collisionDetection(Xf,Yf){
    let hitName =""
    //Axis Aligned bounding box collisional algorithm
    // AABB Colision Detection
    hitBoxArr.forEach(function(i){
        const hitTop = Yf <= i.top
        const hitLeft = Xf >= i.left
        const hitRight = Xf <= i.right
        // console.log("-------")
        // console.log("hit Top:", hitTop, i.name,"top:", i.top, "Yf", Yf)
        // console.log("hit Left:", hitLeft,i.name,"left:", i.left, "Xf", Xf)
        // console.log("hit Right:", hitRight,i.name,"right:", i.right, "Xf", Xf)
        if (hitTop === true && hitLeft === true && hitRight === true) {

            hitName = i.name

            // projectileCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            collisionFlag = true
            // console.log("explode on", i.name)

            // clearInterval(projSetInt)
            projectileCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            
            let currShot 
            if (currentPlayer === "triangle"){
                currShot = TriShot
            } else {
                currShot = SqShot
            }
            
            drawExplosion(currShot.Xf,currShot.Yf)
           
            
            setTimeout(function (){
                // console.log(explosionCtx)
                // explosionCtx.clearRect(0,0,explosionCtx.width,explosionCtx.height)
                // projectileCtx.clearRect(0,0,explosionCtx.width,explosionCtx.height)
                TriShot = new projectile(TriCannon.cannonMx,TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
                SqShot = new projectile(SqCannon.cannonMx,SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)

                // console.log("sq Mx",SqCannon.cannonMx, "SqShot xi",SqShot.Xi)
                // console.log("tri Mx",TriCannon.cannonMx,"Tri Shot xi",TriShot.Xi)
                
                // console.log("current player:", currentPlayer)
                playerSwitch(currentPlayer)
                // console.log("current player:", currentPlayer)
                
                
                // console.log("pause state:",pauseState)
                pauseState = false
                firedFlag = false
                collisionFlag = false
                // console.log("pause state:",pauseState)
                // console.log("firedFlag:",firedFlag)
                // console.log("collisionFlag:",collisionFlag)
                // setInterval(projFired,gameSpeed)
                // setInterval(gameLoop,gameSpeed)

            },1000)

            


            
            
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
    Yf = oY + l*Math.sin(rad)
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
    gameplayCtx.fillRect(0,0, gameplayCanvasWidth,height)
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