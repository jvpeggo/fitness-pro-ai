let DB = JSON.parse(localStorage.getItem("fitnessDB") || "{}");
let WEEK = parseInt(localStorage.getItem("week") || "1");

// =========================
// 📊 HISTÓRICO GLOBAL
// =========================
function saveHistory(exercise, value, rpe){

let history = JSON.parse(localStorage.getItem("history") || "{}");

if(!history[exercise]){
history[exercise] = [];
}

history[exercise].push({
value:Number(value),
rpe:Number(rpe),
date:new Date().toISOString(),
week:WEEK
});

localStorage.setItem("history",JSON.stringify(history));
}

// =========================
// 🧠 MACROCICLO (4 SEMANAS)
// =========================
function getMacroPhase(){

if(WEEK === 1) return "adaptação";
if(WEEK === 2) return "base";
if(WEEK === 3) return "progressão";
if(WEEK === 4) return "deload";

return "base";
}

// =========================
// 🧠 ESTADO FÍSICO
// =========================
function getBodyState(){

let history = JSON.parse(localStorage.getItem("history")||"{}");

let rpes = [];

Object.keys(history).forEach(ex=>{
history[ex].forEach(h=>{
if(h.rpe) rpes.push(h.rpe);
});
});

if(rpes.length === 0) return "normal";

let avg = rpes.reduce((a,b)=>a+b,0)/rpes.length;

if(avg <= 7) return "recuperado";
if(avg <= 8) return "normal";
return "fadiga";
}

// =========================
// 🏋️ GERADOR PROFISSIONAL
// =========================
function getWorkout(day){

const split = {
seg:"push",
ter:"legs",
qua:"pull",
qui:"core",
sex:"push",
sab:"legs",
dom:"rest"
};

const base = {
push:["Supino reto","Supino inclinado","Desenvolvimento ombro","Tríceps corda","Elevação lateral","Paralelas"],
pull:["Puxada frontal","Remada baixa","Rosca direta","Face pull","Barra fixa","Remada unilateral"],
legs:["Agachamento","Leg press","Stiff","Panturrilha","Avanço","Extensora"],
core:["Prancha","Abdominal infra","Crunch","Prancha lateral","Elevação de pernas"]
};

let type = split[day];
let phase = getMacroPhase();
let state = getBodyState();

// =========================
// 🧠 AJUSTE DE VOLUME POR FASE
// =========================
let volume = 6;

if(phase === "adaptação") volume = 4;
if(phase === "base") volume = 5;
if(phase === "progressão") volume = 6;
if(phase === "deload") volume = 3;

// =========================
// 🏋️ TREINO
// =========================
let exercises = [];

if(type === "rest"){
exercises = ["Mobilidade","Caminhada leve"];
} else {
exercises = base[type]
.sort(()=>Math.random()-0.5)
.slice(0,volume);
}

// =========================
// 🏃 CARDIO INTELIGENTE
// =========================
let cardio = "";

if(state === "fadiga"){
cardio = {type:"Caminhada leve",time:10};
}

if(state === "normal"){
cardio = {type:"Funcional ou corrida leve",time:20};
}

if(state === "recuperado"){
cardio = {type:"Fitdance ou HIIT",time:30};
}

// =========================
// RETURN FINAL
// =========================
return {
title:type.toUpperCase(),
phase:phase,
state:state,
exercises:exercises,
cardio:cardio
};
}

// =========================
// 📅 ABRIR DIA
// =========================
function openDay(day){

let workout = getWorkout(day);

let html = `
<div class="card">

<h2>🏋️ ${workout.title}</h2>

<p>📅 Fase: <b>${workout.phase}</b></p>
<p>🧠 Estado: <b>${workout.state}</b></p>

<div class="card">
<b>🏃 Cardio automático</b>
<p>${workout.cardio.type} - ${workout.cardio.time} min</p>

<input id="cardio_type" placeholder="Editar cardio">
<input id="cardio_time" placeholder="Tempo">
</div>
`;

workout.exercises.forEach(ex=>{

html += `
<div class="card">
<b>${ex}</b>

<input id="${ex}_load" placeholder="Carga kg">
<input id="${ex}_rpe" placeholder="RPE (1-10)">
</div>
`;
});

html += `
<textarea id="notes" placeholder="Notas"></textarea>

<button onclick="save('${day}')">💾 Salvar treino</button>

<button onclick="nextWeek()">➡ Avançar semana</button>

</div>
`;

document.getElementById("app").innerHTML = html;
}

// =========================
// 💾 SALVAR
// =========================
function save(day){

let data = {
week:WEEK,
phase:getMacroPhase(),
exercises:{},
cardio:{
type:document.getElementById("cardio_type").value,
time:document.getElementById("cardio_time").value
},
notes:document.getElementById("notes").value
};

document.querySelectorAll("input").forEach(i=>{

data.exercises[i.id]=i.value;

if(i.id.includes("_load")){
let rpe = document.getElementById(i.id.replace("_load","_rpe")).value;
saveHistory(i.id,i.value,rpe);
}

});

DB[day]=data;

localStorage.setItem("fitnessDB",JSON.stringify(DB));

alert("🔥 Periodização salva!");
}

// =========================
// 📈 SEMANA
// =========================
function nextWeek(){

WEEK++;

if(WEEK > 4) WEEK = 1;

localStorage.setItem("week",WEEK);

alert("📅 Semana: " + WEEK);

openDay("seg");
}

// =========================
// 🚀 INICIAL
// =========================
openDay("seg");
