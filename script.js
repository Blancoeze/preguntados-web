// ====== CONFIGURAR SUPABASE ======
const supabaseUrl = "https://TU-PROJECT.supabase.co";      // <-- cambia esto
const supabaseKey = "TU-API-KEY";                          // <-- y esto
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ====== ESTADO DEL JUEGO ======
let currentCategory = null;
let questions = [];
let index = 0;

// ====== ABRIR CATEGORÍA ======
async function openCategory(cat) {
  currentCategory = cat;
  index = 0;

  document.getElementById("menu").style.display = "none";
  document.getElementById("gameArea").style.display = "block";

  document.getElementById("categoryTitle").textContent =
    "Categoría: " + capitalizar(cat);

  await loadQuestionsFromSupabase(cat);
  if (!questions || questions.length === 0) {
    document.getElementById("questionText").textContent =
      "No hay preguntas cargadas para esta categoría.";
    document.getElementById("options").innerHTML = "";
    document.getElementById("result").textContent = "";
    document.getElementById("nextBtn").style.display = "none";
    return;
  }

  document.getElementById("nextBtn").style.display = "inline-block";
  loadQuestion();
}

// ====== CARGAR PREGUNTAS ALEATORIAS ======
async function loadQuestionsFromSupabase(cat) {
  // obtener id de la categoría
  const { data: categoryData, error: catError } = await supabaseClient
    .from("categories")
    .select("id")
    .eq("name", cat)
    .single();

  if (catError || !categoryData) {
    console.error(catError);
    questions = [];
    return;
  }

  const categoryId = categoryData.id;

  // obtener 10 preguntas aleatorias
  const { data: qData, error: qError } = await supabaseClient
    .from("questions")
    .select("*")
    .eq("category_id", categoryId)
    .order("id", { ascending: false }); // si querés random: usar RPC o vista
    // para random puro en SQL:
    // .order("random()").limit(10);

  if (qError || !qData) {
    console.error(qError);
    questions = [];
    return;
  }

  // si hay más de 10, recortamos y mezclamos rápido en JS
  const mezcladas = shuffleArray(qData);
  questions = mezcladas.slice(0, 10);
}

// ====== MOSTRAR PREGUNTA ======
function loadQuestion() {
  const q = questions[index];

  document.getElementById("questionText").textContent = q.question;
  document.getElementById("result").textContent = "";

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const opciones = [q.option1, q.option2, q.option3, q.option4];

  opciones.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.classList.add("optionBtn");
    btn.onclick = () => checkAnswer(i + 1, btn);
    optionsDiv.appendChild(btn);
  });
}

// ====== CHEQUEAR RESPUESTA (COLORES) ======
function checkAnswer(selected, btn) {
  const correct = questions[index].correct;
  const allButtons = document.querySelectorAll(".optionBtn");

  allButtons.forEach(b => b.disabled = true);

  if (selected === correct) {
    btn.style.backgroundColor = "green";
    document.getElementById("result").textContent = "✔ Correcto!";
  } else {
    btn.style.backgroundColor = "red";
    document.getElementById("result").textContent = "✖ Incorrecto!";
    // marcar también la correcta en verde
    const correctBtn = allButtons[correct - 1];
    if (correctBtn) correctBtn.style.backgroundColor = "green";
  }
}

// ====== SIGUIENTE PREGUNTA ======
function nextQuestion() {
  index++;

  if (index >= questions.length) {
    document.getElementById("result").textContent =
      "🏆 ¡Completaste la categoría!";
    document.getElementById("questionText").textContent = "";
    document.getElementById("options").innerHTML = "";
    document.getElementById("nextBtn").style.display = "none";
    return;
  }

  loadQuestion();
}

// ====== VOLVER AL MENÚ ======
function backToMenu() {
  currentCategory = null;
  questions = [];
  index = 0;

  document.getElementById("menu").style.display = "block";
  document.getElementById("gameArea").style.display = "none";
}

// ====== UTILIDADES ======
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const { data: qData } = await supabase
  .from("questions")
  .select("*")
  .eq("category_id", categoryId)
  .order("random()")
  .limit(10);
const supabase = supabase.createClient(
  "https://blancoeze.github.io/preguntados-web/",
  "sb_publishable_5rQ_q5VnEzrida7RlmRHnw_v89UC9eA"
);
