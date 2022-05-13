//FETCH DOM ELEMENTS
const menuElements = document.querySelectorAll(".menu")
const gameplayMenu = document.querySelector("#gameplayMenu")
const startButton = document.querySelector("#start-Button")



const returnMenuDiv = document.createElement("div")
const currentPlayerDiv = document.createElement("div")
const replayDiv = document.createElement("div")
const windSelectDiv = document.createElement("div")



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

const weatherCanvas = document.querySelector("#weather-canvas")
const weatherCtx = weatherCanvas.getContext("2d")
weatherCanvas.setAttribute("height", getComputedStyle(weatherCanvas)["height"])
weatherCanvas.setAttribute("width", getComputedStyle(weatherCanvas)["width"])









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
        this.deg = cannonStartingAngle // degrees
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
    cannon.lineJoin = "round"
    gameplayCtx.shadowColor = "white"
    gameplayCtx.shadowBlur = 3;
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
        
        if (showProjTrail === false) {
        
            explosionCtx.clearRect(0,0,gameplayCanvas.width,gameplayCanvas.height)
            
        }
        explosionCtx.save()
        this.Xi = Xi
        this.Yi = Yi
        let missile = new Path2D()
        missile.moveTo(Xi, Yi)
        const missileXYf = generateAngledLineXY(this.Xi,this.Yi,projsize*scale,degreeRad,direction)
        missile.lineTo(missileXYf[0], missileXYf[1])
        explosionCtx.shadowColor = "white"
        explosionCtx.shadowBlur = 10;
        // explosionCtx.shadowOffsetX = this.Xi+5;
        // explosionCtx.shadowOffsetY = this.Yi+5;
        missile.closePath()

        explosionCtx.strokeStyle = color
        explosionCtx.stroke(missile)
        explosionCtx.restore()
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
let PlayerTriColor = "white"
let PlayerSqXPos = (gameplayCanvas.width*scale-PlayerTriXPos)
let PlayerSqColor = PlayerTriColor
let cannonStartingAngle = 80
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
let projSpeed = 150
let winFlag = false
let collisionFlag = false
let explosionRadius = 10
let explosionColor = "white"
let showProjTrail = false
let projsize = 30
const projs = []
let gamespeed = 320

// wind variables
const windImage = new Image()
windImage.src = "./imgs/windImg.jpg"
let windImgsize = 100
let windIndX = weatherCanvas.width/2-windImgsize/2
let windIndY = weatherCanvas.height*0.01
angleRad = 0
windAng = 0 
windinit = true
let randWindInt
const randWindIntmax = 10000
const randWindIntmin = 3000
let windVx = 0
let windVy = 0
let windFlag = false
let windArrowLength = 100

//menu and gameover flags
let menuFront = true
let winscreenFront = false

//Z-index variables
let gameplayZindex = 1
let guiZindex = 2
let explosionsZindex = 3
let menuZindex = 4 // in use
let winscreenZindex = 5 // in use
let weatherZindex = 3 //in use
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
       
    MenuGameplaySwitchHandler("menu")

    windSelectDiv.addEventListener("click", function(){
        if (windFlag === false){
            windSelectDiv.innerText = "Wind On"
            windFlag = true
            console.log("wind now on")
        } else  {
            windSelectDiv.innerText = "Wind Off"
            windFlag = false
            console.log("wind now off")
        }
    })
    
    const instructionTextArr = [
        "GunShapes",
        "",
        "Instructions:",
        "",
        "Press the start button above to start the game.",
        "Use w and s OR up/down arrow keys to aim. Press space bar to fire.",
        "The game will automatically switch between players after each shot."
    ]
    menuCtx.font = "20px Helvetica";
    menuCtx.textAlign = "center"
    menuCtx.fillStyle = "white"   
    for (i=0;i<instructionTextArr.length;i++){
        menuCtx.fillText(instructionTextArr[i], menuCanvas.width/2,menuCanvas.height/4+i*35)
    }
    menuCtx.beginPath()
    menuCtx.strokeStyle = "white"
    menuCtx.shadowColor = "white"
    menuCtx.shadowBlur = 5
    menuCtx.lineJoin = "round"
    menuCtx.lineWidth = 10
    menuCtx.strokeRect(menuCanvas.width/8,menuCanvas.height/8,menuCanvas.width*0.75,menuCanvas.height*0.75)
    menuCtx.closePath() 

    gameplayCtx.translate(0,gameplayCanvas.height)
    gameplayCtx.scale(1,-1)
    gameplayCtx.save()

    explosionCtx.translate(0,explosionCanvas.height)
    explosionCtx.scale(1,-1)
    explosionCtx.save()

    guiCtx.translate(0,guiCanvas.height)
    guiCtx.scale(1,-1)
    guiCtx.save()
    console.log("gui z:",guiZindex)
    guiCanvas.style.zIndex = guiZindex
    guiCtx.globalCompositeOperation = "source-over"

    weatherCanvas.style.zIndex = weatherZindex

    currCannon = TriCannon
    pauseState = false
    gameLoop()
    
    
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


let windtimerInt
//FUNCTIONS BELOW HERE
function renderWindIndicator(windang){
    if (windFlag === true ) {
    windang = windang*-1
    weatherCtx.save()
    weatherCtx.clearRect(0,0,weatherCanvas.width,weatherCanvas.height)
    weatherCtx.translate(windIndX+windImgsize/2,windIndY+windImgsize/2)
    weatherCtx.rotate(windang)
    weatherCtx.drawImage(windImage,-windImgsize/2,-windImgsize/2,windImgsize,windImgsize)
    weatherCtx.restore()
    // weatherCtx.rotate(-1*windang)
    // weatherCtx.translate(-windIndX-windImgsize/2,-windIndY-windImgsize/2)
    }
    console.log("meep")

}

function generateWind(){
    if (windFlag === true ) {
            let windVxmin = -10
            let windVxmax = 10
            let windVymin = -5
            let windVymax = 5
            randWindInt = randWindIntmin+Math.floor(Math.random()*(randWindIntmax-randWindIntmin))
            windVx = windVxmin + Math.random()*(windVxmax-windVxmin)
            windVy = windVymin + Math.random()*(windVymax-windVymin)
            console.log("windtimerInt:",randWindInt)
            console.log("windVx:",windVx)
            console.log("windVy:",windVy)

            if (windVx > 0 && windVy > 0 ) {
                //quad 1
                angleRad = Math.atan(windVy/windVx)
            } else if (windVx < 0 && windVy > 0 ) {
                // quad2
                angleRad = Math.atan(windVy/windVx)*-1 + convertDegtoRad(90)
            } else if (windVx < 0 && windVy < 0 ) {
                // quad3
                angleRad = Math.atan(windVy/windVx) + convertDegtoRad(180)
            } else if (windVx > 0 && windVy < 0 ) {
                // quad4
                angleRad = Math.atan(windVy/windVx)*-1 + convertDegtoRad(270)
            }
            
            return angleRad
        } else {
            windVx=0
            windVy=0
        }
}

function windHandler() {
    let windang = generateWind()
    renderWindIndicator(windang)
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
            pauseState = true     
        } else if (currentPlayer === "square"){
            SqShot.projectileMove(SqCannon.cannonMx, SqCannon.cannonMy,projSpeed,SqCannon.truDeg,SqCannon.dir)
            const a = collisionDetection(SqShot.Xprev,SqShot.Yprev,SqShot.Xf, SqShot.Yf)
            pauseState = true    
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
            currentPlayerDiv.innerText = `Current Player: ${capitalizeFirstLetter(currentPlayer)}`
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

function drawExplosion(x,y,color){
    explosionCtx.save()
    explosionCtx.beginPath()
    explosionCtx.fillStyle = color
    explosionCtx.shadowColor = "white"
    explosionCtx.shadowBlur = 10;
    explosionCtx.arc(x,y,explosionRadius,0,2*pi)
    explosionCtx.fill()
    explosionCtx.restore()
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
        explosionCtx.clearRect(0,0,gameplayCanvasWidth,gameplayCanvasHeight)
        drawExplosion(Xcolcheck,Ycolcheck,explosionColor)
        
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
            let winMessage = `${capitalizeFirstLetter(winner)} Wins!`
            
            winscreenHandler()
            winCtx.font = "40px Arial";
            winCtx.textAlign = "center"
            winCtx.fillStyle = "white"
            winCtx.fillText(winMessage, winCanvas.width/2,winCanvas.height/2-30)
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
        currentPlayerDiv.innerText = `Current Player: ${capitalizeFirstLetter(currentPlayer)}`

    } else if(cPlayer === "square") {
        currentPlayer = "triangle"
        currentPlayerDiv.innerText = `Current Player: ${capitalizeFirstLetter(currentPlayer)}`
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
    gameplayCtx.fillStyle = "brown"
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

let windsetTout = 0
let windsetTrecurv = 0


function MenuGameplaySwitchHandler(){
    if (menuFront === true) {
        pause(true)
        menuCanvas.style.zIndex = menuZindex

        while(gameplayMenu.firstChild) {
            gameplayMenu.firstChild.remove()
        }

        if (windFlag === false) {
            windSelectDiv.innerText = "Wind Off"
        } else {
            windSelectDiv.innerText = "Wind On"
        }
        
        windSelectDiv.classList.add("menuDivStyler")
        windSelectDiv.classList.add("start-ReturnMenu")
        gameplayMenu.append(windSelectDiv)
        


        returnMenuDiv.addEventListener("click", function(){
            menuFront= false
            reset()
            // windGenerator()
            MenuGameplaySwitchHandler()
            
            windHandler()
            
            if (windFlag === true ) {
                // windsetTstart = setTimeout(function windy(){
                //     windHandler()
                //     // console.log("wind set t start")
                //     // console.log("windtimerInt in setTimeout:",randWindInt)
                    
                //     windsetTrecurv = setTimeout(windy,randWindInt)
                // },randWindInt)

                
                windsetTstart = setInterval(windHandler,10000)
                


            } else {
                clearTimeout(windsetTstart)
                clearTimeout(windsetTrecurv)
                windsetTout = 0
                windsetTrecurv = 0      

                weatherCtx.clearRect(0,0,weatherCanvas.width,weatherCanvas.height)
            }
        })
        
        returnMenuDiv.innerText = "start game"
        returnMenuDiv.classList.add("start-ReturnMenu")
        returnMenuDiv.classList.add("menuDivStyler")
        returnMenuDiv.classList.remove("gameplayDivStyler")
        returnMenuDiv.classList.remove("gameoverDivStyler")
        gameplayMenu.append(returnMenuDiv)

    } else if (menuFront === false) {
        pause(false)
        menuCanvas.style.zIndex = menuZindex*-1

        while(gameplayMenu.firstChild) {
            gameplayMenu.firstChild.remove()
        }

        returnMenuDiv.innerText = "Return to Menu"
        returnMenuDiv.classList.add("start-ReturnMenu")
        returnMenuDiv.classList.remove("menuDivStyler")
        returnMenuDiv.classList.remove("gameoverDivStyler")
        returnMenuDiv.classList.add("gameplayDivStyler")
        returnMenuDiv.addEventListener("click", function(){
            menuFront= true
            reset()
            MenuGameplaySwitchHandler()
        })

        gameplayMenu.append(currentPlayerDiv)

        currentPlayerDiv.innerText = "Current Player: Triangle"
        currentPlayerDiv.classList.add("current-Player")
        currentPlayerDiv.classList.add("infoHUDStyler")
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
    replayDiv.classList.add("gameoverDivStyler")
    replayDiv.addEventListener("click", function(){
        winCanvas.style.zIndex = winscreenZindex*-1
        menuFront = false
        MenuGameplaySwitchHandler()
        reset()
    })
    gameplayMenu.append(replayDiv)


    returnMenuDiv.innerText = "Return to Menu"
    returnMenuDiv.classList.add("start-ReturnMenu")
    returnMenuDiv.classList.add("gameoverDivStyler")

    returnMenuDiv.addEventListener("click", function(){
        winCanvas.style.zIndex = winscreenZindex*-1
        menuFront = true
        MenuGameplaySwitchHandler()
        reset()
        
    })

    gameplayMenu.append(returnMenuDiv)
    
}

function reset() {
    GenerateLandscape(landscapeHeight)
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  