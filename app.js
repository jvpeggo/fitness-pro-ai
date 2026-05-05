let DB = JSON.parse(localStorage.getItem("fitnessDB") || "{}");
let WEEK = parseInt(localStorage.getItem("week") || "1");

// =========================
// 🧠 GIFS PRONTOS (SEM UPLOAD)
// =========================
const gifMap = {
"Supino reto":"https://musclewiki.com/media/uploads/exercises/bench-press/male-gifs/standard.gif",
"Supino inclinado":"https://musclewiki.com/media/uploads/exercises/incline-bench-press/male-gifs/standard.gif",
"Agachamento":"https://musclewiki.com/media/uploads/exercises/squat/male-gifs/standard.gif",
"Leg press":"https://musclewiki.com/media/uploads/exercises/leg-press/male-gifs/standard.gif",
"Remada baixa":"https://musclewiki.com/media/uploads/exercises/seated-cable-row/male-gifs/standard.gif",
"Puxada frontal":"https://musclewiki.com/media/uploads/exercises/lat-pulldown/male-gifs/standard.gif",
"Stiff":"https://musclewiki.com/media/uploads/exercises/stiff-leg-deadlift/male-gifs/standard.gif",
"Desenvolvimento ombro":"https://musclewiki.com/media/uploads/exercises/shoulder-press/male-gifs/standard.gif",
"Tríceps corda":"https://musclewiki.com/media/uploads/exercises/tricep-pushdown/male-gifs/standard.gif",
"Rosca direta":"https://musclewiki.com/media/uploads/exercises/bicep-curl/male-gifs/standard.gif"
};

// =========================
// 📊 HISTÓRICO
// =========================
function saveHistory(exercise,value,rpe){

let history = JSON.parse(localStorage.getItem("history")||"{}");

if(!history[exercise]){
history[exercise]=[];
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
// 📅 PERIODIZAÇÃO
// =========================
function getPhase(){
if(WEEK===1) return "adaptação";
if(WEEK===2) return "base";
if(WEEK===3) return "progressão";
if(WEEK===4) return "deload";
return "base";
}

// =========================
// 🏃 CARDIO FIXO
// =========================
function getCardio(day){

const map = {
seg:"Fitdance",
ter:"Funcional",
qua:"Fitdance",
qui:"Funcional",
sex:"Fitdance",
sab:"Fitdance",
dom:"Descanso"
};

return map[day];
}

// =========================
// 🏋️ TREINO (6 EXERCÍCIOS)
// =========================
function getExercises(){

const list = [
"Supino reto",
"Supino inclinado",
"Agachamento",
"Leg press",
"Remada baixa",
"Puxada frontal",
"Stiff",
"Desenvolvimento ombro",
"Tríceps corda",
"Rosca direta"
];

return list.sort(()=>Math.random()-0.5).slice(0,6);
}

// =========================
// 📅 ABRIR DIA
// =========================
function openDay(day){

let phase = getPhase();
let cardio = getCardio(day);
let exercises = getExercises();

let html = `
<div class="card">

<h2>🏋️ TREINO ${day.toUpperCase()}</h2>

<p>📌 Fase: <b>${phase}</b></p>

<div class="card">
<h3>💃 Cardio: ${cardio}</h3>
</div>
`;

// =========================
// 🏋️ EXERCÍCIOS
// =========================
html += `<h3>🏋️ Musculação (6 exercícios)</h3>`;

exercises.forEach(ex=>{

let gif = gifMap[ex] || "";

html += `
<div class="card">

<h4>${ex}</h4>

<img src="${gif}" width="100%" style="border-radius:10px" />

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
cardio:getCardio(day),
exercises:{},
notes:document.getElementById("notes").value
};

document.querySelectorAll("input").forEach(i=>{

data.exercises[i.id]=i.value;

if(i.id.includes("_load")){
let rpe=document.getElementById(i.id.replace("_load","_rpe")).value;
saveHistory(i.id,i.value,rpe);
}

});

DB[day]=data;

localStorage.setItem("fitnessDB",JSON.stringify(DB));

alert("🔥 Treino salvo!");
}

// =========================
// 📈 SEMANA
// =========================
function nextWeek(){

WEEK++;

if(WEEK>4) WEEK=1;

localStorage.setItem("week",WEEK);

openDay("seg");
}

// =========================
// 🚀 INICIAL
// =========================
openDay("seg");
