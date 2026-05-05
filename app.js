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
// 🧠 IA DE CARGA (BASE SEMANAL)
// =========================
function getLoadMultiplier(){

// ciclo de 4 semanas
if(WEEK === 1) return 0.9;   // adaptação
if(WEEK === 2) return 1.0;   // base
if(WEEK === 3) return 1.05;  // progressão
if(WEEK === 4) return 0.85;  // deload

return 1.0;
}

// =========================
// 🤖 IA DE PERIODIZAÇÃO SEMANAL
// =========================
function getWeeklyPlan(day){

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
push:["Supino reto","Supino inclinado","Desenvolvimento ombro","Tríceps corda"],
pull:["Puxada frontal","Remada baixa","Rosca direta","Face pull"],
legs:["Agachamento","Leg press","Stiff","Panturrilha"],
core:["Prancha","Abdominal infra","Crunch","Prancha lateral"]
};

let type = split[day];

if(type === "rest"){
return ["Descanso ativo (caminhada + mobilidade)"];
}

let exercises = muscleGroups[type] || ["Treino livre"];

// 🔁 variação inteligente
exercises = exercises
.sort(()=>Math.random()-0.5)
.slice(0,3);

return exercises;
}

// =========================
// 📅 ABRIR DIA (IA SEMANAL)
// =========================
function openDay(day){

let exercises = getWeeklyPlan(day);

let multiplier = getLoadMultiplier();

let html = `
<div class="card">
<h2>🧠 Semana ${WEEK} - IA Avançada</h2>
<h3>📅 ${day.toUpperCase()}</h3>
`;

exercises.forEach(ex=>{

html += `
<div class="card">
<b>${ex}</b>

<input id="${ex}_load" placeholder="Carga base">
<input id="${ex}_rpe" placeholder="RPE (1-10)">

<button onclick="showAI('${ex}')">🧠 IA análise</button>
</div>
`;
});

html += `
<textarea id="notes" placeholder="Notas da sessão"></textarea>

<button onclick="save('${day}')">💾 Salvar treino</button>

<button onclick="nextWeek()">➡ Avançar semana</button>
</div>
`;

document.getElementById("app").innerHTML = html;
}

// =========================
// 💾 SALVAR TREINO
// =========================
function save(day){

let data = {
week:WEEK,
day:day,
exercises:{},
notes:document.getElementById("notes").value
};

document.querySelectorAll("input").forEach(i=>{

data.exercises[i.id]=i.value;

if(i.id.includes("_load")){
let rpe = document.getElementById(i.id.replace("_load","_rpe")).value;
saveHistory(i.id, i.value, rpe);
}

});

DB[day]=data;

localStorage.setItem("fitnessDB",JSON.stringify(DB));

alert("🔥 Treino da semana salvo!");
}

// =========================
// 📈 AVANÇAR SEMANA (CICLO)
// =========================
function nextWeek(){

WEEK++;

if(WEEK > 4) WEEK = 1;

localStorage.setItem("week",WEEK);

alert("📈 Semana avançada para: " + WEEK);

openDay("seg");
}

// =========================
// 🧠 IA DE ANÁLISE
// =========================
function showAI(ex){

let history = JSON.parse(localStorage.getItem("history")||"{}");

let h = history[ex];

if(!h || h.length < 3){
alert("Sem dados suficientes");
return;
}

let avg = h.reduce((a,b)=>a+b.value,0)/h.length;
let rpe = h.reduce((a,b)=>a+(b.rpe||8),0)/h.length;

let phase = "";

if(rpe <= 7) phase = "hipertrofia (progressão)";
else if(rpe >= 9) phase = "deload (recuperação)";
else phase = "força (manutenção)";

document.getElementById("app").innerHTML = `
<div class="card">
<h2>🧠 IA Avançada</h2>

<p><b>Exercício:</b> ${ex}</p>

<p><b>Média carga:</b> ${avg.toFixed(1)} kg</p>

<p><b>Fase atual:</b> ${phase}</p>

<p><b>Semana atual:</b> ${WEEK}</p>

<button onclick="openDay('seg')">⬅ Voltar</button>
</div>
`;
}

// =========================
// 🚀 INICIAL
// =========================
openDay("seg");
