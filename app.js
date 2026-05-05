let DB = JSON.parse(localStorage.getItem("fitnessDB") || "{}");
let WEEK = parseInt(localStorage.getItem("week") || "1");

// =========================
// 📊 HISTÓRICO
// =========================
function saveHistory(exercise, value, rpe){

let history = JSON.parse(localStorage.getItem("history") || "{}");

if(!history[exercise]){
history[exercise] = [];
}

history[exercise].push({
value:Number(value),
rpe:Number(rpe),
date:new Date().toISOString()
});

localStorage.setItem("history",JSON.stringify(history));
}

// =========================
// 🧠 IA DE ESTADO FÍSICO
// =========================
function getBodyState(){

let history = JSON.parse(localStorage.getItem("history")||"{}");

let allRpe = [];
let totalLoad = 0;

Object.keys(history).forEach(ex=>{
history[ex].forEach(h=>{
allRpe.push(h.rpe || 8);
totalLoad += Number(h.value || 0);
});
});

let avgRpe = allRpe.length ? allRpe.reduce((a,b)=>a+b,0)/allRpe.length : 7;

if(avgRpe <= 7){
return "recuperado";
}

if(avgRpe <= 8){
return "normal";
}

if(avgRpe > 8){
return "fadiga";
}

return "normal";
}

// =========================
// 🏋️ + 🏃 IA TREINO + CARDIO
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

const muscleGroups = {
push:["Supino reto","Supino inclinado","Ombro","Tríceps corda","Elevação lateral","Paralelas"],
pull:["Puxada frontal","Remada baixa","Rosca direta","Face pull","Barra fixa","Remada unilateral"],
legs:["Agachamento","Leg press","Stiff","Panturrilha","Avanço","Extensora"],
core:["Prancha","Abdominal infra","Crunch","Prancha lateral","Elevação de pernas"]
};

const cardioOptions = {
recuperado:["Fitdance","Funcional leve","Caminhada"],
normal:["Corrida leve","Funcional","Bike"],
fadiga:["Caminhada leve","Mobilidade","Descanso ativo"]
};

let type = split[day];
let state = getBodyState();

// =========================
// 🧠 TREINO AJUSTADO
// =========================
let exercises = [];

if(type === "rest"){
exercises = ["Mobilidade","Alongamento"];
} else {
exercises = muscleGroups[type]
.sort(()=>Math.random()-0.5)
.slice(0,6);
}

// =========================
// 🏃 CARDIO AJUSTADO
// =========================
let cardioType = cardioOptions[state][Math.floor(Math.random()*cardioOptions[state].length)];

let cardioTime = 0;

if(state === "recuperado") cardioTime = 30;
if(state === "normal") cardioTime = 20;
if(state === "fadiga") cardioTime = 10;

return {
title:type.toUpperCase(),
exercises:exercises,
cardio:{
type:cardioType,
time:cardioTime,
state:state
}
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

<p>🧠 Estado físico: <b>${workout.cardio.state}</b></p>

<div class="card">
<b>🏃 Cardio automático</b>
<p><b>${workout.cardio.type}</b> - ${workout.cardio.time} min</p>

<input id="cardio_type" placeholder="Editar cardio">
<input id="cardio_time" placeholder="Tempo (min)">
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

<button onclick="nextWeek()">➡ Próxima semana</button>

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
day:day,
cardio:{
type:document.getElementById("cardio_type").value,
time:document.getElementById("cardio_time").value
},
exercises:{},
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

alert("🔥 IA ajustou treino + cardio!");
}

// =========================
// 📈 SEMANA
// =========================
function nextWeek(){

WEEK++;

if(WEEK > 4) WEEK = 1;

localStorage.setItem("week",WEEK);

alert("Semana atualizada: " + WEEK);

openDay("seg");
}

// =========================
// 🚀 INICIAL
// =========================
openDay("seg");
