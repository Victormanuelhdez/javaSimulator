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
    availableQuestions: document.getElementById("available-questions"),
    bestScore: document.getElementById("best-score"),
    examCount: document.getElementById("exam-count"),
    savedProgress: document.getElementById("saved-progress"),
    resumePanel: document.getElementById("resume-panel"),
    resumeButton: document.getElementById("resume-button"),
    questionTopic: document.getElementById("question-topic"),
    questionProgress: document.getElementById("question-progress"),
    examConfigurationSummary: document.getElementById("exam-configuration-summary"),
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
    resultConfigurationSummary: document.getElementById("result-configuration-summary"),
    correctCount: document.getElementById("correct-count"),
    partialCount: document.getElementById("partial-count"),
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
let activeConfiguration = {
    questionCount: 40,
    topic: "all",
    javaVersion: 11,
    difficulty: "BALANCED"
};

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

function getCompatibleQuestions(javaVersion, topic) {
    return QUESTION_BANK.filter((question) => {
        const matchesVersion = Array.isArray(question.javaVersions)
            ? question.javaVersions.includes(javaVersion)
            : Number(question.minimumJavaVersion || 8) <= javaVersion;
        const matchesTopic = topic === "all" || question.topic === topic;
        return matchesVersion && matchesTopic;
    });
}

function buildDistributedExam(source, questionCount, distribution) {
    const groups = {
        EASY: shuffle(source.filter((q) => q.difficultyLevel === "EASY")),
        MEDIUM: shuffle(source.filter((q) => q.difficultyLevel === "MEDIUM")),
        HARD: shuffle(source.filter((q) => q.difficultyLevel === "HARD"))
    };
    const targets = {
        EASY: Math.floor(questionCount * distribution.EASY),
        MEDIUM: Math.floor(questionCount * distribution.MEDIUM),
        HARD: Math.floor(questionCount * distribution.HARD)
    };
    let assigned = targets.EASY + targets.MEDIUM + targets.HARD;
    const remainderOrder = ["MEDIUM", "EASY", "HARD"];
    let index = 0;
    while (assigned < questionCount) {
        targets[remainderOrder[index % remainderOrder.length]] += 1;
        assigned += 1;
        index += 1;
    }
    const selected = [];
    const selectedIds = new Set();
    Object.entries(targets).forEach(([difficulty, amount]) => {
        groups[difficulty].slice(0, amount).forEach((question) => {
            selected.push(question);
            selectedIds.add(question.id);
        });
    });
    if (selected.length < questionCount) {
        const remaining = shuffle(source.filter((question) => !selectedIds.has(question.id)));
        selected.push(...remaining.slice(0, questionCount - selected.length));
    }
    return shuffle(selected);
}

function getDifficultyLabel(difficulty) {
    return { EASY: "Fácil", MEDIUM: "Media", HARD: "Difícil", BALANCED: "Equilibrada", JUNIOR: "Java Junior", RANDOM: "Aleatoria" }[difficulty] || difficulty;
}

function getTopicLabel(topic) {
    return topic === "all" ? "Todos los temas" : topic;
}

function getConfigurationSummary(configuration) {
    return `Java ${configuration.javaVersion} · ${getDifficultyLabel(configuration.difficulty)} · ${configuration.questionCount} preguntas · ${getTopicLabel(configuration.topic)}`;
}

function getConfigurationSource(javaVersion, topic, difficulty) {
    const compatibleQuestions = getCompatibleQuestions(javaVersion, topic);
    return ["EASY", "MEDIUM", "HARD"].includes(difficulty)
        ? compatibleQuestions.filter((question) => question.difficultyLevel === difficulty)
        : compatibleQuestions;
}

function updateAvailableQuestions() {
    const formData = new FormData(elements.configurationForm);
    const javaVersion = Number(formData.get("java-version")) || 11;
    const topic = formData.get("topic") || "all";
    const difficulty = formData.get("difficulty") || "BALANCED";
    const questionCount = Number(formData.get("question-count")) || 10;
    const available = getConfigurationSource(javaVersion, topic, difficulty).length;
    elements.availableQuestions.textContent = `${available} preguntas disponibles con esta configuración.`;
    elements.availableQuestions.classList.toggle("availability-message--warning", available < questionCount);
}

function startExam(questionCount = 40, topic = "all", javaVersion = 11, difficulty = "BALANCED") {
    const source = getConfigurationSource(javaVersion, topic, difficulty);
    if (source.length === 0) {
        window.alert("No hay preguntas disponibles con la versión, dificultad y tema seleccionados.");
        return;
    }
    if (source.length < questionCount) {
        window.alert(`Solo hay ${source.length} preguntas disponibles con esta configuración. Selecciona una cantidad menor o amplía los filtros.`);
        return;
    }
    if (difficulty === "BALANCED") {
        examQuestions = buildDistributedExam(source, questionCount, { EASY: 0.3, MEDIUM: 0.4, HARD: 0.3 });
    } else if (difficulty === "JUNIOR") {
        examQuestions = buildDistributedExam(source, questionCount, { EASY: 0.5, MEDIUM: 0.4, HARD: 0.1 });
    } else {
        examQuestions = shuffle(source).slice(0, questionCount);
    }
    currentQuestionIndex = 0;
    answersByQuestion = {};
    activeConfiguration = { questionCount, topic, javaVersion, difficulty };
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
    activeConfiguration = {
        questionCount: examQuestions.length,
        topic: "all",
        javaVersion: 11,
        difficulty: "BALANCED",
        ...(session.configuration || {})
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

function joinCodeBlocks(firstBlock, secondBlock) {
    return [firstBlock, secondBlock]
        .map((block) => String(block || "").trim())
        .filter(Boolean)
        .join("\n\n");
}

function splitQuestionContent(question) {
    const explicitCode = String(question.code || "").trim();
    let prompt = String(question.question || "").trim();

    const fenced = prompt.match(/```(?:java)?\s*\n?([\s\S]*?)```/i);
    if (fenced) {
        return {
            prompt: stripInlineMarkdown(prompt.replace(fenced[0], "").trim()),
            code: joinCodeBlocks(fenced[1], explicitCode)
        };
    }

    const backticked = prompt.match(/`([^`]*[;{}][^`]*)`/s);
    if (backticked) {
        return {
            prompt: stripInlineMarkdown(prompt.replace(backticked[0], "").trim()),
            code: joinCodeBlocks(backticked[1], explicitCode)
        };
    }

    const inlineCodeAfterPrompt = prompt.match(
        /^([\s\S]*?[?:])\s+((?:(?:public|protected|private|static|final|abstract|class|interface|enum|record|void|var|boolean|byte|short|int|long|float|double|char|String)\b|(?:[A-Z][\w.$]*(?:<[^>]+>)?(?:\[\])?\s+\w+\s*=))[\s\S]*)$/
    );

    if (
        inlineCodeAfterPrompt &&
        /[;{}]/.test(inlineCodeAfterPrompt[2])
    ) {
        return {
            prompt: stripInlineMarkdown(inlineCodeAfterPrompt[1]),
            code: joinCodeBlocks(inlineCodeAfterPrompt[2], explicitCode)
        };
    }

    if (explicitCode) {
        return {
            prompt: stripInlineMarkdown(prompt),
            code: explicitCode
        };
    }

    const lines = prompt.split(/\r?\n/);
    const codeStart = lines.findIndex((line, index) => {
        if (index === 0) return false;
        return /^\s*(?:package|import|public|protected|private|abstract|final|static|class|interface|enum|record|@\w+|var|boolean|byte|short|int|long|float|double|char|String|Object|List|Set|Map|Stream|LocalDate|LocalTime|LocalDateTime|ZonedDateTime|Instant|Duration|Period|Path|Files\.|System\.)\b/.test(line);
    });

    if (codeStart > 0) {
        const possibleCode = lines.slice(codeStart).join("\n").trim();
        if (/[;{}]/.test(possibleCode)) {
            return {
                prompt: stripInlineMarkdown(lines.slice(0, codeStart).join("\n").trim()),
                code: possibleCode
            };
        }
    }

    return {
        prompt: stripInlineMarkdown(prompt),
        code: ""
    };
}

function renderQuestion() {
    const question = examQuestions[currentQuestionIndex];
    const savedAnswer = answersByQuestion[question.id];

    elements.questionTopic.textContent = question.topic;
    elements.questionProgress.textContent =
        `Pregunta ${currentQuestionIndex + 1} de ${examQuestions.length}`;
    elements.examConfigurationSummary.textContent = getConfigurationSummary(activeConfiguration);
    elements.progressBar.style.width =
        `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%`;
    elements.questionDifficulty.textContent = question.difficulty;
    elements.questionType.textContent =
        question.type === "multiple" ? "Respuesta múltiple" : "Respuesta única";
    const content = splitQuestionContent(question);
    const codeElement = elements.questionCode.querySelector("code");

    elements.questionText.textContent = content.prompt;
    elements.questionText
        .closest(".question-prompt-card")
        ?.classList.toggle("question-prompt-card--long", content.prompt.length > 160);

    if (content.code) {
        elements.questionCodeCard.classList.remove("hidden");
        codeElement.textContent = content.code;
        elements.copyCodeButton.textContent = "Copiar código";
        elements.questionCodeCard.querySelector(".code-card__scroll").scrollLeft = 0;
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

function evaluateAnswer(selectedAnswers, correctAnswers) {
    const selected = new Set(selectedAnswers);
    const correct = new Set(correctAnswers);
    const hasIncorrectSelection = [...selected].some((answer) => !correct.has(answer));
    const selectedCorrectCount = [...selected].filter((answer) => correct.has(answer)).length;

    if (hasIncorrectSelection || selectedCorrectCount === 0) {
        return { status: "incorrect", score: 0, selectedCorrectCount, totalCorrectAnswers: correct.size };
    }

    if (selectedCorrectCount === correct.size) {
        return { status: "correct", score: 1, selectedCorrectCount, totalCorrectAnswers: correct.size };
    }

    return {
        status: "partial",
        score: selectedCorrectCount / correct.size,
        selectedCorrectCount,
        totalCorrectAnswers: correct.size
    };
}

function submitAnswer() {
    const question = examQuestions[currentQuestionIndex];
    const selectedAnswers = getSelectedAnswers();

    if (selectedAnswers.length === 0) {
        window.alert("Selecciona al menos una opción antes de enviar tu respuesta.");
        return;
    }

    const correctAnswers = [...question.correctAnswers].sort((a, b) => a - b);
    const evaluation = evaluateAnswer(selectedAnswers, correctAnswers);

    answersByQuestion[question.id] = {
        selectedAnswers,
        submitted: true,
        correct: evaluation.status === "correct",
        partial: evaluation.status === "partial",
        status: evaluation.status,
        score: evaluation.score,
        selectedCorrectCount: evaluation.selectedCorrectCount,
        totalCorrectAnswers: evaluation.totalCorrectAnswers
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

    const answerStatus = savedAnswer.status || (savedAnswer.correct ? "correct" : "incorrect");
    const feedbackClass = {
        correct: "feedback--correct",
        partial: "feedback--partial",
        incorrect: "feedback--incorrect"
    }[answerStatus];

    elements.feedback.className = `feedback ${feedbackClass}`;
    elements.feedbackIcon.innerHTML = answerStatus === "incorrect" ? icons.cross : icons.check;

    if (answerStatus === "correct") {
        elements.feedbackTitle.textContent = "Respuesta correcta";
        elements.feedbackAnswer.textContent = "";
    } else if (answerStatus === "partial") {
        const selectedCorrectCount = Number(savedAnswer.selectedCorrectCount) ||
            savedAnswer.selectedAnswers.filter((answer) => correctAnswers.includes(answer)).length;
        const partialScore = Number(savedAnswer.score) || selectedCorrectCount / correctAnswers.length;

        elements.feedbackTitle.textContent = "Respuesta parcialmente correcta";
        elements.feedbackAnswer.textContent =
            `Seleccionaste ${selectedCorrectCount} de ${correctAnswers.length} respuestas correctas. ` +
            `Puntaje: ${formatScore(partialScore)} de 1. Respuesta completa: ${answerText}`;
    } else {
        elements.feedbackTitle.textContent = "Respuesta incorrecta";
        elements.feedbackAnswer.textContent = `Respuesta correcta: ${answerText}`;
    }

    elements.feedbackExplanation.textContent = stripInlineMarkdown(question.explanation);

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

function formatScore(value) {
    const rounded = Math.round((Number(value) + Number.EPSILON) * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
}

function finishExam() {
    const totalQuestions = examQuestions.length;
    const answers = examQuestions.map((question) => {
        const savedAnswer = answersByQuestion[question.id] || {};
        const status = savedAnswer.status || (savedAnswer.correct ? "correct" : "incorrect");
        const score = Number.isFinite(Number(savedAnswer.score))
            ? Number(savedAnswer.score)
            : savedAnswer.correct ? 1 : 0;
        return { question, status, score };
    });

    const correctAnswersCount = answers.filter((answer) => answer.status === "correct").length;
    const partialAnswersCount = answers.filter((answer) => answer.status === "partial").length;
    const incorrectAnswersCount = answers.filter((answer) => answer.status === "incorrect").length;
    const earnedPoints = answers.reduce((sum, answer) => sum + answer.score, 0);
    const percentage = Math.round((earnedPoints / totalQuestions) * 100);
    const topicStats = {};

    answers.forEach(({ question, status, score }) => {
        if (!topicStats[question.topic]) {
            topicStats[question.topic] = { correct: 0, partial: 0, incorrect: 0, points: 0 };
        }
        topicStats[question.topic][status] += 1;
        topicStats[question.topic].points += score;
    });

    elements.scorePercentage.textContent = `${percentage}%`;
    elements.resultConfigurationSummary.textContent = getConfigurationSummary(activeConfiguration);
    elements.scoreSummary.textContent = `Obtuviste ${formatScore(earnedPoints)} de ${totalQuestions} puntos.`;
    elements.correctCount.textContent = correctAnswersCount;
    elements.partialCount.textContent = partialAnswersCount;
    elements.incorrectCount.textContent = incorrectAnswersCount;

    saveExamResult({
        date: new Date().toISOString(),
        correct: correctAnswersCount,
        partial: partialAnswersCount,
        incorrect: incorrectAnswersCount,
        earnedPoints,
        total: totalQuestions,
        percentage,
        topic: activeConfiguration.topic,
        javaVersion: activeConfiguration.javaVersion,
        difficulty: activeConfiguration.difficulty,
        topicStats
    });

    clearExamSession();
    renderHistory();
    refreshProfileStats();
    refreshHome();
    showScreen("result");
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

        const earnedPoints = Number.isFinite(Number(result.earnedPoints))
            ? Number(result.earnedPoints)
            : Number(result.correct || 0);
        const partialAnswers = Number(result.partial || 0);

        score.innerHTML =
            `<strong>${result.percentage}%</strong> — ${formatScore(earnedPoints)} de ${result.total} puntos` +
            (partialAnswers > 0
                ? ` · ${partialAnswers} ${partialAnswers === 1 ? "parcial" : "parciales"}`
                : "");
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

    const correct = history.reduce((sum, item) => {
        const earnedPoints = Number.isFinite(Number(item.earnedPoints))
            ? Number(item.earnedPoints)
            : Number(item.correct || 0);
        return sum + earnedPoints;
    }, 0);
    const total = history.reduce((sum, item) => {
        const fallbackTotal = Number(item.correct || 0) + Number(item.incorrect || 0);
        return sum + Number(item.total || fallbackTotal);
    }, 0);
    const incorrect = Math.max(0, total - correct);

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
    context.fillText(formatScore(total), centerX, centerY + 6);
    context.font = "13px system-ui";
    context.fillStyle = colors.muted;
    context.fillText("puntos posibles", centerX, centerY + 26);

    context.font = "14px system-ui";
    context.textAlign = "left";

    const legendY = height - 24;
    context.fillStyle = colors.correct;
    context.fillRect(18, legendY - 12, 14, 14);
    context.fillStyle = colors.text;
    context.fillText(`Puntos: ${formatScore(correct)}`, 40, legendY);

    context.fillStyle = colors.incorrect;
    context.fillRect(width / 2, legendY - 12, 14, 14);
    context.fillStyle = colors.text;
    context.fillText(`No obtenidos: ${formatScore(incorrect)}`, width / 2 + 22, legendY);
}

function drawProfileCharts() {
    const history = getExamHistory();
    drawScoreChart(history);
    drawAnswersChart(history);
}

function refreshProfileStats() {
    const history = getExamHistory();
    const totalEarnedPoints = history.reduce((sum, result) => {
        const earnedPoints = Number.isFinite(Number(result.earnedPoints))
            ? Number(result.earnedPoints)
            : Number(result.correct || 0);
        return sum + earnedPoints;
    }, 0);
    const totalPossiblePoints = history.reduce((sum, result) => {
        const fallbackTotal = Number(result.correct || 0) + Number(result.incorrect || 0);
        return sum + Number(result.total || fallbackTotal);
    }, 0);
    const totalMissedPoints = Math.max(0, totalPossiblePoints - totalEarnedPoints);

    elements.profileAttempts.textContent = history.length;
    elements.profileCorrect.textContent = formatScore(totalEarnedPoints);
    elements.profileIncorrect.textContent = formatScore(totalMissedPoints);
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

async function copyQuestionCode() {
    const code = elements.questionCode.querySelector("code").textContent;
    if (!code.trim()) return;

    try {
        await navigator.clipboard.writeText(code);
        elements.copyCodeButton.textContent = "Código copiado";
    } catch {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        elements.copyCodeButton.textContent = "Código copiado";
    }

    window.setTimeout(() => {
        elements.copyCodeButton.textContent = "Copiar código";
    }, 1500);
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
elements.copyCodeButton.addEventListener("click", copyQuestionCode);
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

elements.configurationForm.addEventListener("change", updateAvailableQuestions);

elements.configurationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(elements.configurationForm);
    const questionCount = Number(formData.get("question-count")) || 40;
    const topic = formData.get("topic") || "all";
    const javaVersion = Number(formData.get("java-version")) || 11;
    const difficulty = formData.get("difficulty") || "BALANCED";

    startExam(questionCount, topic, javaVersion, difficulty);
});

elements.resumeButton.addEventListener("click", resumeExam);
elements.previousButton.addEventListener("click", goToPreviousQuestion);
elements.submitButton.addEventListener("click", submitAnswer);
elements.nextButton.addEventListener("click", goToNextQuestion);
elements.restartButton.addEventListener("click", () => {
    startExam(
        activeConfiguration.questionCount,
        activeConfiguration.topic,
        activeConfiguration.javaVersion,
        activeConfiguration.difficulty
    );
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
updateAvailableQuestions();
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
