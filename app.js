// 🔥 CONFIG FIREBASE (COLOCA O SEU)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAP2mwIHUqMrceO1eIVeH7fSmF3s2k_RrA",
  authDomain: "hoopstats-39275.firebaseapp.com",
  databaseURL: "https://hoopstats-39275-default-rtdb.firebaseio.com",
  projectId: "hoopstats-39275",
  storageBucket: "hoopstats-39275.firebasestorage.app",
  messagingSenderId: "286291093416",
  appId: "1:286291093416:web:077898c39d8bd59429df9d",
  measurementId: "G-VP4VN5VB9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let players = [];

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("login").style.display = "none";
      document.getElementById("app").style.display = "flex";
      loadPlayers();
    })
    .catch(() => alert("Erro no login"));
}

// ADD PLAYER
function addPlayer() {
  const name = prompt("Nome do jogador");

  if (!name) return;

  db.collection("players").add({
    name,
    points: 0,
    assists: 0,
    rebounds: 0
  });

  loadPlayers();
}

// LOAD
function loadPlayers() {
  db.collection("players").get().then(snapshot => {
    players = [];
    snapshot.forEach(doc => players.push(doc.data()));
    renderGalaxy();
    renderChart();
  });
}

// GALAXY
function renderGalaxy() {
  const g = document.getElementById("galaxy");
  g.innerHTML = "";

  players.forEach((p, i) => {
    const el = document.createElement("div");
    el.className = "planet";

    el.style.top = (50 + i * 70) + "px";
    el.style.left = (80 + i * 90) + "px";

    el.onclick = () => {
      let action = prompt(`Stats de ${p.name}\nDigite: 1=+2pts, 2=+3pts`);

      if (action == "1") p.points += 2;
      if (action == "2") p.points += 3;

      savePlayer(p);
    };

    g.appendChild(el);
  });
}

// SAVE
function savePlayer(player) {
  db.collection("players")
    .where("name", "==", player.name)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        db.collection("players").doc(doc.id).update(player);
      });
      loadPlayers();
    });
}

// CHART
function renderChart() {
  const ctx = document.getElementById("chart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: players.map(p => p.name),
      datasets: [{
        label: "Points",
        data: players.map(p => p.points)
      }]
    }
  });
}

// NAV
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(page).classList.add("active");
}