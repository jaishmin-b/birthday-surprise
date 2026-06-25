const music = document.getElementById("bgMusic");
const slides = Array.from(document.querySelectorAll(".section"));
let current = 0;
let animating = false;

/* mood accent + aura tint per page, kept in sync with CSS data-mood */
const moods = [
{ accent:"#ffd2a8", aura:"rgba(216,155,98,.18)" },
{ accent:"#ffc59a", aura:"rgba(255,190,150,.20)" },
{ accent:"#ffb3a0", aura:"rgba(255,165,140,.22)" },
{ accent:"#ff9ab0", aura:"rgba(255,140,160,.22)" },
{ accent:"#ff86a3", aura:"rgba(255,120,150,.22)" },
{ accent:"#ff6e8e", aura:"rgba(255,90,125,.24)" },
{ accent:"#ff4d6d", aura:"rgba(255,70,105,.28)" }
];

/* ---------- Step dots ---------- */
const dotsWrap = document.getElementById("dots");
slides.forEach((_, i) => {
const dot = document.createElement("div");
dot.className = "dot" + (i === 0 ? " active" : "");
dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.children);

function updateMood(index){
const m = moods[index] || moods[0];
document.body.style.setProperty("--accent", m.accent);
document.body.style.setProperty("--aura", m.aura);
dots.forEach((d, i) => d.classList.toggle("active", i === index));
}
updateMood(0);

/* ---------- Slide navigation ---------- */
function goTo(index){
if(animating || index < 0 || index >= slides.length || index === current) return;
animating = true;

const currentSlide = slides[current];
const nextSlide = slides[index];

currentSlide.classList.add("leaving");
currentSlide.classList.remove("active");
nextSlide.classList.add("active");

setTimeout(() => {
currentSlide.classList.remove("leaving");
animating = false;
}, 700);

current = index;
updateMood(index);
onSlideOpen(nextSlide);
}

function nextSlide(){
goTo(current + 1);
}

/* fire effects when a slide becomes active */
function onSlideOpen(slide){
if(slide.id === "letterSlide") startTypeWriter();
if(slide.classList.contains("final")) petalRain(40);
}

/* every "Next" button (and the start button) advances one step */
document.querySelectorAll(".next-btn").forEach(btn => {
btn.addEventListener("click", () => {
if(btn.id === "startBtn") music.play().catch(() => {});
nextSlide();
});
});

/* ---------- Make a wish (candle) ---------- */
const cake = document.getElementById("cake");
cake.addEventListener("click", () => {
if(cake.classList.contains("blown")) return;
cake.classList.add("blown");
document.getElementById("wishMessage").classList.add("show");

/* reveal the button to continue */
const wishBtn = document.querySelector("#wishSlide .next-btn");
wishBtn.classList.add("reveal-btn");

/* a little puff of glowing light from the candle */
const rect = cake.getBoundingClientRect();
softBurst(rect.left + rect.width/2, rect.top + 20, 16);
});

/* ---------- Split headings into animated letters ---------- */
document.querySelectorAll(".split-letters").forEach(el => {
const text = el.textContent;
el.textContent = "";
[...text].forEach((ch, i) => {
const span = document.createElement("span");
span.textContent = ch === " " ? " " : ch;
if(ch === " ") span.classList.add("space");
span.style.setProperty("--i", i);
el.appendChild(span);
});
});

/* ---------- Reasons: sealed notes that open on tap ---------- */
const reasonCards = document.querySelectorAll(".cards .card");
const reasonNote = document.getElementById("reasonNote");
let openedCount = 0;

reasonCards.forEach(card => {
card.addEventListener("click", () => {
if(card.classList.contains("open")) return;
card.classList.add("open");
openedCount++;

/* a soft glow blooms from the note as it opens */
const r = card.getBoundingClientRect();
softBurst(r.left + r.width/2, r.top + r.height/2, 8);

if(openedCount < reasonCards.length){
reasonNote.textContent = openedCount + " of " + reasonCards.length + " opened… keep going ❤️";
} else {
reasonNote.textContent = "You've just opened my whole heart. ❤️";
document.querySelector('[data-mood="3"] .next-btn').classList.add("reveal-btn");
}
});
});

/* ---------- Typewriter ---------- */
const loveLetter = `Happy Birthday, My Moniiiiii ❤️

Sometimes I wonder how two years and four months have passed so quickly. We have had beautiful moments, silly conversations, endless laughter, and yes, even a few disagreements along the way. But through every happy day and every difficult one, one thing has never changed — my love for you.

You have become such an important part of my life that imagining my days without you feels incomplete. Thank you for being my comfort when I need support, my happiness when I need a reason to smile, and my strength when things get hard.

I know we are not perfect, but I love that we always find our way back to each other. Every challenge has only made us stronger and every memory has made my heart more attached to yours.

On your birthday, I just want you to know how deeply you are loved, appreciated, and cherished. No matter where life takes us, you will always have a special place in my heart.

Happy Birthday, Babu. Thank you for being my favorite person, my happiness, and one of the best parts of my life. ❤️`;

let typeIndex = 0;
let typeStarted = false;

function startTypeWriter(){
if(typeStarted) return;
typeStarted = true;
const target = document.getElementById("typewriter");
function type(){
if(typeIndex < loveLetter.length){
target.innerHTML += loveLetter.charAt(typeIndex);
typeIndex++;
setTimeout(type, 25);
}
}
type();
}

/* ---------- Hold This Close (beating heart) ---------- */
const bigHeart = document.getElementById("bigHeart");
const heartStage = document.getElementById("heartStage");
const heartLinesWrap = document.getElementById("heartLines");

const heartLines = [
"Can you feel that?",
"Every single beat…",
"…it has been saying your name.",
"You are my today, my tomorrow, and my favorite forever. ❤️"
];
let heartStep = 0;

bigHeart.addEventListener("click", () => {
/* ripple ring radiating from the heart */
const ring = document.createElement("div");
ring.className = "ripple";
heartStage.appendChild(ring);
setTimeout(() => ring.remove(), 1200);

/* soft glow rippling out of the heart */
const r = bigHeart.getBoundingClientRect();
softBurst(r.left + r.width/2, r.top + r.height/2, 10);

/* heartbeat races a little faster with every tap */
if(heartStep < heartLines.length){
bigHeart.style.animationDuration = Math.max(0.5, 1.2 - heartStep * 0.14) + "s";

const line = document.createElement("p");
line.className = "heart-line";
line.textContent = heartLines[heartStep];
heartLinesWrap.appendChild(line);
heartStep++;
}

/* once every line is revealed, unlock the way forward */
if(heartStep === heartLines.length){
document.querySelector("#heartSlide .next-btn").classList.add("reveal-btn");
}
});

/* ---------- Final: love button + signed finale ---------- */
let finaleDone = false;
const loveBtn = document.getElementById("loveBtn");
loveBtn.addEventListener("click", () => {
if(finaleDone) return;
finaleDone = true;

/* a warm bloom of light washes over the page */
const bloom = document.querySelector("#finalSlide .bloom");
bloom.classList.add("blooming");

/* a gentle rain of rose petals + a surprise burst of love */
petalRain(90);
surpriseBurst(40);
setTimeout(() => surpriseBurst(26), 350);

/* the prompt + button gently bow out */
document.getElementById("finalNote").classList.add("gone");
loveBtn.classList.add("gone");

/* unveil the closing words */
document.getElementById("finalReveal").classList.add("show");
});

const PETAL_SHADES = ["#ff8fa3", "#ff4d6d", "#ffb3c1", "#ff6e8e", "#ffd2a8", "#ff97b2"];

/* ---------- Soft glowing burst (replaces emoji sparkles) ---------- */
function softBurst(cx, cy, count){
for(let i = 0; i < count; i++){
const dot = document.createElement("div");
dot.className = "glow-dot";
dot.style.left = cx + "px";
dot.style.top = cy + "px";
const angle = (Math.PI * 2 * i) / count + Math.random();
const dist = 45 + Math.random() * 55;
dot.style.setProperty("--tx", Math.cos(angle) * dist + "px");
dot.style.setProperty("--ty", (Math.sin(angle) * dist - 25) + "px");
dot.style.animationDuration = (1.1 + Math.random() * 0.7) + "s";
const size = Math.random() * 6 + 6;
dot.style.width = size + "px";
dot.style.height = size + "px";
document.body.appendChild(dot);
setTimeout(() => dot.remove(), 2000);
}
}

/* ---------- Surprise burst of love (emojis flying from center) ---------- */
const SURPRISE = ["💖","💕",,"💝","💗","💞","🩷"];
function surpriseBurst(count){
for(let i = 0; i < count; i++){
const e = document.createElement("div");
e.className = "surprise-emoji";
e.textContent = SURPRISE[Math.floor(Math.random() * SURPRISE.length)];
const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
const dist = 150 + Math.random() * 240;
e.style.setProperty("--tx", Math.cos(angle) * dist + "px");
e.style.setProperty("--ty", Math.sin(angle) * dist + "px");
e.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
e.style.fontSize = (Math.random() * 16 + 18) + "px";
e.style.animationDuration = (Math.random() * 0.8 + 1.4) + "s";
document.body.appendChild(e);
setTimeout(() => e.remove(), 2500);
}
}

/* ---------- Falling rose petals (replaces emoji confetti) ---------- */
function petalRain(count){
for(let i = 0; i < count; i++){
const petal = document.createElement("div");
petal.className = "petal";
petal.style.left = Math.random() * 100 + "vw";
petal.style.background =
"linear-gradient(135deg," + PETAL_SHADES[i % PETAL_SHADES.length] + ",#ff2d55)";
const dur = Math.random() * 3 + 3.5;
petal.style.animationDuration = dur + "s";
petal.style.animationDelay = Math.random() * 0.9 + "s";
petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
petal.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
const size = Math.random() * 8 + 10;
petal.style.width = size + "px";
petal.style.height = size * 1.3 + "px";
document.body.appendChild(petal);
setTimeout(() => petal.remove(), (dur + 1.2) * 1000);
}
}

/* ---------- Ambient: soft petals drifting upward ---------- */
function createFloatPetal(){
const petal = document.createElement("div");
petal.className = "float-petal";
petal.style.left = Math.random() * 100 + "vw";
petal.style.background =
"linear-gradient(135deg," + PETAL_SHADES[Math.floor(Math.random() * PETAL_SHADES.length)] + ",rgba(255,90,125,.35))";
const size = Math.random() * 10 + 9;
petal.style.width = size + "px";
petal.style.height = size * 1.3 + "px";
petal.style.animationDuration = (Math.random() * 4 + 7) + "s";
document.getElementById("hearts-container").appendChild(petal);
setTimeout(() => petal.remove(), 11000);
}

setInterval(createFloatPetal, 650);
