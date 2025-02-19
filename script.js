let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
c.imageSmoothingEnabled = false
class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(that) {
        return new Vector2(this.x + that.x, this.y + that.y)
    }
    multiply(that) {
        return new Vector2(this.x * that, this.y * that)
    }
}
function drawRect(pos, dim, r, g, b, a) {
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillRect(pos.x, pos.y, dim.x, dim.y)
}

function drawLine(list, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
}

function drawPoly(list, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.moveTo(list[0].x, list[0].y)
    for (let i of list) {
        c.lineTo(i.x, i.y)
    }
    c.stroke()
    c.fill()
}

function drawArc(pos, rad, sa, ea, clock, r, g, b, a) {
    c.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.beginPath()
    c.arc(pos.x, pos.y, rad, sa, ea, !clock)
    c.stroke()
    c.fill()
}

function drawImg(img, cropPos, cropDim, pos, dim) {
    c.drawImage(img, cropPos.x, cropPos.y, cropDim.x, cropDim.y, pos.x, pos.y, dim.x, dim.y)
}

function write(text, pos, r, g, b, a) {
    c.font = '20px Arial'
    c.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    c.fillText(text, pos.x, pos.y)
}
function clear() {
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
}

class Player {
    constructor(pos, health, damage, type) {
        this.pos = pos
        this.health = health
        this.damage = damage
        this.type = type
    }
}

class Attack {
    constructor(pos, damage) {
        this.pos = pos
        this.damage = damage
        setTimeout(function() {
            attacks.splice(0, 1)
        }, 1000)
    }
}

class Enemy {
    constructor(pos, health, damage, speed) {
        this.pos = pos
        this.health = health
        this.damage = damage
        this.speed = speed
        this.target
    }
}

let player = new Player(new Vector2(6, 3), 100, 1, 'sword')

let tilemap = []
let tilemapRelativePos = {pos: new Vector2(0, 0)}
for (let y = 0; y < 10; y++) {
    tilemap[y] = []
    for (let x = 0; x < 10; x++) {
        tilemap[y][x] = (x + y) % 2
    }
}
let attacks = []
let all = [player, tilemapRelativePos].concat(attacks)
let mouse = new Vector2(0, 0)
document.addEventListener("keydown", function(event) {
    if (event.key == 'w') {
        player.pos.y -= 1
        for (let i of all) {
            i.pos.y += 1
        }
    }
    if (event.key == 'a') {
        player.pos.x -= 1
        for (let i of all) {
            i.pos.x += 1
        }
    }
    if (event.key == 's') {
        player.pos.y += 1
        for (let i of all) {
            i.pos.y -= 1
        }
    }
    if (event.key == 'd') {
        player.pos.x += 1
        for (let i of all) {
            i.pos.x -= 1
        }
    }
})
document.addEventListener("mousemove", function(event) {
    mouse.x = event.clientX
    mouse.y = event.clientY
})
document.addEventListener("click", function(event) {
    mouse.x = event.clientX
    mouse.y = event.clientY
    //attack
    let dir = new Vector2(0, 0)
    if (mouse.x < (player.pos.x+0.5)*100 && Math.abs(mouse.y - (player.pos.y+0.5)*100) < Math.abs(mouse.x - (player.pos.x+0.5)*100)) {
        dir = new Vector2(-1, 0)
    }
    if (mouse.x > (player.pos.x+0.5)*100 && Math.abs(mouse.y - (player.pos.y+0.5)*100) < Math.abs(mouse.x - (player.pos.x+0.5)*100)) {
        dir = new Vector2(1, 0)
    }
    if (mouse.y < (player.pos.y+0.5)*100 && Math.abs(mouse.y - (player.pos.y+0.5)*100) > Math.abs(mouse.x - (player.pos.x+0.5)*100)) {
        dir = new Vector2(0, -1)
    }
    if (mouse.y > (player.pos.y+0.5)*100 && Math.abs(mouse.y - (player.pos.y+0.5)*100) > Math.abs(mouse.x - (player.pos.x+0.5)*100)) {
        dir = new Vector2(0, 1)
    }

    attacks.push(new Attack(new Vector2(player.pos.x + 0.25, player.pos.y + 0.25).add(dir), player.damage))
})
function draw() {
    clear()
    for (let y = 0; y < tilemap.length; y++) {
        for (let x = 0; x < tilemap.length; x++) {
            drawRect(new Vector2(x+tilemapRelativePos.pos.x, y+tilemapRelativePos.pos.y).multiply(100), new Vector2(1, 1).multiply(100), 0, (+!tilemap[y][x])*255, tilemap[y][x]*255, 1)
        }
    }
    for (let i of attacks) {
        drawRect(i.pos.multiply(100), new Vector2(50, 50), 255, 0, 0, 1)
    }
    drawRect(player.pos.multiply(100), new Vector2(1, 1).multiply(100), 0, 0, 0, 1)
}
function run() {
    draw()
    for (let i of attacks) {
        // update code
    }
}
setInterval(run, 1)
