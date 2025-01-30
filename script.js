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

// document.addEventListener("keydown", (event) => {
//   if (event.key === "Enter") {
//     // add interaction??
//   }
// });

function checkClusters() {
  const clusters = document.querySelectorAll('.cluster');

  clusters.forEach((cluster) => {
    // cluster position relative to background
    const clusterRect = cluster.getBoundingClientRect();
    const backgroundRect = background.getBoundingClientRect();

    // cluster center relative to background
    const clusterX = clusterRect.left - backgroundRect.left + clusterRect.width / 2;
    const clusterY = clusterRect.top - backgroundRect.top + clusterRect.height / 2;

    // distance between spaceship and cluster center
    const distance = Math.sqrt((posX - clusterX) ** 2 + (posY - clusterY) ** 2);

    // if spaceship near cluster -> activate cluster
    if (distance < 350) {
      cluster.classList.add('active');
    } else {
      cluster.classList.remove('active');
    }
  });
}

function update() {
  //rotation
  if (keys.ArrowLeft) angle -= 3;
  if (keys.ArrowRight) angle += 3;

  // thrust logic (me & yo mom)
  if (keys.ArrowUp) {
    const radians = (angle * Math.PI) / 180;
    velocityX += Math.cos(radians) * acceleration;
    velocityY += Math.sin(radians) * acceleration;

    const speed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
    if (speed > maxSpeed) {
      velocityX *= maxSpeed / speed;
      velocityY *= maxSpeed / speed;
    }
  }

  // friction when no keys are pressed
  // originally it was 0 gravity but I had my manager test it and it made more sense for the user if the ship stops
  if (!keys.ArrowUp && !keys.ArrowDown) {
    velocityX *= 1 - deceleration;
    velocityY *= 1 - deceleration;
  }

  // Deceleration (brake) logic
  // (consider changing this to let it move in reverse)
  if (keys.ArrowDown) {
    velocityX *= 1 - deceleration;
    velocityY *= 1 - deceleration;
  }

  // spaceship position
  posX += velocityX;
  posY += velocityY;

  // Constrain spaceship within the background
  // note from elle (maybe make the ship blow up if it collides with an edge)
  posX = Math.max(0, Math.min(4000, posX));
  posY = Math.max(0, Math.min(1746, posY));

  // update ship position
  spaceship.style.left = `${posX}px`;
  spaceship.style.top = `${posY}px`;
  spaceship.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;

  // Scroll background to follow spaceship 
  // rn the background is just black so we gonna have to figure out something better
  const viewportX = Math.max(0, Math.min(posX - window.innerWidth / 2, 4000 - window.innerWidth));
  const viewportY = Math.max(0, Math.min(posY - window.innerHeight / 2, 1746 - window.innerHeight));
  background.style.transform = `translate(${-viewportX}px, ${-viewportY}px)`;

  // update minimap
  const mapScaleX = 200 / 4000;
  const mapScaleY = 100 / 1746;
  mapIndicator.style.left = `${posX * mapScaleX}px`;
  mapIndicator.style.top = `${posY * mapScaleY}px`;

  // check for clusters and animate if needed
  checkClusters();

  requestAnimationFrame(update);
}

update();