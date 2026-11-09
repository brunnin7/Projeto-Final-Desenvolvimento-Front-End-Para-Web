'use strict';

// Elementos da interface.
const $ = (id) => document.getElementById(id);
const views = ['welcome', 'game', 'results', 'load-error'];
const letters = ['A', 'B', 'C', 'D'];
const RANKING_KEY = 'ranking';
const MAX_RANKING_ENTRIES = 10;

// Estado do jogo.
let questions = [];
let position = 0;
let score = 0;
let playerName = '';
let answered = false;
let rankingSaved = false;
let questionsLoaded = false;

function showView(viewId) {
  views.forEach((id) => $(id).classList.toggle('hidden', id !== viewId));
  $('features').classList.toggle('hidden', viewId !== 'welcome');

  if (viewId === 'game' || viewId === 'results') {
    $(viewId).focus({ preventScroll: true });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateQuestions(data) {
  return Array.isArray(data) &&
    data.length >= 3 &&
    data.every((question) =>
      typeof question.pergunta === 'string' &&
      question.pergunta.trim().length > 0 &&
      Array.isArray(question.alternativas) &&
      question.alternativas.length === 4 &&
      question.alternativas.every((option) =>
        typeof option === 'string' && option.trim().length > 0
      ) &&
      Number.isInteger(question.resposta) &&
      question.resposta >= 0 &&
      question.resposta < 4 &&
      typeof question.explicacao === 'string' &&
      question.explicacao.trim().length > 0 &&
      typeof question.fonte === 'string' &&
      /^https:\/\/.+/i.test(question.fonte)
    );
}

async function loadQuestions() {
  try {
    const response = await fetch('./perguntas.json', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Falha ao buscar perguntas.json (HTTP ${response.status}).`);
    }

    const data = await response.json();

    if (!validateQuestions(data)) {
      throw new Error('O arquivo perguntas.json não segue o formato esperado.');
    }

    questions = data;
    questionsLoaded = true;
    return true;
  } catch (error) {
    console.error('Erro ao carregar perguntas.json:', error);
    $('load-error-message').textContent =
      `${error.message} Verifique se perguntas.json está na mesma pasta do index.html e abra o site pelo Live Server ou por HTTPS.`;
    showView('load-error');
    $('retry-btn').focus();
    return false;
  }
}

function getRanking() {
  try {
    const saved = sessionStorage.getItem(RANKING_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry) =>
      entry &&
      typeof entry.nome === 'string' &&
      Number.isFinite(entry.pontuacao) &&
      Number.isFinite(entry.total) &&
      entry.total > 0 &&
      typeof entry.data === 'number'
    );
  } catch (error) {
    console.warn('Não foi possível ler o ranking da sessão:', error);
    return [];
  }
}

function saveRanking() {
  if (rankingSaved) return;

  let ranking = getRanking();
  ranking.push({
    nome: playerName,
    pontuacao: score,
    total: questions.length,
    data: latestEntryTimestamp || Date.now()
  });

  ranking.sort((a, b) => {
    const percentageA = a.pontuacao / a.total;
    const percentageB = b.pontuacao / b.total;
    return percentageB - percentageA || b.data - a.data;
  });

  ranking = ranking.slice(0, MAX_RANKING_ENTRIES);

  try {
    // O ranking permanece salvo durante a sessão desta aba.
    sessionStorage.setItem("ranking", JSON.stringify(ranking));
    rankingSaved = true;
  } catch (error) {
    console.error('Não foi possível salvar o ranking no sessionStorage:', error);
  }
}

function renderRanking() {
  const rankingList = $('ranking-list');
  const ranking = getRanking();
  rankingList.replaceChildren();

  if (ranking.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'ranking-empty';
    emptyItem.textContent = 'Ainda não há partidas registradas nesta sessão.';
    rankingList.appendChild(emptyItem);
    return;
  }

  ranking.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'ranking-item';

    const rank = document.createElement('span');
    rank.className = 'ranking-position';
    rank.textContent = `${index + 1}º`;

    const name = document.createElement('span');
    name.className = 'ranking-name';
    name.textContent = entry.nome;

    const points = document.createElement('strong');
    points.className = 'ranking-score';
    points.textContent = `${entry.pontuacao}/${entry.total}`;

    item.append(rank, name, points);

    if (entry.nome === playerName && entry.data === latestEntryTimestamp) {
      item.classList.add('ranking-current');
      const current = document.createElement('span');
      current.className = 'ranking-current-label';
      current.textContent = 'Sua partida';
      item.appendChild(current);
    }

    rankingList.appendChild(item);
  });
}

let latestEntryTimestamp = null;

async function startQuiz() {
  const nameInput = $('player-name');
  const typedName = nameInput.value.trim();

  if (typedName.length < 2) {
    nameInput.setCustomValidity('Digite um nome com pelo menos 2 caracteres.');
    nameInput.reportValidity();
    nameInput.focus();
    return;
  }

  nameInput.setCustomValidity('');
  playerName = typedName;

  if (!questionsLoaded && !(await loadQuestions())) {
    return;
  }

  beginRound();
}

function beginRound() {
  position = 0;
  score = 0;
  answered = false;
  rankingSaved = false;
  latestEntryTimestamp = null;

  $('game-player-name').textContent = playerName;
  showView('game');
  renderQuestion();
}

function renderQuestion() {
  answered = false;

  const question = questions[position];
  const progress = Math.round(((position + 1) / questions.length) * 100);

  $('question-counter').textContent = `Pergunta ${position + 1} de ${questions.length}`;
  $('progress').setAttribute('aria-valuenow', String(progress));
  $('progress-fill').style.width = `${progress}%`;
  $('question').textContent = question.pergunta;
  $('feedback').classList.add('hidden');
  $('next-btn').disabled = true;
  $('next-btn').textContent = position === questions.length - 1
    ? 'Ver resultado →'
    : 'Próxima pergunta →';

  const answers = $('answers');
  answers.replaceChildren();

  question.alternativas.forEach((optionText, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer';
    button.dataset.option = String(index);

    const letter = document.createElement('span');
    letter.className = 'answer-letter';
    letter.textContent = letters[index];

    const label = document.createElement('span');
    label.className = 'answer-label';
    label.textContent = optionText;

    button.append(letter, label);
    button.addEventListener('click', () => chooseAnswer(index));
    answers.appendChild(button);
  });

  $('question').focus({ preventScroll: true });
}

function chooseAnswer(selectedIndex) {
  if (answered) return;

  answered = true;
  const question = questions[position];
  const isCorrect = selectedIndex === question.resposta;

  if (isCorrect) score += 1;

  Array.from($('answers').children).forEach((button, index) => {
    button.disabled = true;

    const status = document.createElement('span');
    status.className = 'answer-status';

    if (index === question.resposta) {
      button.classList.add('correct');
      status.textContent = 'Resposta correta';
    } else if (index === selectedIndex) {
      button.classList.add('incorrect');
      status.textContent = 'Sua escolha';
    } else {
      button.classList.add('dimmed');
    }

    if (status.textContent) button.appendChild(status);
  });

  const feedback = $('feedback');
  feedback.classList.remove('hidden', 'wrong');
  if (!isCorrect) feedback.classList.add('wrong');

  $('feedback-heading').textContent = isCorrect
    ? 'Resposta correta ✓'
    : `Incorreta — a certa era ${letters[question.resposta]}.`;

  $('feedback-text').textContent = question.explicacao;
  $('feedback-source').href = question.fonte;
  $('feedback-source').setAttribute('aria-label', 'Abrir a fonte de estudo em uma nova aba');

  $('next-btn').disabled = false;
  $('feedback-heading').focus({ preventScroll: true });
}

function goToNextQuestion() {
  if (!answered) return;

  if (position < questions.length - 1) {
    position += 1;
    renderQuestion();
    return;
  }

  finishQuiz();
}

function finishQuiz() {
  latestEntryTimestamp = Date.now();
  saveRanking();
  $('final-score').textContent = `${score}/${questions.length}`;

  const percentage = score / questions.length;
  $('result-description').textContent = percentage === 1
    ? 'Excelente! Você acertou todas as questões. Continue praticando!'
    : percentage >= 0.7
      ? 'Muito bem! Você já conhece bastante sobre HTML. Revise os pontos que errou.'
      : percentage >= 0.4
        ? 'Bom começo! Continue estudando e use as explicações para fortalecer sua base.'
        : 'Cada tentativa é uma chance de aprender. Revise as explicações e tente novamente.';

  $('result-player').textContent = `Partida de ${playerName}`;
  renderRanking();
  showView('results');
}

function replay() {
  // A partida recomeça sem recarregar a página e sem apagar o ranking.
  beginRound();
}

function returnToWelcome() {
  showView('welcome');
  $('player-name').focus();
}

function initialize() {
  $('player-form').addEventListener('submit', (event) => {
    event.preventDefault();
    startQuiz();
  });

  $('retry-btn').addEventListener('click', startQuiz);
  $('next-btn').addEventListener('click', goToNextQuestion);
  $('restart-btn').addEventListener('click', replay);
  $('exit-btn').addEventListener('click', returnToWelcome);
  $('home-btn').addEventListener('click', returnToWelcome);

  $('player-name').addEventListener('input', () => {
    $('player-name').setCustomValidity('');
  });

  $('year').textContent = new Date().getFullYear();
}

initialize();
