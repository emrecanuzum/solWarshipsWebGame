const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color

    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile{
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy{
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        var img = new Image(); 
        img.src = 'ss1.png';
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
//const xcor = canvas.width / 2
//const ycor = canvas.height / 2


const player = new Player(
    canvas.width / 2, canvas.height / 2, 
    40, 'black')
player.draw()

const projectiles = []
const enemies = []
function spawnEnemies() {
    setInterval(() =>{
        const radius = Math.random() * (40 - 10) + 10

        let x
        let y 

        if(Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }

        else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        
        
        const color = 'grey'

        const angle = Math.atan2(
            canvas.height / 2 - y ,
            canvas.width / 2 - x
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
        console.log(enemies)
   }, 1000)
}

let animationId

function anime() {
    animationId = requestAnimationFrame(anime)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach(function (projectile, index) {
            projectile.update();
            //remove from edges of screen
            if (
                projectile.x + projectile.radius < 0 || 
                projectile.x - projectile.radius > canvas.width ||
                projectile.y + projectile.radius < 0 ||
                projectile.y - projectile.radius > canvas.height
            ) {
                setTimeout(() => {
                    projectiles.splice(index, 1)
                   }, 0)
              }
        })
 
    enemies.forEach((enemy, index) => {
        enemy.update()
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        //end of game
        if(distance - enemy.radius - player.radius < 1) {
               cancelAnimationFrame(animationId)
            }


        projectiles.forEach( (projectile, projectileIndex)=> {
           const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

           //object touchtss
           if(distance - enemy.radius - projectile.radius < 1) 
           {
               setTimeout(() => {
                enemies.splice(index, 1)
                projectiles.splice(projectileIndex, 1)
               }, 0)
             
           }
        })
    })
}
addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(
        new Projectile(
        canvas.width / 2, canvas.height / 2,
        5, 'red', velocity)
    )
})
anime()
spawnEnemies()

