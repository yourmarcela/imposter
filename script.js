// Firebase config (aus deinem Projekt)
const firebaseConfig = {
  apiKey: "AIzaSyApPgstLrl_aL9fseVkxgwOkl1bTL7btlg",
  authDomain: "imposter-5b082.firebaseapp.com",
  projectId: "imposter-5b082",
  storageBucket: "imposter-5b082.appspot.com",
  messagingSenderId: "502868656077",
  appId: "1:502868656077:web:64ba1769f70cfc7cbc4e84",
  measurementId: "G-CE4LY6CTDB"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// UI Elemente
const roomSelectDiv = document.getElementById('roomSelect');
const roomNameInput = document.getElementById('roomNameInput');
const joinRoomBtn = document.getElementById('joinRoomBtn');

const loginDiv = document.getElementById('login');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nicknameInput = document.getElementById('nickname');
const loginBtn = document.getElementById('loginBtn');

const gameDiv = document.getElementById('game');
const playerNameSpan = document.getElementById('playerName');
const currentRoomNameSpan = document.getElementById('currentRoomName');
const roleSpan = document.getElementById('role');
const secretWordSpan = document.getElementById('secretWord');
const hintInput = document.getElementById('hintInput');
const sendHintBtn = document.getElementById('sendHintBtn');
const hintsList = document.getElementById('hintsList');
const startGameBtn = document.getElementById('startGameBtn');

const chatList = document.getElementById('chatList');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');

let currentUser = null;
let currentGameId = null;
let secretWord = '';
const wordList = ['Katze', 'Auto', 'Pizza', 'Buch', 'Computer'];

// Raum beitreten
joinRoomBtn.onclick = () => {
  const roomName = roomNameInput.value.trim();
  if (!roomName) {
    alert('Bitte gib einen Raum-Namen ein!');
    return;
  }
  currentGameId = roomName;
  roomSelectDiv.style.display = 'none';
  loginDiv.style.display = 'block';
};

// Login und Spieler hinzufügen
loginBtn.onclick = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const nickname = nicknameInput.value.trim();

  if (!email || !password || !nickname) {
    alert('Bitte E-Mail, Passwort und Nickname ausfüllen!');
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      currentUser = user;
      return addPlayerToGame(nickname);
    })
    .catch(error => {
      if (error.code === 'auth/user-not-found') {
        auth.createUserWithEmailAndPassword(email, password)
          .then(({ user }) => {
            currentUser = user;
            return addPlayerToGame(nickname);
          })
          .catch(err => alert('Registrierungsfehler: ' + err.message));
      } else {
        alert('Login-Fehler: ' + error.message);
      }
    });
};

// Spieler in Firestore speichern
function addPlayerToGame(nickname) {
  return db.collection('games').doc(currentGameId).collection('players').doc(currentUser.uid).set({
    nickname,
    role: null,
    hint: ''
  }).then(() => {
    loginDiv.style.display = 'none';
    gameDiv.style.display = 'block';
    playerNameSpan.textContent = nickname;
    currentRoomNameSpan.textContent = currentGameId;
    startGameBtn.style.display = 'block';
    listenGameUpdates();
    listenChat();
  });
}

// Spiel starten
startGameBtn.onclick = async () => {
  const playersSnapshot = await db.collection('games').doc(currentGameId).collection('players').get();
  if (playersSnapshot.size < 4) {
    alert('Mindestens 4 Spieler werden benötigt!');
    return;
  }

  secretWord = wordList[Math.floor(Math.random() * wordList.length)];

  const players = [];
  playersSnapshot.forEach(doc => {
    players.push({ id: doc.id, nickname: doc.data().nickname });
  });

  const imposterIndex = Math.floor(Math.random() * players.length);

  const batch = db.batch();

  players.forEach((p, idx) => {
    const playerRef = db.collection('games').