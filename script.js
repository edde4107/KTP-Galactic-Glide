const spaceship = document.getElementById("spaceship");
const background = document.getElementById("background");
const mapIndicator = document.getElementById("map-indicator");

let posX = 200;
let posY = 920;
let velocityX = 0;
let velocityY = 0;
let acceleration = 0.3;
let deceleration = 0.05;
let maxSpeed = 3.5;
let angle = -90;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

// Prevent page scrolling with arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
    event.preventDefault();
  }
});

// Detect Enter key for cluster interaction (optional)
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Add any interaction logic here if needed
  }
});

function checkClusters() {
  const clusters = document.querySelectorAll('.cluster');

  clusters.forEach((cluster) => {
    // Get the cluster's position relative to the #background element
    const clusterRect = cluster.getBoundingClientRect();
    const backgroundRect = background.getBoundingClientRect();

    // Calculate the cluster's center position relative to the #background
    const clusterX = clusterRect.left - backgroundRect.left + clusterRect.width / 2;
    const clusterY = clusterRect.top - backgroundRect.top + clusterRect.height / 2;

    // Calculate distance between spaceship and cluster center
    const distance = Math.sqrt((posX - clusterX) ** 2 + (posY - clusterY) ** 2);

    // If spaceship is near the cluster, activate it
    if (distance < 300) { // Increased collision box size
      cluster.classList.add('active');
    } else {
      cluster.classList.remove('active');
    }
  });
}

function update() {
  // Rotation logic
  if (keys.ArrowLeft) angle -= 3;
  if (keys.ArrowRight) angle += 3;

  // Thrust logic
  if (keys.ArrowUp) {
    const radians = (angle * Math.PI) / 180;
    velocityX += Math.cos(radians) * acceleration;
    velocityY += Math.sin(radians) * acceleration;

    // Cap the speed
    const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    if (speed > maxSpeed) {
      velocityX *= maxSpeed / speed;
      velocityY *= maxSpeed / speed;
    }
  }

  // Apply friction when no keys are pressed
  if (!keys.ArrowUp && !keys.ArrowDown) {
    velocityX *= 1 - deceleration;
    velocityY *= 1 - deceleration;
  }

  // Deceleration (brake) logic
  if (keys.ArrowDown) {
    velocityX *= 1 - deceleration;
    velocityY *= 1 - deceleration;
  }

  // Update spaceship position
  posX += velocityX;
  posY += velocityY;

  // Constrain spaceship within the background
  posX = Math.max(0, Math.min(4000, posX)); // Adjusted for new background width
  posY = Math.max(0, Math.min(1746, posY));

  // Update spaceship position in the DOM
  spaceship.style.left = `${posX}px`;
  spaceship.style.top = `${posY}px`;
  spaceship.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;

  // Scroll background to follow spaceship
  const viewportX = Math.max(0, Math.min(posX - window.innerWidth / 2, 4000 - window.innerWidth));
  const viewportY = Math.max(0, Math.min(posY - window.innerHeight / 2, 1746 - window.innerHeight));
  background.style.transform = `translate(${-viewportX}px, ${-viewportY}px)`;

  // Update minimap
  const mapScaleX = 200 / 4000; // Adjusted for new background width
  const mapScaleY = 100 / 1746;
  mapIndicator.style.left = `${posX * mapScaleX}px`;
  mapIndicator.style.top = `${posY * mapScaleY}px`;

  // Check for clusters and animate them
  checkClusters();

  requestAnimationFrame(update);
}

// Start the game loop
update();