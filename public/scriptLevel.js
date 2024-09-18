//------------------------------------ music player --------------------------------------------------
const musicPlayer = document.getElementById("musicPlayer");
const buttonPreviousTrack = document.getElementById("previous-track");
const buttonNextTrack = document.getElementById("next-track");
const tracks = ["jazz", "original", "epic", "ending", "2"];
let currentTrack = 0;

function playTrack() {
  musicPlayer.src = "../assets/sounds/pvz-" + tracks[currentTrack] + ".mp3";
  musicPlayer.load();
  musicPlayer.play();
}
function NextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  playTrack();
}
function PreviousTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  playTrack();
}

buttonPreviousTrack.addEventListener("click", PreviousTrack);
buttonNextTrack.addEventListener("click", NextTrack);

//------------------------------------ sun system --------------------------------------------------
const sun_counter = document.getElementById("sun-counter");
let totalSuns = 0;
let createRandomSunsInterval;

function createRandomSuns() {
  createRandomSunsInterval = setInterval(createSun, 9000);
}

function addSun() {
  this.remove();
  totalSuns += 50;
  sun_counter.innerText = totalSuns;
}

function createSun() {
  const newSun = document.createElement("img");
  const x = Math.floor(Math.random() * window.innerWidth);
  const y = Math.floor(Math.random() * window.innerHeight);
  newSun.classList.add("random-sun");
  newSun.style.left = `${x}px`;
  newSun.style.top = `${y}px`;
  newSun.src = "../assets/images/sun.png";
  newSun.addEventListener("click", addSun);
  document.body.appendChild(newSun);
  setTimeout(() => {
    newSun.remove();
  }, 2500);
}

createRandomSuns();

//------------------------------------ plants/garden system --------------------------------------------
const addPeashooter = document.getElementById("peashooter");
const addSunflower = document.getElementById("sunflower");
const addNut = document.getElementById("nut");
const addCherryBomb = document.getElementById("cherryBomb");
const garden = document.getElementById("garden");
const plants_counter = document.getElementById("plants_counter");
let totalPlants = 0;
let remainingPlants = 22;
let shootingPeasInterval;
let nutCooldown = false;
let cherryBombCooldown = false;

const activePlant = {
  peashooter: false,
  sunflower: false,
  nut: false,
  cherryBomb: false,
};

function createPlant(name) {
  checkDifficulty();
  const sunCosts = { peashooter: 100, sunflower: 50, nut: 75, cherryBomb: 150 };
  if (totalSuns < sunCosts[name]) {
    alert("There are not enough suns");
    return;
  }
  if (name === "nut" && nutCooldown) {
    alert("Nut is reloading...");
    return;
  }
  if (name === "cherryBomb" && cherryBombCooldown) {
    alert("Cherry Bomb is reloading...");
    return;
  }
  let ok = selectorPositionPlant(name);
  if (ok) {
    if (name === "nut") {
      nutCooldown = true;
      addNut.style.filter = "grayscale(100%)";
      setTimeout(() => {
        nutCooldown = false;
        addNut.style.filter = "none";
      }, 3200);
    }
    if (name === "cherryBomb") {
      cherryBombCooldown = true;
      addCherryBomb.style.filter = "grayscale(100%)";
      setTimeout(() => {
        cherryBombCooldown = false;
        addCherryBomb.style.filter = "none";
      }, 8200);
    }
  } else {
    alert("There is not enough space in the garden");
  }
}

function selectorPositionPlant(name) {
  const sunCosts = { peashooter: 100, sunflower: 50, nut: 75, cherryBomb: 150 };
  if (totalSuns >= sunCosts[name]) {
    const nutrientSelector = {
      peashooter: 1,
      sunflower: 2,
      nut: 3,
      cherryBomb: 4,
    };
    if (nutrientOn) {
      document.body.classList.add("fertilize-" + nutrientSelector[name]);
    } else {
      document.body.classList.add("fertilize-cursor");
    }
    activePlant[name] = true;
    return true;
  }
  return false;
}

garden.addEventListener("click", function (event) {
  if (
    activePlant["peashooter"] ||
    activePlant["sunflower"] ||
    activePlant["nut"] ||
    activePlant["cherryBomb"]
  ) {
    const newPlant = document.createElement("img");
    newPlant.style.left = `${event.pageX}px`;
    newPlant.style.top = `${event.pageY}px`;
    let health;
    if (nutrientOn) {
      newPlant.classList.add("garden-plant-ultimate");
      if (activePlant["peashooter"]) {
        newPlant.src = "../assets/images/peashooter-ultimate.gif";
        totalSuns -= 100;
        activePlant["peashooter"] = false;
        health = 125;
        shootingPeas(newPlant.style.left, newPlant.style.top, "pea-ultimate");
        document.body.classList.remove("fertilize-1");
      } else if (activePlant["sunflower"]) {
        newPlant.src = "../assets/images/sunflower-ultimate.png";
        totalSuns -= 50;
        activePlant["sunflower"] = false;
        health = 75;
        createSuns(newPlant.style.left, newPlant.style.top, "sun-ultimate");
        document.body.classList.remove("fertilize-2");
      } else if (activePlant["nut"]) {
        newPlant.src = "../assets/images/nut-ultimate.png";
        totalSuns -= 75;
        activePlant["nut"] = false;
        health = 1;
        document.body.classList.remove("fertilize-3");
      } else if (activePlant["cherryBomb"]) {
        newPlant.src = "../assets/images/cherryBomb-ultimate.png";
        totalSuns -= 150;
        activePlant["cherryBomb"] = false;
        health = 5000;
        setTimeout(function () {
          explode(newPlant, "explosion-ultimate");
        }, 1500);
        setTimeout(function () {
          newPlant.remove();
        }, 2100);
      }
      nutrientOn = false;
      nutrient_counter.innerText = "0";
    } else {
      newPlant.classList.add("garden-plant");
      if (activePlant["peashooter"]) {
        newPlant.src = "../assets/images/peashooter.gif";
        totalSuns -= 100;
        activePlant["peashooter"] = false;
        health = 80;
        shootingPeas(newPlant.style.left, newPlant.style.top, "pea");
      } else if (activePlant["sunflower"]) {
        newPlant.src = "../assets/images/sunflower.gif";
        totalSuns -= 50;
        activePlant["sunflower"] = false;
        health = 50;
        createSuns(newPlant.style.left, newPlant.style.top, "random-sun");
      } else if (activePlant["nut"]) {
        newPlant.src = "../assets/images/nut.gif";
        totalSuns -= 75;
        activePlant["nut"] = false;
        health = 130;
      } else if (activePlant["cherryBomb"]) {
        newPlant.src = "../assets/images/cherryBomb.gif";
        totalSuns -= 150;
        activePlant["cherryBomb"] = false;
        health = 5000;
        setTimeout(function () {
          explode(newPlant, "explosion");
        }, 1500);
        setTimeout(function () {
          newPlant.remove();
        }, 2100);
      }
    }
    document.body.classList.remove("fertilize-cursor");
    newPlant.health = health;
    newPlant.addEventListener("click", function () {
      removePlant(newPlant);
    });
    garden.appendChild(newPlant);
    totalPlants++;
    remainingPlants--;
    plants_counter.innerText = "Remaining Plants: " + remainingPlants;
    sun_counter.innerText = totalSuns;
  }
});

function shootingPeas(x, y, type) {
  let time = 6300;
  let damage = 35;
  if (type === "pea-ultimate") {
    time = 3150;
    damage = 60;
  }
  shootingPeasInterval = setInterval(() => {
    let currentX = parseInt(x);
    const shoot = document.createElement("img");
    shoot.style.left = currentX + "px";
    shoot.style.top = y;
    shoot.classList.add("shoot");
    shoot.src = "../assets/images/" + type + ".png";
    document.body.appendChild(shoot);
    const interval = setInterval(function () {
      currentX += 5;
      shoot.style.left = currentX + "px";
      document
        .querySelectorAll(
          ".zombie, .big-zombie, .buckethead-zombie, .globe-zombie, .football-zombie"
        )
        .forEach((zombie) => {
          if (checkCollision(shoot, zombie)) {
            zombie.health -= damage;
            if (zombie.health <= 0) {
              zombie.remove();
              totalDeathZombies++;
            }
            shoot.remove();
            clearInterval(interval);
          }
        });
    }, 20);

    setTimeout(function () {
      clearInterval(interval);
      shoot.remove();
    }, 5800);
  }, time);
}

function createSuns(x, y, type) {
  let sun = 25;
  let time = 14000;
  if (type === "sun-ultimate") {
    sun = 125;
    time = 9500;
  }
  setInterval(() => {
    const newSun = document.createElement("img");
    newSun.style.left = x;
    newSun.style.top = y;
    newSun.classList.add(type);
    newSun.src = "../assets/images/sun.png";
    document.body.appendChild(newSun);
    totalSuns += sun;
    sun_counter.innerText = totalSuns;
    setTimeout(function () {
      newSun.remove();
    }, 1200);
  }, time);
}

function pushZombieBack(zombie, nut) {
  let currentLeft = parseInt(zombie.style.left, 10);
  currentLeft += 700;
  zombie.style.left = `${currentLeft}px`;
  return currentLeft;
}

function explode(plant, type) {
  plant.src = "../assets/images/" + type + ".gif";
  plant.classList.add(type);
  if (type === "explosion-ultimate") {
    document
      .querySelectorAll(
        ".zombie, .big-zombie, .buckethead-zombie, .globe-zombie, .football-zombie"
      )
      .forEach((zombie) => {
        zombie.remove();
        totalDeathZombies++;
      });
  } else {
    const explosionX = parseInt(plant.style.left, 10);
    const explosionY = parseInt(plant.style.top, 10);
    document
      .querySelectorAll(
        ".zombie, .big-zombie, .buckethead-zombie, .globe-zombie, .football-zombie"
      )
      .forEach((zombie) => {
        const zombieX = parseInt(zombie.style.left, 10);
        const zombieY = parseInt(zombie.style.top, 10);
        const distance = Math.sqrt(
          Math.pow(explosionX - zombieX, 2) + Math.pow(explosionY - zombieY, 2)
        );
        if (distance < 250) {
          zombie.health -= 170;
          if (zombie.health <= 0) {
            zombie.remove();
            totalDeathZombies++;
          }
        }
      });
  }
  totalPlants--;
  remainingPlants++;
  plants_counter.innerText = "Remaining Plants: " + remainingPlants;
}

function clearAllIntervalPlants() {
  clearInterval(createRandomSunsInterval);
  clearInterval(shootingPeasInterval);
}

addPeashooter.addEventListener("click", () => createPlant("peashooter"));
addSunflower.addEventListener("click", () => createPlant("sunflower"));
addNut.addEventListener("click", () => createPlant("nut"));
addCherryBomb.addEventListener("click", () => createPlant("cherryBomb"));

//------------------------------------ nutrient --------------------------------------------------
const nutrient = document.getElementById("nutrient");
const nutrient_counter = document.getElementById("nutrient-counter");
let nutrientCounter = 1;
let nutrientOn = false;

function changeNutrient() {
  if (nutrientCounter === 1) {
    alert(
      "single-use booster, apply it to a plant frame for an improved plant"
    );
    document.body.classList.add("fertilize-cursor");
    nutrientOn = true;
    nutrientCounter--;
  } else {
    alert("no boosters available");
  }
}

nutrient.addEventListener("click", () => changeNutrient());

//------------------------------------ zombies system --------------------------------------------------
let createZombiesInterval = null;
let createBucketZombiesInterval = null;
let createdGlobeZombiesInterval = null;
let createdFootballZombiesInterval = null;
let createBigZombiesInterval = null;

function clearAllIntervalZombies() {
  clearInterval(createZombiesInterval);
  clearInterval(createBucketZombiesInterval);
  clearInterval(createdGlobeZombiesInterval);
  clearInterval(createdFootballZombiesInterval);
  clearInterval(createBigZombiesInterval);
}

function checkDifficulty() {
  if (totalPlants === 4) {
    clearAllIntervalZombies();
    createRandomZombiesNormal();
  } else if (totalPlants === 14) {
    clearAllIntervalZombies();
    createRandomZombiesDifficult();
  } else if (totalPlants === 19) {
    clearAllIntervalZombies();
    createRandomZombiesExtreme();
  }
}

function createRandomZombiesEasy() {
  createZombiesInterval = setInterval(createZombieNormal, 30000);
}
function createRandomZombiesNormal() {
  createZombiesInterval = setInterval(createZombieNormal, 14000);
  createBucketZombiesInterval = setInterval(createZombieBucket, 18000);
}
function createRandomZombiesDifficult() {
  createZombiesInterval = setInterval(createZombieNormal, 8000);
  createBucketZombiesInterval = setInterval(createZombieBucket, 11000);
  createdGlobeZombiesInterval = setInterval(createZombieGlobe, 15000);
}
function createRandomZombiesExtreme() {
  musicPlayer.src = "../assets/sounds/pvz-phonk.mp3";
  musicPlayer.load();
  musicPlayer.play();
  createZombiesInterval = setInterval(createZombieNormal, 1800);
  createBucketZombiesInterval = setInterval(createZombieBucket, 4500);
  createdGlobeZombiesInterval = setInterval(createZombieGlobe, 5500);
  createdFootballZombiesInterval = setInterval(createFootballZombie, 5800);
  createBigZombiesInterval = setInterval(createBigZombie, 14500);
}

function createZombie(zombie, speed, health) {
  const zombieImg = new Image();
  zombieImg.src = "../assets/images/" + zombie + ".gif";
  zombieImg.onload = function () {
    const zombieWidth = zombieImg.width;
    const zombieHeight = zombieImg.height;
    const x = Math.max(
      0,
      Math.min(window.innerWidth - zombieWidth, window.innerWidth)
    );
    const y = Math.max(
      0,
      Math.min(
        window.innerHeight - zombieHeight,
        Math.floor(Math.random() * window.innerHeight)
      )
    );
    const newZombie = document.createElement("img");
    newZombie.classList.add(zombie);
    newZombie.style.left = `${x}px`;
    newZombie.style.top = `${y}px`;
    newZombie.src = "../assets/images/" + zombie + ".gif";
    newZombie.health = health;
    document.body.appendChild(newZombie);
    zombieWalk(newZombie, speed);
  };
}

function createZombieNormal() {
  createZombie("zombie", 1.75, 100);
}
function createZombieBucket() {
  createZombie("buckethead-zombie", 1.65, 150);
}
function createZombieGlobe() {
  createZombie("globe-zombie", 6.4, 75);
}
function createFootballZombie() {
  createZombie("football-zombie", 4.5, 125);
}
function createBigZombie() {
  createZombie("big-zombie", 1.15, 600);
}

function zombieWalk(zombie, speed) {
  let currentLeft = parseInt(zombie.style.left, 10);
  const end = document.getElementById("end");
  const endRect = end.getBoundingClientRect();
  const interval = setInterval(function () {
    currentLeft -= speed;
    zombie.style.left = `${currentLeft}px`;
    const zombieRect = zombie.getBoundingClientRect();
    if (
      zombieRect.left <= endRect.right &&
      zombieRect.right >= endRect.left &&
      zombieRect.top < endRect.bottom &&
      zombieRect.bottom > endRect.top
    ) {
      gameOver();
      return;
    }
    document
      .querySelectorAll(".garden-plant, .garden-plant-ultimate")
      .forEach((plant) => {
        if (checkCollision(zombie, plant)) {
          if (
            plant.src.includes("nut") &&
            plant.classList.contains("garden-plant-ultimate")
          ) {
            currentLeft = pushZombieBack(zombie, plant);
          } else if (plant.src.includes("nut")) {
            currentLeft += 600;
            plant.remove();
            totalPlants--;
            remainingPlants++;
            plants_counter.innerText = "Remaining Plants: " + remainingPlants;
          } else {
            plant.health -= 1;
          }
          if (plant.health <= 0) {
            plant.remove();
            totalPlants--;
            remainingPlants++;
            plants_counter.innerText = "Remaining Plants: " + remainingPlants;
          }
        }
      });
  }, 45);
}

createRandomZombiesEasy();

//------------------------------------ others --------------------------------------------------
let totalDeathZombies = 0;
const score = document.getElementById("score");
const shovel = document.getElementById("shovel");
let shovelOn = false;
shovel.addEventListener("click", () => changeShovel());

function changeShovel() {
  if (shovelOn) {
    shovelOn = false;
    document.body.classList.remove("shovel-cursor");
  } else {
    shovelOn = true;
    document.body.classList.add("shovel-cursor");
  }
}

function removePlant(plant) {
  if (shovelOn) {
    plant.remove();
    totalPlants--;
    remainingPlants++;
    totalSuns += 25;
    plants_counter.innerText = "Remaining Plants: " + remainingPlants;
    sun_counter.innerText = totalSuns;
    shovelOn = false;
    document.body.classList.remove("shovel-cursor");
  }
}

function checkCollision(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function clearAllInterval() {
  clearAllIntervalZombies();
  clearAllIntervalPlants();
}

function gameOver() {
  clearAllInterval();
  document
    .querySelectorAll(
      ".zombie, .big-zombie, .buckethead-zombie, .globe-zombie, .football-zombie, .garden-plant, .garden-plant-ultimate"
    )
    .forEach((object) => {
      object.remove();
    });
  score.innerText =
    "Nice try, you managed to kill " + totalDeathZombies + " zombies 🧠";
  score.style.display = "block";
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 8000);
}
// ----------------------------------------15/9/24 first JS-----------------------------
