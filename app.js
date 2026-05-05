let DB = JSON.parse(localStorage.getItem("fitnessDB") || "{}");

// =========================
// 📊 HISTÓRICO
// =========================
function saveHistory(exercise, value, rpe){

let history = JSON.parse(localStorage.getItem("history") || "{}");

if(!history[exercise]){
history[exercise] = [];
}

history[exercise].push({
value: Number(value),
rpe: Number(rpe),
date: new Date().toISOString()
});

localStorage.setItem("history", JSON.stringify(history));
}

// =========================
// 🧠 IA DE PERIODIZAÇÃO
// =========================
function analyzeExerciseCycle(history){

if(!history || history.length < 3){
return {
phase:"adaptação",
recommendation:"Construção de base técnica",
nextLoad:2.5
};
}

let avg = history.reduce((a,b)=>a+b.value,0)/history.length;
let last = history[history.length-1].value;
let rpe = history.reduce((a,b)=>a+(b.rpe||8),0)/history.length;

if(rpe <= 7){
return {
phase:"hipertrofia",
recommendation:"Aumentar carga 2.5–5%",
nextLoad: Math.round(last * 1.025)
};
}

if(rpe >= 9){
return {
phase:"deload",
recommendation:"Reduzir 10–15% para recuperação",
nextLoad: Math.round(last * 0.85)
};
}

if(last === avg){
return {
phase:"platô",
recommendation:"Variar estímulo ou descanso",
nextLoad: last
};
}

return {
phase:"força",
recommendation:"Manter progressão controlada",
nextLoad: Math.round(last * 1.03)
};
}

// =========================
// 🤖 IA QUE MONTA TREINO SOZINHA
// =========================
function generateWorkout(day){

const muscleGroups = {
push:["Supino reto","Supino inclinado","Desenvolvimento ombro","Tríceps corda"],
pull:["Puxada frontal","Remada baixa","Rosca direta","Face pull"],
legs:["Agachamento","Leg press","Stiff","Panturrilha"],
core:["Prancha","Abdominal infra","Crunch","Prancha lateral"]
};

const split = {
seg:"push",
ter:"legs",
qua:"pull",
qui:"core",
sex:"push",
sab:"legs"
};

let group = split[day] || "full";

let exercises = muscleGroups[group] || ["Treino livre"];

// 🔁 IA: randomização inteligente + variação
return exercises
.sort(()=>Math.random()-0.5)
.slice(0,3);
}

// =========================
// 📅 ABRIR DIA
// =========================
function openDay(day){

let exercises = generateWorkout(day);

let html = `
<div class="card">
<h2>🤖 Treino IA - ${day.toUpperCase()}</h2>
`;

exercises.forEach(ex=>{

html += `
<div class="card">
<b>${ex}</b>

<input id="${ex}_load" placeholder="Carga (kg)">
<input id="${ex}_rpe" placeholder="RPE (1-10)">

<button onclick="showAI('${ex}')">🧠 IA análise</button>
</div>
`;
});

html += `
<textarea id="notes" placeholder="Notas do treino"></textarea>

<button onclick="save('${day}')">💾 Salvar treino</button>
</div>
`;

document.getElementById("app").innerHTML = html;
}

// =========================
// 💾 SALVAR TREINO
// =========================
function save(day){

let data = {
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

alert("🔥 Treino salvo com IA!");
}

// =========================
// 🧠 PAINEL IA
// =========================
function showAI(ex){

let history = JSON.parse(localStorage.getItem("history")||"{}");

let analysis = analyzeExerciseCycle(history[ex]);

document.getElementById("app").innerHTML = `
<div class="card">
<h2>🧠 IA de Periodização</h2>

<p><b>Exercício:</b> ${ex}</p>

<p><b>Fase:</b> ${analysis.phase}</p>

<p><b>Recomendação:</b> ${analysis.recommendation}</p>

<p><b>Próxima carga sugerida:</b> ${analysis.nextLoad} kg</p>

<br>

<button onclick="openDay('seg')">⬅ Voltar</button>
</div>
`;
}

// =========================
// 🚀 INICIAL
// =========================
openDay("seg");