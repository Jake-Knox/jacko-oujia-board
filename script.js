const dial = document.getElementById("dial");
let isDragging = false;
let centerX, centerY;
let currentAngle = 0;
let inZone = false;

let targetAngle = getNewTargetAngle(currentAngle);
console.log("Target Angle:", targetAngle);

function getNewTargetAngle(current) {
    let angle;
    do {
        angle = Math.floor(Math.random() * 360);
    } while (Math.abs(angle - current) < 15 || Math.abs(angle - current) > 345);
    return angle;
}

dial.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = dial.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    currentAngle = (angle + 360) % 360;

    dial.style.transform = `rotate(${currentAngle}deg)`;

    const diff = Math.abs(currentAngle - targetAngle);
    const angleDiff = Math.min(diff, 360 - diff); // Handle wrap-around

    if (angleDiff < 15) {
        if (!inZone) {
            inZone = true;
            console.log("hee hee");
            targetAngle = getNewTargetAngle(currentAngle);
            console.log("New Target Angle:", targetAngle);
        }
    } else {
        inZone = false;
    }
});
