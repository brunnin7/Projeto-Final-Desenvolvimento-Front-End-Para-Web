'use strict';

const $ = (id) => document.getElementById(id);
const views = ['welcome', 'game', 'results', 'load-error'];
const letters = ['A', 'B', 'C', 'D'];
let questions = [];
let position = 0;
let score = 0;
let chosen = false;

function showView(id) {
  views.forEach((view) => $(view).classList.toggle('hidden', view !== id));
  if (id === 'game' || id === 'results') $(id).focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validQuestions(data) {
  return Array.isArray(data) && data.length >= 3 && data.every((q) =>
    typeof q.pergunta === 'string' && q.pergunta.trim() &&
    Array.isArray(q.alternativas) && q.alternativas.length === 4 &&
    q.alternativas.every((option) => typeof option === 'string' && option.trim()) &&
    Number.isInteger(q.resposta) && q.resposta >= 0 && q.resposta < 4 &&
    typeof q.explicacao === 'string' && q.explicacao.trim() &&
    typeof q.fonte === 'string' && /^https:\/\//.test(q.fonte)
  );
}

async function loadQuestions() {
  try {
    const response = await fetch('./perguntas.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar perguntas.json');
    const data = await response.json();
    if (!validQuestions(data)) throw new Error('Formato inválido de perguntas.json');
    questions = data;
    return true;
  } catch (error) {
    console.error('Erro ao carregar as perguntas:', error);
    showView('load-error');
    return false;
  }
}

async function startQuiz() {
  if (!(await loadQuestions())) return;
  position = 0;
  score = 0;
  showView('game');
  renderQuestion();
}

function renderQuestion() {
  chosen = false;
  const q = questions[position];
  $('question-counter').textContent = `Pergunta ${position + 1} de ${questions.length}`;
  $('progress').setAttribute('aria-valuenow', String(Math.round((position / questions.length) * 100)));
  $('progress-fill').style.width = `${(position / questions.length) * 100}%`;
  $('question').textContent = q.pergunta;
  $('feedback').className = 'feedback hidden';
  $('next-btn').disabled = true;
  $('next-btn').innerHTML = position === questions.length - 1 ? 'Ver resultado <span aria-hidden="true">→</span>' : 'Próxima pergunta <span aria-hidden="true">→</span>';
  const answers = $('answers');
  answers.replaceChildren();
  q.alternativas.forEach((text, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer';
    const letter = document.createElement('span');
    letter.className = 'answer-letter';
    letter.textContent = letters[index];
    const label = document.createElement('span');
    label.textContent = text;
    button.append(letter, label);
    button.addEventListener('click', () => answer(index));
    answers.appendChild(button);
  });
}

function answer(index) {
  if (chosen) return;
  chosen = true;
  const q = questions[position];
  const correct = index === q.resposta;
  if (correct) score++;
  Array.from($('answers').children).forEach((button, optionIndex) => {
    button.disabled = true;
    if (optionIndex === q.resposta) button.classList.add('correct');
    else if (optionIndex === index) button.classList.add('incorrect');
    else button.classList.add('dimmed');
  });
  const feedback = $('feedback');
  feedback.className = correct ? 'feedback' : 'feedback wrong';
  $('feedback-heading').textContent = correct ? '✓ Resposta correta!' : '✕ Ainda não! Vamos entender.';
  $('feedback-text').textContent = q.explicacao;
  $('feedback-source').href = q.fonte;
  $('next-btn').disabled = false;
}

function nextQuestion() {
  if (!chosen) return;
  position++;
  if (position < questions.length) {
    renderQuestion();
    $('question').scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    showResults();
  }
}

function showResults() {
  showView('results');
  $('final-score').textContent = `${score}/${questions.length}`;
  const rate = score / questions.length;
  $('result-description').textContent = rate === 1
    ? 'Excelente! Você acertou todas as questões. Continue praticando!'
    : rate >= 0.7
      ? 'Muito bem! Você já conhece bastante sobre HTML. Revise os pontos que errou.'
      : rate >= 0.4
        ? 'Bom começo! As explicações ajudam a fortalecer sua base em HTML.'
        : 'Cada tentativa é uma chance de aprender. Revise as explicações e tente novamente!';
}

$('start-btn').addEventListener('click', startQuiz);
$('retry-btn').addEventListener('click', startQuiz);
$('next-btn').addEventListener('click', nextQuestion);
$('restart-btn').addEventListener('click', startQuiz);
$('exit-btn').addEventListener('click', () => showView('welcome'));
$('home-btn').addEventListener('click', () => showView('welcome'));
$('year').textContent = new Date().getFullYear();
