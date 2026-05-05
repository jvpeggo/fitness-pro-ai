let DB = JSON.parse(localStorage.getItem("db") || "{}");

// -------------------------
// 🎥 vídeos simples (demo)
// -------------------------
const videos = {
  "Supino reto": "https://www.w3schools.com/html/mov_bbb.mp4",
  "Agachamento": "https://www.w3schools.com/html/movie.mp4",
  "Remada": "https://www.w3schools.com/html/mov_bbb.mp4",
  "Leg press": "https://www.w3schools.com/html/movie.mp4",
  "Ombro": "https://www.w3schools.com/html/mov_bbb.mp4"
};

// -------------------------
// 🏋️ lista de exercícios
// -------------------------
function getExercises() {
  return Object.keys(videos);
}

// -------------------------
// 📱 render
// -------------------------
function render() {
  const app = document.getElementById("app");

  let html = `<h1>🏋️ Fitness App</h1>`;

  getExercises().forEach(ex => {
    html += `
      <div class="card">
        <h3>${ex}</h3>

        <video autoplay loop muted playsinline>
          <source src="${videos[ex]}" type="video/mp4">
        </video>

        <label>Carga (kg)</label>
        <input id="${ex}_load" value="${DB[ex]?.load || ""}">

        <label>RPE</label>
        <input id="${ex}_rpe" value="${DB[ex]?.rpe || ""}">

        <button onclick="save('${ex}')">Salvar</button>
      </div>
    `;
  });

  app.innerHTML = html;
}

// -------------------------
// 💾 salvar
// -------------------------
function save(ex) {
  const load = document.getElementById(ex + "_load").value;
  const rpe = document.getElementById(ex + "_rpe").value;

  DB[ex] = { load, rpe };

  localStorage.setItem("db", JSON.stringify(DB));

  alert("Salvo!");
}

// -------------------------
// start
// -------------------------
render();
