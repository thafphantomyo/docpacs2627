const canvasElement = document.getElementById("gameCanvas")
const context = canvasElement.getContext("2d")
const player = {
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    speed: 10,
}

const keys = {};

function drawPlayer() {
    context.fillStyle = "blue"
    context.fillRect(
        player.x,
        player.y,
        player.width,
        player.height 
    )
}



function animLoop(){
    context.clearRect(0, 0, canvasElement.width, canvasElement.height)
    movePlayer()
    drawPlayer()
    requestAnimationFrame(animLoop)
}

window.addEventListener("keydown", function(e) {
    keys[e.key] = true
})

window.addEventListener("keyup", function(e) {
    keys[e.key] = false
})


function movePlayer(){
    if (keys["w"] || keys["ArrowUp"]) {
        player.y -= player.speed
    }

    if(keys["s"] || keys["ArrowDown"]) {
        player.y += player.speed
    }
    
    if(keys["a"] || keys["ArrowLeft"]) {
        player.x -= player.speed
    }

    if(keys["d"] || keys["ArrowRight"]) {
        player.x += player.speed
    }
}

function canvasBorder(){
    
}

animLoop()