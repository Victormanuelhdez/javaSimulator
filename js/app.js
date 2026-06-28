const screens = {
    profile: document.getElementById("profile-screen"),
    home: document.getElementById("home-screen"),
    configure: document.getElementById("configure-screen"),
    exam: document.getElementById("exam-screen"),
    glossary: document.getElementById("glossary-screen"),
    history: document.getElementById("history-screen"),
    result: document.getElementById("result-screen")
};

const elements = {
    brandLink: document.getElementById("brand-link"),
    menuButton: document.getElementById("menu-button"),
    closeMenuButton: document.getElementById("close-menu-button"),
    sideMenu: document.getElementById("side-menu"),
    menuOverlay: document.getElementById("menu-overlay"),
    themeButton: document.getElementById("theme-button"),
    themeIcon: document.getElementById("theme-icon"),
    profileButton: document.getElementById("profile-button"),
    profileButtonName: document.getElementById("profile-button-name"),
    headerWelcomeTitle: document.getElementById("header-welcome-title"),
    headerExamButton: document.getElementById("header-exam-button"),
    headerGlossaryButton: document.getElementById("header-glossary-button"),
    profileForm: document.getElementById("profile-form"),
    profileAttempts: document.getElementById("profile-attempts"),
    profileCorrect: document.getElementById("profile-correct"),
    profileIncorrect: document.getElementById("profile-incorrect"),
    scoreChart: document.getElementById("score-chart"),
    answersChart: document.getElementById("answers-chart"),
    nameInput: document.getElementById("name-input"),
    configurationForm: document.getElementById("exam-configuration-form"),
    topicSelect: document.getElementById("topic-select"),
    bestScore: document.getElementById("best-score"),
    examCount: document.getElementById("exam-count"),
    savedProgress: document.getElementById("saved-progress"),
    resumePanel: document.getElementById("resume-panel"),
    resumeButton: document.getElementById("resume-button"),
    questionTopic: document.getElementById("question-topic"),
    questionProgress: document.getElementById("question-progress"),
    progressBar: document.getElementById("progress-bar"),
    questionDifficulty: document.getElementById("question-difficulty"),
    questionType: document.getElementById("question-type"),
    questionText: document.getElementById("question-text"),
    questionCodeCard: document.getElementById("question-code-card"),
    questionCode: document.getElementById("question-code"),
    copyCodeButton: document.getElementById("copy-code-button"),
    answerForm: document.getElementById("answer-form"),
    previousButton: document.getElementById("previous-question-button"),
    submitButton: document.getElementById("submit-answer-button"),
    nextButton: document.getElementById("next-question-button"),
    feedback: document.getElementById("feedback"),
    feedbackIcon: document.getElementById("feedback-icon"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackAnswer: document.getElementById("feedback-answer"),
    feedbackExplanation: document.getElementById("feedback-explanation"),
    glossarySearch: document.getElementById("glossary-search"),
    glossaryResults: document.getElementById("glossary-results"),
    clearHistoryButton: document.getElementById("clear-history-button"),
    historyList: document.getElementById("history-list"),
    scorePercentage: document.getElementById("score-percentage"),
    scoreSummary: document.getElementById("score-summary"),
    correctCount: document.getElementById("correct-count"),
    incorrectCount: document.getElementById("incorrect-count"),
    restartButton: document.getElementById("restart-button"),
    homeButton: document.getElementById("home-button")
};

const STORAGE_KEYS = {
    history: "javaExamHistory",
    profile: "javaExamProfile",
    theme: "javaExamTheme",
    session: "javaExamSession"
};

const icons = {
    check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>`,
    cross: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>`,
    sun: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.42 1.42"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.42"></path></svg>`,
    moon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path></svg>`
};

let examQuestions = [];
let currentQuestionIndex = 0;
let answersByQuestion = {};
let activeConfiguration = { questionCount: 40, topic: "all" };

function readJson(key, fallback) {
    const value = localStorage.getItem(key);
    if (!value) return fallback;

    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function getProfile() {
    return readJson(STORAGE_KEYS.profile, null);
}

function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

function getExamHistory() {
    return readJson(STORAGE_KEYS.history, []);
}

function saveExamResult(result) {
    const history = getExamHistory();
    history.unshift(result);
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(0, 50)));
}

function clearExamHistory() {
    localStorage.removeItem(STORAGE_KEYS.history);
}

function getExamSession() {
    return readJson(STORAGE_KEYS.session, null);
}

function saveExamSession(session) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

function clearExamSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
}

function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme) || "light";
}

function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function showScreen(screenName) {
    Object.values(screens).forEach((screen) => screen.classList.add("hidden"));
    screens[screenName].classList.remove("hidden");

    document.body.classList.toggle("home-view", screenName === "home");

    document.querySelectorAll(".desktop-navigation__link").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.desktopRoute === screenName);
    });

    closeMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function routeTo(screenName) {
    if (screenName === "exam") {
        screenName = "configure";
    }

    if (screenName === "profile") {
        const profile = getProfile();
        elements.nameInput.value = profile?.name || "";
        refreshProfileStats();
    }

    if (screenName === "home") refreshHome();
    if (screenName === "glossary") renderGlossary(elements.glossarySearch.value);
    if (screenName === "history") renderHistory();

    showScreen(screenName);
}

function openMenu() {
    elements.sideMenu.classList.add("is-open");
    elements.menuOverlay.classList.remove("hidden");
    elements.sideMenu.setAttribute("aria-hidden", "false");
}

function closeMenu() {
    elements.sideMenu.classList.remove("is-open");
    elements.menuOverlay.classList.add("hidden");
    elements.sideMenu.setAttribute("aria-hidden", "true");
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    elements.themeIcon.innerHTML = theme === "dark" ? icons.sun : icons.moon;
    elements.themeButton.setAttribute(
        "aria-label",
        theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
    );

    if (!screens.profile.classList.contains("hidden")) {
        window.requestAnimationFrame(drawProfileCharts);
    }
}

function toggleTheme() {
    const nextTheme = getTheme() === "dark" ? "light" : "dark";
    saveTheme(nextTheme);
    applyTheme(nextTheme);
}

function shuffle(items) {
    const copy = [...items];

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }

    return copy;
}

function populateTopics() {
    const topics = [...new Set(QUESTION_BANK.map((question) => question.topic))]
        .sort((a, b) => a.localeCompare(b, "es"));

    topics.forEach((topic) => {
        const option = document.createElement("option");
        option.value = topic;
        option.textContent = `${topic} (${QUESTION_BANK.filter((q) => q.topic === topic).length})`;
        elements.topicSelect.appendChild(option);
    });
}

function startExam(questionCount = 40, topic = "all") {
    const source = topic === "all"
        ? QUESTION_BANK
        : QUESTION_BANK.filter((question) => question.topic === topic);

    if (source.length === 0) {
        window.alert("No hay preguntas disponibles para el tema seleccionado.");
        return;
    }

    examQuestions = shuffle(source).slice(0, Math.min(questionCount, source.length));
    currentQuestionIndex = 0;
    answersByQuestion = {};
    activeConfiguration = { questionCount, topic };

    persistSession();
    showScreen("exam");
    renderQuestion();
}

function resumeExam() {
    const session = getExamSession();

    if (!session) {
        routeTo("configure");
        return;
    }

    examQuestions = session.questionIds
        .map((id) => QUESTION_BANK.find((question) => question.id === id))
        .filter(Boolean);
    currentQuestionIndex = session.currentQuestionIndex || 0;
    answersByQuestion = session.answersByQuestion || {};
    activeConfiguration = session.configuration || {
        questionCount: examQuestions.length,
        topic: "all"
    };

    showScreen("exam");
    renderQuestion();
}

function persistSession() {
    if (examQuestions.length === 0) return;

    saveExamSession({
        questionIds: examQuestions.map((question) => question.id),
        currentQuestionIndex,
        answersByQuestion,
        configuration: activeConfiguration
    });
}

function stripInlineMarkdown(value) {
    return String(value)
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .trim();
}

function renderQuestion() {
    const question = examQuestions[currentQuestionIndex];
    const savedAnswer = answersByQuestion[question.id];

    elements.questionTopic.textContent = question.topic;
    elements.questionProgress.textContent =
        `Pregunta ${currentQuestionIndex + 1} de ${examQuestions.length}`;
    elements.progressBar.style.width =
        `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%`;
    elements.questionDifficulty.textContent = question.difficulty;
    elements.questionType.textContent =
        question.type === "multiple" ? "Respuesta múltiple" : "Respuesta única";
    elements.questionText.textContent = stripInlineMarkdown(question.question);

    const codeElement = elements.questionCode.querySelector("code");
    const questionCode = question.code?.trim() || "";

    if (questionCode) {
        elements.questionCodeCard.classList.remove("hidden");
        codeElement.textContent = questionCode;
        elements.copyCodeButton.textContent = "Copiar código";
        elements.questionCodeCard.querySelector(".code-card__body").scrollLeft = 0;
    } else {
        elements.questionCodeCard.classList.add("hidden");
        codeElement.textContent = "";
    }

    elements.answerForm.innerHTML = "";
    const inputType = question.type === "multiple" ? "checkbox" : "radio";

    question.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        label.className = "answer-option";

        const input = document.createElement("input");
        input.type = inputType;
        input.name = "answer";
        input.value = optionIndex;

        if (savedAnswer?.selectedAnswers.includes(optionIndex)) {
            input.checked = true;
        }

        const text = document.createElement("span");
        text.textContent = stripInlineMarkdown(option);

        label.append(input, text);
        elements.answerForm.appendChild(label);
    });

    elements.previousButton.disabled = currentQuestionIndex === 0;
    elements.nextButton.textContent =
        currentQuestionIndex === examQuestions.length - 1
            ? "Ver resultado"
            : "Siguiente pregunta";

    if (savedAnswer?.submitted) {
        restoreSubmittedState(question, savedAnswer);
    } else {
        elements.answerForm.querySelectorAll("input").forEach((input) => {
            input.disabled = false;
        });
        elements.feedback.className = "feedback hidden";
        elements.submitButton.classList.remove("hidden");
        elements.nextButton.classList.add("hidden");
    }
}

function getSelectedAnswers() {
    return [...elements.answerForm.querySelectorAll("input:checked")]
        .map((input) => Number(input.value))
        .sort((first, second) => first - second);
}

function arraysAreEqual(first, second) {
    return first.length === second.length &&
        first.every((value, index) => value === second[index]);
}

function submitAnswer() {
    const question = examQuestions[currentQuestionIndex];
    const selectedAnswers = getSelectedAnswers();

    if (selectedAnswers.length === 0) {
        window.alert("Selecciona al menos una opción antes de enviar tu respuesta.");
        return;
    }

    const correctAnswers = [...question.correctAnswers].sort((a, b) => a - b);
    const isCorrect = arraysAreEqual(selectedAnswers, correctAnswers);

    answersByQuestion[question.id] = {
        selectedAnswers,
        submitted: true,
        correct: isCorrect
    };

    persistSession();
    restoreSubmittedState(question, answersByQuestion[question.id]);
}

function restoreSubmittedState(question, savedAnswer) {
    const correctAnswers = [...question.correctAnswers].sort((a, b) => a - b);

    elements.answerForm.querySelectorAll("input").forEach((input) => {
        input.disabled = true;
        const optionIndex = Number(input.value);
        const label = input.closest(".answer-option");

        if (correctAnswers.includes(optionIndex)) {
            label.classList.add("is-correct");
        } else if (savedAnswer.selectedAnswers.includes(optionIndex)) {
            label.classList.add("is-incorrect");
        }
    });

    const answerText = correctAnswers
        .map((index) => stripInlineMarkdown(question.options[index]))
        .join(" | ");

    elements.feedback.className =
        `feedback ${savedAnswer.correct ? "feedback--correct" : "feedback--incorrect"}`;
    elements.feedbackIcon.innerHTML = savedAnswer.correct ? icons.check : icons.cross;
    elements.feedbackTitle.textContent =
        savedAnswer.correct ? "Respuesta correcta" : "Respuesta incorrecta";
    elements.feedbackAnswer.textContent =
        savedAnswer.correct ? "" : `Respuesta correcta: ${answerText}`;
    elements.feedbackExplanation.textContent =
        stripInlineMarkdown(question.explanation);

    elements.submitButton.classList.add("hidden");
    elements.nextButton.classList.remove("hidden");
}

function goToPreviousQuestion() {
    if (currentQuestionIndex === 0) return;
    currentQuestionIndex -= 1;
    persistSession();
    renderQuestion();
}

function goToNextQuestion() {
    if (!answersByQuestion[examQuestions[currentQuestionIndex].id]?.submitted) {
        window.alert("Envía tu respuesta antes de continuar.");
        return;
    }

    if (currentQuestionIndex < examQuestions.length - 1) {
        currentQuestionIndex += 1;
        persistSession();
        renderQuestion();
        return;
    }

    finishExam();
}

function finishExam() {
    const totalQuestions = examQuestions.length;
    const correctAnswersCount = Object.values(answersByQuestion)
        .filter((answer) => answer.correct).length;
    const incorrectAnswers = totalQuestions - correctAnswersCount;
    const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);

    const topicStats = {};

    examQuestions.forEach((question) => {
        if (!topicStats[question.topic]) {
            topicStats[question.topic] = { correct: 0, incorrect: 0 };
        }

        if (answersByQuestion[question.id]?.correct) {
            topicStats[question.topic].correct += 1;
        } else {
            topicStats[question.topic].incorrect += 1;
        }
    });

    elements.scorePercentage.textContent = `${percentage}%`;
    elements.scoreSummary.textContent =
        `Respondiste correctamente ${correctAnswersCount} de ${totalQuestions} preguntas.`;
    elements.correctCount.textContent = correctAnswersCount;
    elements.incorrectCount.textContent = incorrectAnswers;

    saveExamResult({
        date: new Date().toISOString(),
        correct: correctAnswersCount,
        incorrect: incorrectAnswers,
        total: totalQuestions,
        percentage,
        topic: activeConfiguration.topic,
        topicStats
    });

    clearExamSession();
    renderHistory();
    refreshProfileStats();
    refreshHome();
    showScreen("result");
}

async function copyQuestionCode() {
    const code = elements.questionCode.querySelector("code").textContent;
    if (!code.trim()) return;

    try {
        await navigator.clipboard.writeText(code);
        elements.copyCodeButton.textContent = "Código copiado";
    } catch {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
        elements.copyCodeButton.textContent = "Código copiado";
    }

    window.setTimeout(() => {
        elements.copyCodeButton.textContent = "Copiar código";
    }, 1500);
}

function normalizeText(value) {
    return String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function renderGlossary(searchValue = "") {
    const query = normalizeText(searchValue.trim());

    const results = GLOSSARY.filter((entry) => {
        const searchableText = normalizeText([
            entry.term,
            entry.category,
            entry.definition,
            ...entry.keywords
        ].join(" "));

        return searchableText.includes(query);
    });

    elements.glossaryResults.innerHTML = "";

    const count = document.createElement("p");
    count.className = "glossary-count";
    count.textContent = `${results.length} conceptos encontrados`;
    elements.glossaryResults.appendChild(count);

    if (results.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-state";
        message.textContent = "No se encontraron conceptos relacionados.";
        elements.glossaryResults.appendChild(message);
        return;
    }

    results.forEach((entry) => {
        const card = document.createElement("article");
        card.className = "glossary-card";

        const category = document.createElement("p");
        category.className = "glossary-card__category";
        category.textContent = entry.category;

        const title = document.createElement("h2");
        title.textContent = entry.term;

        const definition = document.createElement("p");
        definition.textContent = entry.definition;

        const keywords = document.createElement("p");
        keywords.className = "glossary-card__keywords";
        keywords.textContent = `Palabras clave: ${entry.keywords.join(", ")}`;

        card.append(category, title, definition, keywords);
        elements.glossaryResults.appendChild(card);
    });
}

function renderHistory() {
    const history = getExamHistory();
    elements.historyList.innerHTML = "";

    if (history.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-state";
        message.textContent = "Todavía no hay exámenes registrados.";
        elements.historyList.appendChild(message);
        return;
    }

    history.forEach((result) => {
        const entry = document.createElement("article");
        entry.className = "history-entry";

        const information = document.createElement("div");
        const score = document.createElement("p");
        const date = document.createElement("p");
        const topic = document.createElement("p");

        score.innerHTML =
            `<strong>${result.percentage}%</strong> — ${result.correct} de ${result.total} correctas`;
        date.className = "history-entry__date";
        date.textContent = new Intl.DateTimeFormat("es-MX", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(result.date));

        topic.className = "history-entry__date";
        topic.textContent =
            result.topic && result.topic !== "all"
                ? result.topic
                : "Todos los temas";

        information.append(score, topic, date);
        entry.appendChild(information);
        elements.historyList.appendChild(entry);
    });
}

function getChartColors() {
    const styles = getComputedStyle(document.documentElement);

    return {
        text: styles.getPropertyValue("--text").trim() || "#172033",
        muted: styles.getPropertyValue("--muted").trim() || "#617286",
        border: styles.getPropertyValue("--border").trim() || "#dce3ec",
        primary: styles.getPropertyValue("--primary").trim() || "#1f4f8f",
        correct: "#2f9c68",
        incorrect: "#c54c62",
        surface: styles.getPropertyValue("--surface-soft").trim() || "#f8fafc"
    };
}

function prepareCanvas(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const displayWidth = Math.max(canvas.clientWidth, 280);
    const displayHeight = Math.max(
        Number(canvas.getAttribute("height")) || 320,
        260
    );

    canvas.width = Math.round(displayWidth * ratio);
    canvas.height = Math.round(displayHeight * ratio);

    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    return {
        context,
        width: displayWidth,
        height: displayHeight
    };
}

function drawScoreChart(history) {
    const { context, width, height } = prepareCanvas(elements.scoreChart);
    const colors = getChartColors();

    context.clearRect(0, 0, width, height);
    context.font = "13px system-ui";
    context.fillStyle = colors.muted;

    const data = [...history].reverse().slice(-10);

    if (data.length === 0) {
        context.textAlign = "center";
        context.fillText("Completa un examen para visualizar tu evolución.", width / 2, height / 2);
        return;
    }

    const padding = { top: 24, right: 24, bottom: 42, left: 44 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    context.strokeStyle = colors.border;
    context.lineWidth = 1;

    for (let value = 0; value <= 100; value += 25) {
        const y = padding.top + chartHeight - (value / 100) * chartHeight;
        context.beginPath();
        context.moveTo(padding.left, y);
        context.lineTo(padding.left + chartWidth, y);
        context.stroke();

        context.fillStyle = colors.muted;
        context.textAlign = "right";
        context.fillText(`${value}%`, padding.left - 8, y + 4);
    }

    const step = data.length === 1 ? 0 : chartWidth / (data.length - 1);
    const points = data.map((result, index) => ({
        x: padding.left + (data.length === 1 ? chartWidth / 2 : index * step),
        y: padding.top + chartHeight - (result.percentage / 100) * chartHeight,
        percentage: result.percentage
    }));

    context.strokeStyle = colors.primary;
    context.lineWidth = 3;
    context.beginPath();

    points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
    });

    context.stroke();

    points.forEach((point, index) => {
        context.fillStyle = colors.primary;
        context.beginPath();
        context.arc(point.x, point.y, 5, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = colors.text;
        context.textAlign = "center";
        context.fillText(`${point.percentage}%`, point.x, point.y - 12);

        context.fillStyle = colors.muted;
        context.fillText(String(index + 1), point.x, height - 16);
    });
}

function drawAnswersChart(history) {
    const { context, width, height } = prepareCanvas(elements.answersChart);
    const colors = getChartColors();

    context.clearRect(0, 0, width, height);

    const correct = history.reduce((sum, item) => sum + Number(item.correct || 0), 0);
    const incorrect = history.reduce((sum, item) => sum + Number(item.incorrect || 0), 0);
    const total = correct + incorrect;

    context.font = "14px system-ui";

    if (total === 0) {
        context.fillStyle = colors.muted;
        context.textAlign = "center";
        context.fillText("Aún no hay respuestas registradas.", width / 2, height / 2);
        return;
    }

    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const radius = Math.min(width, height) * 0.28;
    const innerRadius = radius * 0.58;
    const correctAngle = (correct / total) * Math.PI * 2;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + correctAngle);
    context.closePath();
    context.fillStyle = colors.correct;
    context.fill();

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(
        centerX,
        centerY,
        radius,
        -Math.PI / 2 + correctAngle,
        Math.PI * 1.5
    );
    context.closePath();
    context.fillStyle = colors.incorrect;
    context.fill();

    context.beginPath();
    context.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    context.fillStyle = colors.surface;
    context.fill();

    context.fillStyle = colors.text;
    context.textAlign = "center";
    context.font = "700 24px system-ui";
    context.fillText(String(total), centerX, centerY + 6);
    context.font = "13px system-ui";
    context.fillStyle = colors.muted;
    context.fillText("respuestas", centerX, centerY + 26);

    context.font = "14px system-ui";
    context.textAlign = "left";

    const legendY = height - 24;
    context.fillStyle = colors.correct;
    context.fillRect(18, legendY - 12, 14, 14);
    context.fillStyle = colors.text;
    context.fillText(`Aciertos: ${correct}`, 40, legendY);

    context.fillStyle = colors.incorrect;
    context.fillRect(width / 2, legendY - 12, 14, 14);
    context.fillStyle = colors.text;
    context.fillText(`Errores: ${incorrect}`, width / 2 + 22, legendY);
}

function drawProfileCharts() {
    const history = getExamHistory();
    drawScoreChart(history);
    drawAnswersChart(history);
}

function refreshProfileStats() {
    const history = getExamHistory();

    const totalCorrect = history.reduce(
        (sum, result) => sum + Number(result.correct || 0),
        0
    );
    const totalIncorrect = history.reduce(
        (sum, result) => sum + Number(result.incorrect || 0),
        0
    );

    elements.profileAttempts.textContent = history.length;
    elements.profileCorrect.textContent = totalCorrect;
    elements.profileIncorrect.textContent = totalIncorrect;

    window.requestAnimationFrame(drawProfileCharts);
}

function refreshHome() {
    const profile = getProfile();
    const history = getExamHistory();
    const session = getExamSession();
    const welcomeText = profile ? `Bienvenido, ${profile.name}` : "Bienvenido";

    elements.headerWelcomeTitle.textContent = welcomeText;
    elements.profileButtonName.textContent = profile?.name || "Perfil";
    elements.examCount.textContent = history.length;
    elements.bestScore.textContent = history.length
        ? `${Math.max(...history.map((entry) => entry.percentage))}%`
        : "0%";
    elements.savedProgress.textContent = session ? "Sí" : "No";
    elements.resumePanel.classList.toggle("hidden", !session);
}

elements.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = elements.nameInput.value.trim();

    if (!name) return;

    saveProfile({ name });
    refreshHome();
    showScreen("home");
});

elements.brandLink.addEventListener("click", (event) => {
    event.preventDefault();
    routeTo("home");
});

elements.profileButton.addEventListener("click", () => routeTo("profile"));
elements.menuButton.addEventListener("click", openMenu);
elements.closeMenuButton.addEventListener("click", closeMenu);
elements.menuOverlay.addEventListener("click", closeMenu);
elements.themeButton.addEventListener("click", toggleTheme);
elements.headerExamButton.addEventListener("click", () => routeTo("configure"));
elements.headerGlossaryButton.addEventListener("click", () => routeTo("glossary"));

document.querySelectorAll("[data-desktop-route]").forEach((button) => {
    button.addEventListener("click", () => routeTo(button.dataset.desktopRoute));
});

document.querySelectorAll(".menu-link").forEach((button) => {
    button.addEventListener("click", () => routeTo(button.dataset.route));
});

document.querySelectorAll("[data-home-route]").forEach((button) => {
    button.addEventListener("click", () => routeTo(button.dataset.homeRoute));
});

document.querySelectorAll("[data-route-button]").forEach((button) => {
    button.addEventListener("click", () => routeTo(button.dataset.routeButton));
});

elements.configurationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(elements.configurationForm);
    const questionCount = Number(formData.get("question-count")) || 40;
    const topic = formData.get("topic") || "all";

    startExam(questionCount, topic);
});

elements.resumeButton.addEventListener("click", resumeExam);
elements.previousButton.addEventListener("click", goToPreviousQuestion);
elements.submitButton.addEventListener("click", submitAnswer);
elements.nextButton.addEventListener("click", goToNextQuestion);
elements.copyCodeButton.addEventListener("click", copyQuestionCode);
elements.restartButton.addEventListener("click", () => {
    startExam(activeConfiguration.questionCount, activeConfiguration.topic);
});
elements.homeButton.addEventListener("click", () => routeTo("home"));

elements.glossarySearch.addEventListener("input", (event) => {
    renderGlossary(event.target.value);
});

elements.clearHistoryButton.addEventListener("click", () => {
    clearExamHistory();
    renderHistory();
    refreshProfileStats();
    refreshHome();
});

window.addEventListener("resize", () => {
    if (!screens.profile.classList.contains("hidden")) {
        window.requestAnimationFrame(drawProfileCharts);
    }
});

populateTopics();
applyTheme(getTheme());
renderGlossary();
renderHistory();
refreshProfileStats();

if (getProfile()) {
    refreshHome();
    showScreen("home");
} else {
    showScreen("profile");
}
