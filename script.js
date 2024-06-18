// Get the canvas element
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions
canvas.width = window.innerWidth - 22;
canvas.height = window.innerHeight - 22;

// Define the player
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.swinging = true;
    this.wireLength = 100;
    this.angle = 0;
    this.speed = 0.01;
    this.maxAngle = Math.PI / 3; // 60 degrees
    this.hasWire = true;
    this.momentum = 0;
    this.wireExtending = false;
    this.wireExtensionLength = 0;
  }

  update() {
    if (this.swinging) {
      this.angle += this.speed;
      if (this.angle > this.maxAngle) {
        this.speed = -this.speed;
      } else if (this.angle < -this.maxAngle) {
        this.speed = -this.speed;
      }
      this.x = canvas.width / 2 + Math.sin(this.angle) * this.wireLength;
      this.y = this.wireLength + Math.cos(this.angle) * this.wireLength;
    } else {
      this.x += this.momentum;
      this.y += 2; // Add a small amount to the player's y-coordinate
      if (this.wireExtending) {
        this.wireExtensionLength += 5;
        if (this.wireExtensionLength >= this.y) {
          this.wireExtending = false;
          this.swinging = true;
          this.hasWire = true;
          this.wireLength = this.y;
          this.angle = 0;
          this.speed = 0.01;
          this.momentum = 0;
        }
      }
    }
  }
}

// Create a new player
const player = new Player(canvas.width / 2, canvas.height / 2);

// Function to draw the player character
function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'black';
  ctx.fill();

  // Draw the stick figure body
  ctx.beginPath();
  ctx.moveTo(player.x, player.y + player.radius);
  ctx.lineTo(player.x, player.y + player.radius * 2);
  ctx.lineTo(player.x - player.radius, player.y + player.radius * 3);
  ctx.lineTo(player.x + player.radius, player.y + player.radius * 3);
  ctx.lineTo(player.x, player.y + player.radius * 2);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Function to draw the wire
function drawWire() {
  if (player.hasWire) {
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(canvas.width / 2, 0);
    ctx.stroke();
  } else if (player.wireExtending) {
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x, player.y - player.wireExtensionLength);
    ctx.stroke();
  }
}

// Event listener for mouse click
canvas.addEventListener('click', () => {
  if (player.hasWire) {
    player.hasWire = false;
    player.swinging = false;
    player.momentum = 2;
  } else if (!player.wireExtending) {
    player.momentum = 0;
    player.wireExtending = true;
    player.wireExtensionLength = 0;
  }
});

// Main game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawWire();
  player.update();
  requestAnimationFrame(animate);
}

animate();
