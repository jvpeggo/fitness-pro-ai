let DB = JSON.parse(localStorage.getItem("fitnessDB") || "{}");
let WEEK = parseInt(localStorage.getItem("week") || "1");

// =========================
// 🎥 VÍDEOS (substitui GIFs)
// =========================
const videoMap = {
  "Supino reto": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "Supino inclinado": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "Agachamento": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "Leg press": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "Remada baixa": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "Puxada frontal": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "Stiff": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "Desenvolvimento ombro": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "Tríceps corda": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "Rosca direta": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
};

// =========================
// 📊 HISTÓRICO
// =========================
function saveHistory(exercise, value, rpe, setsDone) {
  let history = JSON.parse(localStorage.getItem("history") || "{}");

  if (!history[exercise]) {
    history[exercise] = [];
  }

  history[exercise].push({
    value: Number(value),
    rpe: Number(rpe),
    setsDone: Number(setsDone),
    date: new Date().toISOString(),
    week: WEEK
  });

  localStorage.setItem("history", JSON.stringify(history));
}

// =========================
// 📅 FASE
// =========================
function getPhase() {
  if (WEEK === 1) return "adaptação";
  if (WEEK === 2) return "base";
  if (WEEK === 3) return "progressão";
  if (WEEK === 4) return "deload";
  return "base";
}

// =========================
// 🏃 CARDIO
// =========================
function getCardio(day) {
  const map = {
    seg: "Fitdance",
    ter: "Funcional",
    qua: "Fitdance",
    qui: "Funcional",
    sex: "Fitdance",
    sab: "Fitdance",
    dom: "Descanso"
  };

  return map[day];
}

// =========================
// 🏋️ EXERCÍCIOS
// =========================
function getExercises() {
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

  return list.sort(() => Math.random() - 0.5).slice(0, 6);
}

// =========================
// 📅 ABRIR DIA
// =========================
function openDay(day) {
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

  exercises.forEach(ex => {
    let video = videoMap[ex] || "";

    html += `
    <div class="card">
      <h4>${ex}</h4>

      <video 
        width="100%" 
        style="border-radius:10px"
        autoplay 
        loop 
        muted 
        playsinline
      >
        <source src="${video}" type="video/mp4">
      </video>

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
function save(day) {
  let data = {
    week: WEEK,
    cardio: getCardio(day),
    exercises: {},
    notes: document.getElementById("notes").value
  };

  document.querySelectorAll("input").forEach(i => {
    data.exercises[i.id] = i.value;

    if (i.id.includes("_load")) {
      let base = i.id.replace("_load", "");
      let rpe = document.getElementById(base + "_rpe").value;
      let setsDone = document.getElementById(base + "_sets_done").value;

      saveHistory(base, i.value, rpe, setsDone);
    }
  });

  DB[day] = data;

  localStorage.setItem("fitnessDB", JSON.stringify(DB));

  alert("🔥 Treino completo salvo!");
}

// =========================
// 📈 SEMANA
// =========================
function nextWeek() {
  WEEK++;
  if (WEEK > 4) WEEK = 1;

  localStorage.setItem("week", WEEK);
  openDay("seg");
}

// =========================
// 🚀 INICIAL
// =========================
openDay("seg");
