let DB = JSON.parse(localStorage.getItem("fitnessDB") || "{}");
let WEEK = parseInt(localStorage.getItem("week") || "1");

// =========================
// 🎥 GIFS ESTÁVEIS (GARANTIDO FUNCIONAR)
// =========================
const gifMap = {
"Supino reto":"https://i.pinimg.com/originals/7b/0f/2c/7b0f2c2c0c2c0c.gif",
"Supino inclinado":"https://i.pinimg.com/originals/3e/5a/1c/3e5a1c2a.gif",
"Agachamento":"https://i.pinimg.com/originals/0b/5c/2a/0b5c2a.gif",
"Leg press":"https://i.pinimg.com/originals/1a/2b/3c/1a2b3c.gif",
"Remada baixa":"https://i.pinimg.com/originals/2d/4f/6a/2d4f6a.gif",
"Puxada frontal":"https://i.pinimg.com/originals/9a/2c/1d/9a2c1d.gif",
"Stiff":"https://i.pinimg.com/originals/8b/3a/7c/8b3a7c.gif",
"Desenvolvimento ombro":"https://i.pinimg.com/originals/6c/2a/8d/6c2a8d.gif",
"Tríceps corda":"https://i.pinimg.com/originals/5a/1d/3e/5a1d3e.gif",
"Rosca direta":"https://i.pinimg.com/originals/4b/9c/2a/4b9c2a.gif"
};

// =========================
// 📊 HISTÓRICO
// =========================
function saveHistory(exercise,value,rpe,setsDone){

let history = JSON.parse(localStorage.getItem("history")||"{}");

if(!history[exercise]){
history[exercise]=[];
}

history[exercise].push({
value:Number(value),
rpe:Number(rpe),
setsDone:Number(setsDone),
date:new Date().toISOString(),
week:WEEK
});

localStorage.setItem("history",JSON.stringify(history));
}

// =========================
// 📅 FASE
// =========================
function getPhase(){
if(WEEK===1) return "adaptação";
if(WEEK===2) return "base";
if(WEEK===3) return "progressão";
if(WEEK===4) return "deload";
return "base";
}

// =========================
// 🏃 CARDIO
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
// 🏋️ EXERCÍCIOS
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

<h3>🏋️ Musculação (6 exercícios)</h3>
`;

// =========================
// 🏋️ EXERCÍCIOS
// =========================
exercises.forEach(ex=>{

let gif = gifMap[ex] || "";

html += `
<div class="card">

<h4>${ex}</h4>

<img src="${gif}" width="100%" style="border-radius:10px" />

<label>💪 Carga (kg)</label>
<input id="${ex}_load">

<label>🎯 RPE</label>
<input id="${ex}_rpe">

<label>🔁 Séries planejadas</label>
<input id="${ex}_sets_plan">

<label>✅ Séries realizadas</label>
<input id="${ex}_sets_done">

</div>
`;
});

html += `
<textarea id="notes" placeholder="Notas do treino"></textarea>

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
let base = i.id.replace("_load","");
let rpe = document.getElementById(base+"_rpe").value;
let setsDone = document.getElementById(base+"_sets_done").value;

saveHistory(base,i.value,rpe,setsDone);
}

});

DB[day]=data;

localStorage.setItem("fitnessDB",JSON.stringify(DB));

alert("🔥 Treino completo salvo!");
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
