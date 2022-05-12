//FETCH DOM ELEMENTS
const menuElements = document.querySelectorAll(".menu")
const gameplayMenu = document.querySelector("#gameplayMenu")
const startButton = document.querySelector("#start-Button")

const returnMenuDiv = document.createElement("div")
const currentPlayerDiv = document.createElement("div")
const replayDiv = document.createElement("div")



// CANVAS SETUP
const gameplayCanvas = document.querySelector("#gameplay-canvas")
const gameplayCtx = gameplayCanvas.getContext("2d")
gameplayCanvas.setAttribute("height", getComputedStyle(gameplayCanvas)["height"])
gameplayCanvas.setAttribute("width", getComputedStyle(gameplayCanvas)["width"])

const explosionCanvas = document.querySelector("#explosion-canvas")
const explosionCtx = explosionCanvas.getContext("2d")
explosionCanvas.setAttribute("height", getComputedStyle(explosionCanvas)["height"])
explosionCanvas.setAttribute("width", getComputedStyle(explosionCanvas)["width"])

const menuCanvas = document.querySelector("#menu-canvas")
const menuCtx = menuCanvas.getContext("2d")
menuCanvas.setAttribute("height", getComputedStyle(menuCanvas)["height"])
menuCanvas.setAttribute("width", getComputedStyle(menuCanvas)["width"])

const winCanvas = document.querySelector("#win-canvas")
const winCtx = winCanvas.getContext("2d")
winCanvas.setAttribute("height", getComputedStyle(winCanvas)["height"])
winCanvas.setAttribute("width", getComputedStyle(winCanvas)["width"])

const guiCanvas = document.querySelector("#gui-canvas")
const guiCtx = guiCanvas.getContext("2d")
guiCanvas.setAttribute("height", getComputedStyle(guiCanvas)["height"])
guiCanvas.setAttribute("width", getComputedStyle(guiCanvas)["width"])


//CLASS SETUP
class generateGUI {
    constructor(x,y){
        this.x = x
        this.y = y

    }
}

class AngleHUD extends generateGUI {
    constructor(x,y,diameter){
        super(x,y)
        this.diameter = diameter
        this.lastAng = 0
        this.innerRadius
        this.outerRadius
    }
    
    render(){
        let innerRadius = this.diameter/2+10
        this.innerRadius = innerRadius
        let HUDthickness = 20
        let outerRadius = innerRadius + HUDthickness
        this.outerRadius = outerRadius

        guiCtx.save()

        guiCtx.beginPath()
        guiCtx.arc(this.x-1,this.y-1,innerRadius+1,0,pi,false)
        guiCtx.fillStyle = ""
        guiCtx.fill()

        guiCtx.globalCompositeOperation = "source-out"

        guiCtx.beginPath()
        guiCtx.arc(this.x,this.y,outerRadius,0,pi,false)
        guiCtx.fillStyle = "rgba(255, 255,255,0.5)"
        guiCtx.fill()

        guiCtx.restore()
        
    }

    renderLastShotLine(deg,dir){
        
        this.lastAng = convertDegtoRad(deg)
        console.log("renderLastShotAng",dir)
        gameplayCtx.save()
        gameplayCtx.beginPath()
        const XYi = generateAngledLineXY(this.x,this.y,this.innerRadius,this.lastAng,dir)
        const XYf = generateAngledLineXY(this.x,this.y,this.outerRadius,this.lastAng,dir)
        gameplayCtx.moveTo(XYi[0],XYi[1])
        gameplayCtx.lineTo(XYf[0],XYf[1])
        gameplayCtx.strokeStyle = "red"
        // gameplayCtx.globalCompositeOperation = "source-atop"
        gameplayCtx.stroke()
        gameplayCtx.restore()

    }
}



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
    } else if(this.deg > 90) {
        this.deg = 90
    }


    if (this.deg < 90) {
        rad = convertDegtoRad(this.deg) 
        const XY = generateAngledLineXY(this.originX,this.originY,cannonLength,rad,this.dir)
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(XY[0], XY[1])
        this.truDeg = convertRadtoDeg(rad)
        this.cannonMx = XY[0]
        this.cannonMy = XY[1]

    } else if (this.deg > 90){
        rad = convertDegtoRad(this.deg) 
        const XY = generateAngledLineXY(this.originX,this.originY,cannonLength,rad,this.dir)
        cannon.moveTo(this.originX, this.originY)
        cannon.lineTo(XY[0], XY[1])
        this.truDeg = convertRadtoDeg(rad)
        this.cannonMx = XY[0]
        this.cannonMy = XY[1]

    } else if (this.deg === 90) {
        this.cannonMx = this.originX
        this.cannonMy = this.originY+cannonLength
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
        this.length = 5
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
        this.Xprev
        this.Yprev
        
    }  
    
    render(Xi,Yi,length,degreeRad,direction,color){
        this.Xi = Xi
        this.Yi = Yi
        let missile = new Path2D()
        missile.moveTo(Xi, Yi)
        const missileXYf = generateAngledLineXY(this.Xi,this.Yi,length*scale,degreeRad,direction)
        missile.lineTo(missileXYf[0], missileXYf[1])
        missile.closePath()
        gameplayCtx.strokeStyle = color
        gameplayCtx.stroke(missile)
    }

    projectileMove(Xi,Yi,Vi,deg,dir){
        // let missile = new Path2D()
        let tStep = 0.005
      
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

        this.Vyi = this.Vi*Math.sin(this.Degi)-grav*this.t
        this.render(this.Xi,this.Yi,this.length,this.Degi,this.dir,"red")
        // iterate time step
        this.t = this.t + tStep
        //Calculate and assign next step projectile motion parameters
        this.Vyf = this.Vyi
        this.Xf = this.Xi+this.Vx*this.t+windVx*this.t
        this.Yf = this.Yi+this.Vyi*this.t-grav*Math.pow(this.t,2)/2+windVy*this.t
        // console.log(grav)
        this.Degi = Math.atan(this.Vyi/this.Vx*this.dir)
        this.Vi = Math.sqrt(Math.pow(this.Vyf,2)+Math.pow(this.Vx,2))
        this.Xprev=this.Xi
        this.Yprev=this.Yi
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
            bottom: this.y-this.side,
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
        triangle.closePath();
        
        // render triangle drawn
        gameplayCtx.strokeStyle = this.color
        gameplayCtx.stroke(triangle)

        hitBoxArr[2] = {
            top: this.y,
            left: this.x,
            right: this.x+this.side,
            bottom: this.y-this.side,
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
let gamespeed = 320 // 16 is 60 fps

let randWindInt
const randWindIntmax = 10000
const randWindIntmin = 3000
let windVx = 0
let windVy = 0
let windFlag = true

let menuFront = true
let winscreenFront = false
let gameplayZindex = 1
let explosionsZindex = 2
let guiZindex = 3
let menuZindex = 4 // in use
let winscreenZindex = 5 // in use
const hitBoxArr = ["","","",""]

// Create objects
let triangle = new TriangleTurrent(PlayerTriXPos/scale,gameFloor,side,PlayerTriColor,"triangle")
let square = new Turret(PlayerSqXPos/scale,gameFloor,side,PlayerSqColor,"square")
let SqCannon = new GenerateCannon(square.centerx,square.centery)
let TriCannon = new GenerateCannon(triangle.centerx,triangle.centery)
let TriShot = new projectile(TriCannon.cannonMx,TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
let SqShot = new projectile(SqCannon.cannonMx,SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)
let TriAngleHUD = new AngleHUD(triangle.centerx,triangle.centery,side)
let SqAngleHUD = new AngleHUD(square.centerx,square.centery,side)

//DOM CONTENT LOADED HERE
document.addEventListener("DOMContentLoaded", function(){
    // reset origins of all canvas to normal Cartisian coordinate system (origin at bottom left)
    
    MenuGameplaySwitchHandler("menu")
    
    const instructionTextArr = [
        "GunShapes",
        "",
        "Instructions:",
        "",
        "Press the start button above to start the game.",
        "Use w and s OR up/down arrow keys to aim. Press space bar to fire.",
        "The game will automatically switch between players after each shot."
    ]
    menuCtx.font = "20px Arial";
    menuCtx.textAlign = "center"
    menuCtx.fillStyle = "white"   
    for (i=0;i<instructionTextArr.length;i++){
        menuCtx.fillText(instructionTextArr[i], menuCanvas.width/2,menuCanvas.height/4+i*35)
    }
     
    gameplayCtx.translate(0,gameplayCanvas.height)
    gameplayCtx.scale(1,-1)
    gameplayCtx.save()

    explosionCtx.translate(0,explosionCanvas.height)
    explosionCtx.scale(1,-1)
    explosionCtx.save()

    guiCtx.translate(0,guiCanvas.height)
    guiCtx.scale(1,-1)
    guiCtx.save()
    guiCanvas.style.zIndex = guiZindex
    
    currCannon = TriCannon
    pauseState = false
    gameLoop()
    windGenerator()

    document.addEventListener("keydown", function(e){
    if (pauseState === false) {
            
            if (currentPlayer === "triangle"){
                currCannon = TriCannon
            } else if (currentPlayer === "square"){
                currCannon = SqCannon
            }
            const speed = 1

            switch(e.key) {
                case("w"):
                case("ArrowUp"):
                    currCannon.deg += speed
                    gameLoop()
                    break

                case("s"):
                case("ArrowDown"):
                    currCannon.deg -= speed
                    gameLoop()
                    break

                case(" "):
                    firedFlag = true
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
                    case("Escape" && winFlag === false):
                        pause(false)
                        console.log("Unpaused")
                    break  
                }
        }
    
    })
            

    
})

//FUNCTIONS BELOW HERE
function windGenerator(){
    let windVxmin = -10
    let windVxmax = 10
    let windVymin = -10
    let windVymax = 10
    randWindInt = randWindIntmin+Math.floor(Math.random()*(randWindIntmax-randWindIntmin))
    if (windFlag === true) {
        setTimeout(function(){
            windVx = windVxmin + Math.random()*(windVxmax-windVxmin)
            windVy = windVymin + Math.random()*(windVymax-windVymin)
            windGenerator()
        },randWindInt)
        
    }
}



function pause(arg){
    if (arg === true){
        pauseState = true
    } else if (arg === false) {
        pauseState = false
    }
   
}

function projFired() {


    if (firedFlag === true && collisionFlag === false) {

        if (currentPlayer === "triangle") {          
            TriShot.projectileMove(TriCannon.cannonMx, TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
            const a = collisionDetection(TriShot.Xprev,TriShot.Yprev,TriShot.Xf,TriShot.Yf)
            console.log("col det tri",a)

            pauseState = true     
        } else if (currentPlayer === "square"){
            SqShot.projectileMove(SqCannon.cannonMx, SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)
            const a = collisionDetection(SqShot.Xprev,SqShot.Yprev,SqShot.Xf, SqShot.Yf)
            pauseState = true    
            console.log("col det sq",a)
        }
        if (collisionFlag === false) {
        window.requestAnimationFrame(projFired)
        }
    }    
}

function gameLoop() {

    for (i=0;i<10;i++){
        if (pauseState === false){
            hitBoxArr[0] = {
                top: landscapeHeight,
                left: 0,
                right: gameplayCanvasWidth,
                bottom: 0,
                name: "land"
            }
            if (document.querySelectorAll("div.currentPlayerDiv").length>0){
            currentPlayerDiv.innerText = `Current Player: ${currentPlayer}`
            }
            gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            explosionCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            GenerateLandscape(landscapeHeight)
            square.renderTurret()
            triangle.renderTurret()
            if (currentPlayer === "triangle") {
                TriAngleHUD.render()
                TriAngleHUD.renderLastShotLine(TriShot.Degi,TriShot.dir)
            } else if (currentPlayer === "square") {
                SqAngleHUD.render()
                SqAngleHUD.renderLastShotLine(SqShot.Degi,SqShot.dir)
            }

            TriCannon.renderCannon(MouseCurrX,MouseCurrY)
            SqCannon.renderCannon(MouseCurrX,MouseCurrY)  
                       
        }
    }    
}

function drawExplosion(x,y){
    explosionCtx.beginPath()
    explosionCtx.arc(x,y,explosionRadius,0,2*pi)
    explosionCtx.fill()
}

function collisionDetection(Xi,Yi,Xf,Yf){
    let hitName =""
    let resolution = 100
    let Xstep = (Xf-Xi)/resolution
    let Ystep = (Yf-Yi)/resolution
    let Xcolcheck
    let Ycolcheck


    for (j=0;j<resolution;j++){
        if (collisionFlag === false) {

            Xcolcheck = Xi + Xstep*j
            Ycolcheck = Yi + Ystep*j

            hitBoxArr.forEach(function(i){
                const hitTop = Ycolcheck <= i.top
                const hitLeft = Xcolcheck >= i.left
                const hitRight = Xcolcheck <= i.right
                const hitbottom = Ycolcheck >= i.bottom


                if (hitTop === true && hitLeft === true && hitRight === true && hitbottom === true) {
                    collisionFlag = true
                    hitName = i.name

                }
            })

            if (Xcolcheck <= 0 || Xcolcheck >= gameplayCanvas.width){
                collisionFlag = true
                hitName = "sides"
            } 
        } else {
            j=resolution
        }
    }
    
    if (collisionFlag === true){           

        collisionFlag = true


        let currShot 
        if (currentPlayer === "triangle"){
            currShot = TriShot
        } else {
            currShot = SqShot
        }
        
        drawExplosion(Xcolcheck,Ycolcheck)
        
        if (hitName === "triangle" || hitName === "square"  ) {
            let winner = ""
            switch(hitName) {
                
                case("triangle"):
                    winner = "square"    
                    console.log(winner, "square wins")
                    
                    winFlag = true
                break

                case("square"):
                    winner = "triangle"    
                    console.log("triangle wins")
                    
                    winFlag = true
                break

            }
            console.log("pp poopoo")
            let winMessage = `${winner} Wins!`
            winscreenHandler()
            winCtx.font = "40px Arial";
            winCtx.textAlign = "center"
            winCtx.fillStyle = "black"
            winCtx.fillText(winMessage, winCanvas.width/2,winCanvas.height/2)
            // gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            // explosionCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
            
            
        } else {
            setTimeout(function (){
                if(winFlag === false){
                    gameplayCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
                    explosionCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
                    TriShot = new projectile(TriCannon.cannonMx,TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
                    SqShot = new projectile(SqCannon.cannonMx,SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)

                    playerSwitch(currentPlayer)

                    pauseState = false
                    firedFlag = false
                    collisionFlag = false
                    gameLoop()
                
                } 
            },1000)
        }
    }    
}

//player switcher
function playerSwitch(cPlayer){
    if (cPlayer === "triangle") {
        currentPlayer = "square"
        currentPlayerDiv.innerText = `Current Player: ${currentPlayer}`


    } else if(cPlayer === "square") {
        currentPlayer = "triangle"
        currentPlayerDiv.innerText = `Current Player: ${currentPlayer}`


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

function MenuGameplaySwitchHandler(){
    if (menuFront === true) {
        pause(true)
        menuCanvas.style.zIndex = menuZindex

        while(gameplayMenu.firstChild) {
            gameplayMenu.firstChild.remove()
        }

        returnMenuDiv.innerText = "start game"
        returnMenuDiv.classList.add("start-ReturnMenu")

        returnMenuDiv.addEventListener("click", function(){
            menuFront= false
            reset()
            MenuGameplaySwitchHandler()
        })

        gameplayMenu.append(returnMenuDiv)

    } else if (menuFront === false) {
        pause(false)
        menuCanvas.style.zIndex = menuZindex*-1

        while(gameplayMenu.firstChild) {
            gameplayMenu.firstChild.remove()

        }

        returnMenuDiv.innerText = "Return to Menu"
        returnMenuDiv.classList.add("start-ReturnMenu")
        returnMenuDiv.addEventListener("click", function(){
            menuFront= true
            reset()
            MenuGameplaySwitchHandler()
        })

        gameplayMenu.append(currentPlayerDiv)

        currentPlayerDiv.innerText = "Current Player: triangle"
        currentPlayerDiv.classList.add("current-Player")
        gameplayMenu.append(returnMenuDiv)
        
    }

}

function winscreenHandler(){
    winCtx.clearRect(0,0,winCanvas.width,winCanvas.height)
    pause(true)
    winCanvas.style.zIndex = winscreenZindex

    while(gameplayMenu.firstChild) {
        gameplayMenu.firstChild.remove()
    }

    replayDiv.innerText = "Play Another Game"
    replayDiv.classList.add("start-ReturnMenu")
    replayDiv.addEventListener("click", function(){
        winCanvas.style.zIndex = winscreenZindex*-1
        menuFront = false
        MenuGameplaySwitchHandler()
        reset()
        
    })
    gameplayMenu.append(replayDiv)


    returnMenuDiv.innerText = "Return to Menu"
    returnMenuDiv.classList.add("start-ReturnMenu")

    returnMenuDiv.addEventListener("click", function(){
        winCanvas.style.zIndex = winscreenZindex*-1
        menuFront = true
        MenuGameplaySwitchHandler()
        reset()
        
    })

    gameplayMenu.append(returnMenuDiv)
    
}

function reset() {
    GenerateLandscape()
    firedFlag = false
    winFlag = false
    collisionFlag = false
    pauseState = false
    currentPlayer = "triangle"
    triangle = new TriangleTurrent(PlayerTriXPos/scale,gameFloor,side,PlayerTriColor,"triangle")
    square = new Turret(PlayerSqXPos/scale,gameFloor,side,PlayerSqColor,"square")
    SqCannon = new GenerateCannon(square.centerx,square.centery)
    TriCannon = new GenerateCannon(triangle.centerx,triangle.centery)
    TriShot = new projectile(TriCannon.cannonMx,TriCannon.cannonMy,projSpeed,TriCannon.truDeg,TriCannon.dir)
    SqShot = new projectile(SqCannon.cannonMx,SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)
    gameLoop()
}