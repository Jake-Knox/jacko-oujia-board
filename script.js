const dial = document.getElementById("dial");
const dialContainer = document.querySelector(".dial-container");
const startButton = document.getElementById("startButton");

let isDragging = false;
let centerX, centerY;
let previousMouseAngle = 0;
let virtualAngle = 0;

let inZone = false;
let targetAngle = getNewTargetAngle(0);

console.log("Target Angle:", targetAngle);

// --- Static sound setup ---
const staticAudio = new Audio('static.mp3');
staticAudio.loop = true;
staticAudio.volume = 0.02;

// --- Randomized celebration sounds ---
const reactionSounds = ['hee-hee.mp3', 'shamone.mp3'];

function playRandomReaction() {
    const randomIndex = Math.floor(Math.random() * reactionSounds.length);
    const sound = new Audio(reactionSounds[randomIndex]);
    sound.play().catch((e) => console.error("Reaction sound play failed:", e));
}

// --- Utility Functions ---
function getNewTargetAngle(current) {
    let angle;
    do {
        angle = Math.floor(Math.random() * 360);
    } while (Math.abs(((angle - (current % 360)) + 360) % 360) < 15);
    return angle;
}

function getAngleFromCenter(x, y) {
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
}

function updateCenter() {
    const rect = dial.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
}

// --- Start button event ---
startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    dialContainer.style.display = "block";

    // Update center on start
    updateCenter();

    staticAudio.play().catch((e) => console.error("Audio play failed:", e));
});

// --- Mouse Events ---
dial.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    updateCenter();
    previousMouseAngle = getAngleFromCenter(e.clientX, e.clientY);
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const currentMouseAngle = getAngleFromCenter(e.clientX, e.clientY);
    let delta = currentMouseAngle - previousMouseAngle;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    virtualAngle += delta;
    previousMouseAngle = currentMouseAngle;

    dial.style.transform = `rotate(${virtualAngle}deg)`;

    checkAngle();
});

// --- Touch Events ---
dial.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (e.touches.length !== 1) return; // only single touch
    isDragging = true;
    updateCenter();
    const touch = e.touches[0];
    previousMouseAngle = getAngleFromCenter(touch.clientX, touch.clientY);
});

document.addEventListener("touchend", (e) => {
    if (e.touches.length === 0) {
        isDragging = false;
    }
});

document.addEventListener("touchcancel", () => {
    isDragging = false;
});

document.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    if (e.touches.length !== 1) return;
    e.preventDefault();

    const touch = e.touches[0];
    const currentMouseAngle = getAngleFromCenter(touch.clientX, touch.clientY);
    let delta = currentMouseAngle - previousMouseAngle;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    virtualAngle += delta;
    previousMouseAngle = currentMouseAngle;

    dial.style.transform = `rotate(${virtualAngle}deg)`;

    checkAngle();
});

function checkAngle() {
    const displayAngle = ((virtualAngle % 360) + 360) % 360;
    const diff = Math.abs(displayAngle - targetAngle);
    const angleDiff = Math.min(diff, 360 - diff);

    // Continuous volume scaling
    const maxVolume = 0.02;
    const maxAngle = 90;
    const scaledVolume = Math.min(maxVolume, (angleDiff / maxAngle) * maxVolume);
    staticAudio.volume = scaledVolume;

    // Trigger logic
    if (angleDiff < 15) {
        if (!inZone) {
            inZone = true;
            console.log("hee hee");
            playRandomReaction();
            targetAngle = getNewTargetAngle(displayAngle);
            console.log("New Target Angle:", targetAngle);
        }
    } else {
        inZone = false;
    }
}
