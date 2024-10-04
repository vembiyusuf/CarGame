const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Colors
const gray = '#A0A0A0';
const green = '#4CD038';
const yellow = '#FFE800';
const white = '#FFFFFF';
const red = '#FF0000';

// Road and marker sizes
const roadWidth = 300;
const markerWidth = 10;
const markerHeight = 50;

// Lane coordinates
const leftLane = 150;
const centerLane = 250;
const rightLane = 350;
const lanes = [leftLane, centerLane, rightLane];

// Player starting position
let playerX = 250;
let playerY = 400;

// Game settings
let speed = 2;
let score = 0;
let gameover = false;
let laneMarkerMoveY = 0;

// Vehicles
const vehicleImages = [];
const vehicleFilenames = ['pickup_truck.png', 'semi_trailer.png', 'taxi.png', 'van.png'];
let vehicles = [];

// Load images
vehicleFilenames.forEach(filename => {
    const img = new Image();
    img.src = 'images/' + filename;
    vehicleImages.push(img);
});

const playerImage = new Image();
playerImage.src = 'images/car.png';

// Handle player movement
document.addEventListener('keydown', function (event) {
    if (!gameover) {
        if (event.key === 'ArrowLeft' && playerX > leftLane) {
            playerX -= 100;
        } else if (event.key === 'ArrowRight' && playerX < rightLane) {
            playerX += 100;
        }
    }
});

// Game loop
function gameLoop() {
    if (!gameover) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

function update() {
    laneMarkerMoveY += speed * 2;
    if (laneMarkerMoveY >= markerHeight * 2) {
        laneMarkerMoveY = 0;
    }

    // Move vehicles
    vehicles.forEach(vehicle => {
        vehicle.y += speed;

        // Remove vehicles out of screen
        if (vehicle.y > canvas.height) {
            vehicles.splice(vehicles.indexOf(vehicle), 1);
            score++;

            if (score % 5 === 0) {
                speed += 1;
            }
        }
    });

    // Add new vehicle
    if (vehicles.length < 2 && Math.random() < 0.02) {
        const lane = lanes[Math.floor(Math.random() * lanes.length)];
        const vehicleImage = vehicleImages[Math.floor(Math.random() * vehicleImages.length)];
        vehicles.push({ x: lane, y: -50, image: vehicleImage });
    }

    // Check for collisions
    vehicles.forEach(vehicle => {
        if (Math.abs(playerX - vehicle.x) < 45 && Math.abs(playerY - vehicle.y) < 45) {
            gameover = true;
        }
    });
}

function draw() {
    // Draw grass
    ctx.fillStyle = green;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road
    ctx.fillStyle = gray;
    ctx.fillRect(100, 0, roadWidth, canvas.height);

    // Draw edge markers
    ctx.fillStyle = yellow;
    ctx.fillRect(95, 0, markerWidth, canvas.height);
    ctx.fillRect(395, 0, markerWidth, canvas.height);

    // Draw lane markers
    for (let y = -markerHeight * 2; y < canvas.height; y += markerHeight * 2) {
        ctx.fillStyle = white;
        ctx.fillRect(leftLane + 45, y + laneMarkerMoveY, markerWidth, markerHeight);
        ctx.fillRect(centerLane + 45, y + laneMarkerMoveY, markerWidth, markerHeight);
    }

    // Draw player's car
    ctx.drawImage(playerImage, playerX - 22, playerY - 22, 45, 90);

    // Draw vehicles
    vehicles.forEach(vehicle => {
        ctx.drawImage(vehicle.image, vehicle.x - 22, vehicle.y - 22, 45, 90);
    });

    // Display score
    ctx.fillStyle = white;
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawGameOver() {
    ctx.fillStyle = red;
    ctx.fillRect(0, 50, canvas.width, 100);

    ctx.fillStyle = white;
    ctx.font = '20px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 50, 100);
}

// Start the game
gameLoop();
