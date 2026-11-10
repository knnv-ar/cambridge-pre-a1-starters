// ============================================================================
// CAMBRIDGE ENGLISH: PRE A1 STARTERS — LÓGICA PRINCIPAL DE LA APLICACIÓN
// Simulador Interactivo 3.º Grado — Sábado 14 de noviembre de 2026
// 100% Estático · Sin dependencias externas · Compatible Offline & GitHub Pages
// ============================================================================

(function () {
  "use strict";

  const DATA = window.STARTERS_DATA;
  const STORAGE_KEY = "cambridge_starters_2026_state_v1";

  // --------------------------------------------------------------------------
  // 1. ESTADO GLOBAL DE LA APLICACIÓN
  // --------------------------------------------------------------------------
  function createEmptyVolumeState() {
    return {
      listening: {
        p1Lines: {},       // { [nameId]: targetId }
        p2Answers: {},     // { 1: "", 2: "", 3: "", 4: "", 5: "" }
        p3Answers: {},     // { 1: "A"|"B"|"C", ... }
        p4Colors: {},      // { [zoneId]: colorId }
        p4Strokes: [],     // [{ colorId, fillHex, points: [{x, y}] }]
        showSolutionP1: false,
        showSolutionP4: false
      },
      rw: {
        p1Answers: {},     // { 1: "tick"|"cross", ... }
        p2Answers: {},     // { 1: "yes"|"no", ... }
        p3Answers: {},     // { 1: "duck", ... }
        p4Answers: {},     // { 1: "spiders", ... }
        p5Answers: {}      // { 1: "spiders", ... }
      },
      speaking: {
        placedCards: {},   // { [cardId]: { x: pctX, y: pctY } }
        checkedSteps: {},  // { [stepId]: true }
        shieldsAwarded: 5,
        examinerOpen: true
      },
      checkedAnswers: {
        listening: false,
        rw: false,
        speaking: false
      }
    };
  }

  function isModuleUnlocked(volKey, mod) {
    if (mod === "home" || mod === "listening") return true;
    const chk = state.volumes[volKey]?.checkedAnswers || {};
    if (mod === "rw") return Boolean(chk.listening);
    if (mod === "speaking") return Boolean(chk.listening && chk.rw);
    if (mod === "results") return Boolean(chk.listening && chk.rw && chk.speaking);
    return false;
  }

  const state = {
    studentName: "",             // Nombre de la niña o niño en la sesión actual (se pregunta en cada carga)
    currentVol: "vol1",          // "vol1" | "vol2"
    currentMod: "home",          // "home" | "listening" | "rw" | "speaking" | "results"
    currentPart: {
      listening: "part1",        // "part1".."part4"
      rw: "part1"                // "part1".."part5"
    },
    activeTool: "pencil",        // "pencil" | "eraser" | "red" | "blue" | ...
    ziplocCollapsed: false,
    tapescriptOpen: false,
    playbackRate: 1.0,
    activeClozeBlank: 1,         // Casillero activo (1..5) en R&W Part 4
    activeSpeakingCard: null,    // Tarjeta seleccionada en bandeja de Speaking para colocar con clic
    dictationTarget: null,       // Nombre actual en el minijuego de dictado
    timer: {
      secondsLeft: 20 * 60,
      running: false,
      intervalId: null
    },
    volumes: {
      vol1: createEmptyVolumeState(),
      vol2: createEmptyVolumeState()
    }
  };

  function getStudentName() {
    return (state.studentName || "").trim() || DATA.student.defaultName || "Alumno/a";
  }

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function personalizeText(str) {
    return String(str || "").replace(/\{studentName\}/g, escapeHTML(getStudentName()));
  }

  function updateStudentNameUI() {
    const safeName = getStudentName();
    const headerNameEl = document.getElementById("header-student-name");
    if (headerNameEl) {
      headerNameEl.textContent = safeName;
    }
    const ziplocTitleEl = document.getElementById("ziploc-title-text");
    if (ziplocTitleEl) {
      ziplocTitleEl.textContent = `🧰 ZIPLOC DE ${safeName.toUpperCase()}`;
    }
    document.title = `Cambridge Pre A1 Starters — Práctica de ${safeName} (2026)`;
  }

  // Cargar progreso guardado en localStorage
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.currentVol && DATA.volumes[saved.currentVol]) {
        state.currentVol = saved.currentVol;
      }
      if (saved.volumes) {
        ["vol1", "vol2"].forEach((vKey) => {
          if (saved.volumes[vKey]) {
            const def = createEmptyVolumeState();
            state.volumes[vKey] = {
              listening: Object.assign(def.listening, saved.volumes[vKey].listening || {}),
              rw: Object.assign(def.rw, saved.volumes[vKey].rw || {}),
              speaking: Object.assign(def.speaking, saved.volumes[vKey].speaking || {}),
              checkedAnswers: Object.assign(def.checkedAnswers, saved.volumes[vKey].checkedAnswers || {})
            };
          }
        });
      }
    } catch (err) {
      console.warn("No se pudo recuperar el estado previo de localStorage:", err);
    }
  }

  function saveState() {
    try {
      const payload = {
        currentVol: state.currentVol,
        volumes: state.volumes
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("No se pudo guardar en localStorage:", err);
    }
    updateTopBadges();
  }

  function getVolData() {
    return DATA.volumes[state.currentVol];
  }

  function getVolState() {
    return state.volumes[state.currentVol];
  }

  // --------------------------------------------------------------------------
  // 2. UTILIDADES DE CORRECCIÓN Y SISTEMA DE ESCUDOS CAMBRIDGE
  // --------------------------------------------------------------------------
  function normalizeText(str) {
    return String(str || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[.,!?;:'"’]/g, "");
  }

  function isAnswerAccepted(userRaw, acceptedList) {
    const clean = normalizeText(userRaw);
    if (!clean) return false;
    for (const acc of acceptedList) {
      const normAcc = normalizeText(acc);
      if (clean === normAcc) return true;
      // Equivalencia número <-> palabra (ej. "15" == "fifteen", "2" == "two")
      if (DATA.numberWords[normAcc] && DATA.numberWords[normAcc].includes(clean)) {
        return true;
      }
      for (const numKey of Object.keys(DATA.numberWords)) {
        const variants = DATA.numberWords[numKey];
        if (variants.includes(normAcc) && variants.includes(clean)) {
          return true;
        }
      }
    }
    return false;
  }

  // Evalúa Listening completo (20 preguntas) de un volumen
  function evaluateListening(volKey) {
    const vData = DATA.volumes[volKey].listening;
    const vState = state.volumes[volKey].listening;
    const details = {
      part1: [],
      part2: [],
      part3: [],
      part4: []
    };
    let score = 0;
    let answeredCount = 0;

    // Part 1: 5 líneas
    answeredCount += Object.keys(vState.p1Lines || {}).length;
    vData.part1.markingKey.forEach((item) => {
      const userTarget = vState.p1Lines[item.nameId] || null;
      const isCorrect = userTarget === item.targetId;
      if (isCorrect) score++;
      const targetObj = vData.part1.targets.find((t) => t.id === userTarget);
      details.part1.push({
        q: item.q,
        prompt: `Línea para ${item.nameId}`,
        userAnswer: targetObj ? `${item.nameId} → ${targetObj.label}` : "Sin unir",
        correctAnswer: item.desc,
        isCorrect,
        hintEs: `En el audio conectan a ${item.desc}.`
      });
    });

    // Part 2: 5 nombres o números
    vData.part2.questions.forEach((qObj) => {
      const userVal = vState.p2Answers[qObj.q] || "";
      if (normalizeText(userVal)) answeredCount++;
      const isCorrect = isAnswerAccepted(userVal, qObj.accepted);
      if (isCorrect) score++;
      details.part2.push({
        q: qObj.q,
        prompt: qObj.prompt,
        userAnswer: userVal.trim() || "(en blanco)",
        correctAnswer: qObj.displayKey,
        isCorrect,
        hintEs: qObj.hintEs
      });
    });

    // Part 3: 5 multiple choice (A, B, C)
    vData.part3.questions.forEach((qObj) => {
      const userVal = vState.p3Answers[qObj.q] || "";
      if (userVal) answeredCount++;
      const isCorrect = userVal === qObj.answer;
      if (isCorrect) score++;
      details.part3.push({
        q: qObj.q,
        prompt: qObj.prompt,
        userAnswer: userVal ? `Opción ${userVal}` : "(sin marcar)",
        correctAnswer: `Opción ${qObj.answer}`,
        isCorrect,
        hintEs: qObj.hintEs
      });
    });

    // Part 4: 5 objetos coloreados
    const coloredZones = vState.p4Colors || {};
    answeredCount += Object.keys(coloredZones).length;
    vData.part4.zones
      .filter((z) => !z.isDistractor)
      .forEach((zone) => {
        const userColorId = coloredZones[zone.id] || null;
        const userTool = DATA.pencilCase.find((p) => p.id === userColorId);
        const expTool = DATA.pencilCase.find((p) => p.id === zone.expectedColor);
        const isCorrect = userColorId === zone.expectedColor;
        if (isCorrect) score++;
        details.part4.push({
          q: zone.q,
          prompt: `${zone.label} (${zone.esLabel})`,
          userAnswer: userTool ? `${userTool.label} (${userTool.es})` : "(sin colorear)",
          correctAnswer: expTool ? `${expTool.label} (${expTool.es})` : zone.expectedColor,
          isCorrect,
          hintEs: `El audio pide pintar "${zone.label}" de color ${expTool ? expTool.label : zone.expectedColor}.`
        });
      });

    return {
      score,
      total: 20,
      answeredCount: Math.min(20, answeredCount),
      shields: calculateShields(score, 20),
      details
    };
  }

  // Evalúa Reading & Writing completo (25 preguntas) de un volumen
  function evaluateRW(volKey) {
    const vData = DATA.volumes[volKey].readingWriting;
    const vState = state.volumes[volKey].rw;
    const details = {
      part1: [],
      part2: [],
      part3: [],
      part4: [],
      part5: []
    };
    let score = 0;
    let answeredCount = 0;

    // Part 1: Tick or Cross (5)
    vData.part1.questions.forEach((qObj) => {
      const userVal = vState.p1Answers[qObj.q] || "";
      if (userVal) answeredCount++;
      const isCorrect = userVal === qObj.answer;
      if (isCorrect) score++;
      details.part1.push({
        q: qObj.q,
        prompt: qObj.sentence,
        userAnswer: userVal === "tick" ? "✔ (Tick)" : userVal === "cross" ? "✘ (Cross)" : "(sin marcar)",
        correctAnswer: qObj.answer === "tick" ? "✔ (Tick)" : "✘ (Cross)",
        isCorrect,
        hintEs: qObj.hintEs
      });
    });

    // Part 2: Yes or No (5)
    vData.part2.questions.forEach((qObj) => {
      const userVal = vState.p2Answers[qObj.q] || "";
      if (normalizeText(userVal)) answeredCount++;
      const isCorrect = normalizeText(userVal) === qObj.answer;
      if (isCorrect) score++;
      details.part2.push({
        q: qObj.q,
        prompt: qObj.sentence,
        userAnswer: userVal.trim() || "(en blanco)",
        correctAnswer: qObj.answer,
        isCorrect,
        hintEs: qObj.hintEs
      });
    });

    // Part 3: Anagramas (5)
    vData.part3.questions.forEach((qObj) => {
      const userVal = vState.p3Answers[qObj.q] || "";
      if (normalizeText(userVal)) answeredCount++;
      const isCorrect = normalizeText(userVal) === normalizeText(qObj.answer);
      if (isCorrect) score++;
      details.part3.push({
        q: qObj.q,
        prompt: `Letras: ${qObj.scrambled.join(" - ").toUpperCase()}`,
        userAnswer: userVal.trim() || "(en blanco)",
        correctAnswer: qObj.answer,
        isCorrect,
        hintEs: qObj.hintEs
      });
    });

    // Part 4: Cloze ilustrado (5)
    const blanks = vData.part4.segments.filter((s) => s.type === "blank");
    blanks.forEach((bObj) => {
      const userVal = vState.p4Answers[bObj.q] || "";
      if (normalizeText(userVal)) answeredCount++;
      const isCorrect = normalizeText(userVal) === normalizeText(bObj.answer);
      if (isCorrect) score++;
      details.part4.push({
        q: bObj.q,
        prompt: `${vData.part4.passageTitle} — Espacio (${bObj.q})`,
        userAnswer: userVal.trim() || "(en blanco)",
        correctAnswer: bObj.answer,
        isCorrect,
        hintEs: bObj.hintEs
      });
    });

    // Part 5: Story 1-word answers (5)
    vData.part5.scenes.forEach((sc) => {
      sc.questions.forEach((qObj) => {
        const userVal = vState.p5Answers[qObj.q] || "";
        if (normalizeText(userVal)) answeredCount++;
        const isCorrect = isAnswerAccepted(userVal, qObj.accepted);
        if (isCorrect) score++;
        details.part5.push({
          q: qObj.q,
          prompt: `Cuadro ${sc.sceneNum}: ${qObj.prompt}`,
          userAnswer: userVal.trim() ? `${qObj.prefix ? qObj.prefix + " " : ""}${userVal.trim()}` : "(en blanco)",
          correctAnswer: `${qObj.prefix ? qObj.prefix + " " : ""}${qObj.displayKey}`,
          isCorrect,
          hintEs: qObj.hintEs
        });
      });
    });

    return {
      score,
      total: 25,
      answeredCount,
      shields: calculateShields(score, 25),
      details
    };
  }

  // Escala oficial orientativa de Cambridge (1 a 5 escudos, nunca 0)
  function calculateShields(score, total) {
    if (score <= 0) return 1;
    const ratio = score / total;
    if (ratio >= 0.85) return 5; // 17+/20 en Listening, 21+/25 en R&W
    if (ratio >= 0.70) return 4; // 14-16/20 en Listening, 18-20/25 en R&W
    if (ratio >= 0.50) return 3;
    if (ratio >= 0.25) return 2;
    return 1;
  }

  function renderShieldsRowHTML(earnedCount) {
    let html = '<div class="shields-row" aria-label="' + earnedCount + ' de 5 escudos">';
    for (let i = 1; i <= 5; i++) {
      const isEarned = i <= earnedCount;
      html += `
        <img src="documentation/cambridge-coat-arms.svg"
             alt="Escudo de Cambridge ${i}"
             class="cambridge-shield-svg ${isEarned ? "earned" : "unearned"}" />
      `;
    }
    html += "</div>";
    return html;
  }

  // --------------------------------------------------------------------------
  // 3. ESTUCHE ZIPLOC VIRTUAL (LÁPIZ NEGRO, GOMA Y 9 COLORES OFICIALES)
  // --------------------------------------------------------------------------
  function renderPencilSVG(tool) {
    if (tool.type === "eraser") {
      return `
        <svg class="pencil-svg" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="24" height="34" rx="5" fill="#f472b6" stroke="#1e293b" stroke-width="2"/>
          <rect x="6" y="24" width="24" height="18" rx="3" fill="#38bdf8" stroke="#1e293b" stroke-width="2"/>
          <line x1="11" y1="15" x2="25" y2="15" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    }
    const bodyColor = tool.hex;
    const tipColor = tool.type === "pencil" ? "#1e293b" : tool.hex;
    return `
      <svg class="pencil-svg" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="16,2 25,15 7,15" fill="#fde68a" stroke="#1e293b" stroke-width="1.8"/>
        <polygon points="16,2 20,8 12,8" fill="${tipColor}"/>
        <rect x="7" y="15" width="18" height="29" rx="2" fill="${bodyColor}" stroke="#1e293b" stroke-width="1.8"/>
        <line x1="12" y1="15" x2="12" y2="44" stroke="rgba(255,255,255,0.32)" stroke-width="2"/>
      </svg>
    `;
  }

  function renderZiplocToolbar() {
    const container = document.getElementById("ziploc-tools");
    const indicator = document.getElementById("active-tool-indicator");
    const bar = document.getElementById("ziploc-bar");
    const toggleBtn = document.getElementById("btn-toggle-ziploc");
    if (!container) return;

    bar.classList.toggle("collapsed", state.ziplocCollapsed);
    document.body.classList.toggle("ziploc-is-collapsed", state.ziplocCollapsed);
    if (toggleBtn) {
      toggleBtn.textContent = state.ziplocCollapsed ? "Útiles ▶" : "◀";
    }

    const currentToolObj = DATA.pencilCase.find((t) => t.id === state.activeTool) || DATA.pencilCase[0];
    if (indicator) {
      const swatch =
        currentToolObj.type === "color"
          ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${currentToolObj.hex};border:1px solid #000;vertical-align:middle;margin-right:4px;"></span>`
          : `${currentToolObj.icon || "✏️"} `;
      indicator.innerHTML = `${swatch}<strong>${currentToolObj.label.replace(" / VIOLET", "")}</strong>`;
    }

    container.innerHTML = DATA.pencilCase
      .map((tool) => {
        const isActive = tool.id === state.activeTool;
        return `
          <button type="button"
                  class="pencil-tool-btn ${isActive ? "active" : ""}"
                  data-tool-id="${tool.id}"
                  title="${tool.label} — ${tool.es}">
            ${renderPencilSVG(tool)}
            <div class="pencil-info">
              <span class="pencil-name">${tool.label.replace(" / VIOLET", "")}</span>
              <span class="pencil-es">${tool.es}</span>
            </div>
          </button>
        `;
      })
      .join("");

    container.querySelectorAll(".pencil-tool-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const toolId = btn.getAttribute("data-tool-id");
        setActiveTool(toolId);
      });
    });
  }

  function setActiveTool(toolId) {
    state.activeTool = toolId;
    renderZiplocToolbar();
    updateCanvasCursor();
  }

  function updateCanvasCursor() {
    const canvases = document.querySelectorAll(".interactive-canvas");
    canvases.forEach((cv) => {
      if (state.activeTool === "eraser") {
        cv.style.cursor = "cell";
      } else {
        cv.style.cursor = "crosshair";
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. CONTADOR DE TIEMPO POR PUNTO (20 MIN PUNTOS 1 Y 2, 7 MIN PUNTO 3) Y POPUPS
  // --------------------------------------------------------------------------
  const STAGE_TIMER_CONFIG = {
    listening: { minutes: 20, badge: "1. 🎧 Listening" },
    rw: { minutes: 20, badge: "2. ✏️ Reading & Writing" },
    speaking: { minutes: 7, badge: "3. 🗣️ Speaking" }
  };

  function getCurrentStageMinutes(mod) {
    return STAGE_TIMER_CONFIG[mod || state.currentMod]?.minutes || 20;
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function updateTimerUI() {
    const widget = document.getElementById("timer-widget");
    const display = document.getElementById("timer-display");
    const toggleBtn = document.getElementById("btn-timer-toggle");
    if (!widget || !display || !toggleBtn) return;

    widget.classList.remove("hidden");
    widget.classList.toggle("running", Boolean(state.timer.running));
    widget.classList.toggle(
      "warning",
      Boolean(state.timer.running && state.timer.secondsLeft > 0 && state.timer.secondsLeft <= 60)
    );
    display.textContent = formatTime(state.timer.secondsLeft);
    toggleBtn.textContent = state.timer.running ? "⏸️" : "▶️";
  }

  function stopTimer() {
    if (state.timer.intervalId) {
      clearInterval(state.timer.intervalId);
      state.timer.intervalId = null;
    }
    state.timer.running = false;
    updateTimerUI();
  }

  function prepareStageTimer(mod) {
    stopTimer();
    const mins = getCurrentStageMinutes(mod);
    state.timer.secondsLeft = mins * 60;
    updateTimerUI();
  }

  function startStageCountdown() {
    stopTimer();
    if (state.timer.secondsLeft <= 0) {
      state.timer.secondsLeft = getCurrentStageMinutes(state.currentMod) * 60;
    }
    state.timer.running = true;
    updateTimerUI();

    state.timer.intervalId = setInterval(() => {
      if (state.timer.secondsLeft > 0) {
        state.timer.secondsLeft--;
        updateTimerUI();
        if (state.timer.secondsLeft <= 0) {
          handleStageTimeExpired();
        }
      } else {
        handleStageTimeExpired();
      }
    }, 1000);
  }

  function handleStageTimeExpired() {
    stopTimer();
    const audioEl = document.getElementById("listening-audio");
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }
    openStageTimeUpModal();
  }

  function toggleTimer() {
    if (state.timer.running) {
      stopTimer();
    } else {
      startStageCountdown();
    }
  }

  function resetTimer() {
    prepareStageTimer(state.currentMod);
  }

  function closeStageModals() {
    document.getElementById("stage-start-modal")?.classList.add("hidden");
    document.getElementById("stage-timeup-modal")?.classList.add("hidden");
    document.body.classList.remove("stage-blur-active");
  }

  function openStageStartModal(mod) {
    const cfg = STAGE_TIMER_CONFIG[mod];
    if (!cfg) return;
    const modal = document.getElementById("stage-start-modal");
    const badgeEl = document.getElementById("stage-start-badge");
    const textEl = document.getElementById("stage-start-text");
    const startBtn = document.getElementById("btn-stage-start");
    if (!modal || !textEl) return;

    document.getElementById("stage-timeup-modal")?.classList.add("hidden");
    if (badgeEl) {
      badgeEl.textContent = `${cfg.badge} · ${getVolData().badge}`;
    }
    textEl.textContent = `Tenés ${cfg.minutes} minutos máximo para completar este punto.`;

    document.body.classList.add("stage-blur-active");
    modal.classList.remove("hidden");
    setTimeout(() => startBtn?.focus(), 50);
  }

  function openStageTimeUpModal() {
    const modal = document.getElementById("stage-timeup-modal");
    const nextBtn = document.getElementById("btn-stage-timeup-next");
    if (!modal) return;

    document.getElementById("stage-start-modal")?.classList.add("hidden");
    document.body.classList.add("stage-blur-active");
    modal.classList.remove("hidden");
    setTimeout(() => nextBtn?.focus(), 50);
  }

  function advanceToNextEvaluationPoint() {
    closeStageModals();
    if (state.currentMod === "listening") {
      getVolState().checkedAnswers.listening = true;
      saveState();
      navigateTo("rw", "part1", true);
    } else if (state.currentMod === "rw") {
      getVolState().checkedAnswers.rw = true;
      saveState();
      navigateTo("speaking", undefined, true);
    } else if (state.currentMod === "speaking") {
      getVolState().checkedAnswers.speaking = true;
      saveState();
      navigateTo("results");
    }
  }

  function updateTopBadges() {
    const lEval = evaluateListening(state.currentVol);
    const rwEval = evaluateRW(state.currentVol);
    const chk = getVolState().checkedAnswers || {};

    const badgeL = document.getElementById("badge-listening");
    const badgeRW = document.getElementById("badge-rw");
    const badgeSP = document.getElementById("badge-speaking");
    if (badgeL) badgeL.textContent = chk.listening ? `✓ ${lEval.answeredCount}/20` : `${lEval.answeredCount}/20`;
    if (badgeRW) badgeRW.textContent = chk.rw ? `✓ ${rwEval.answeredCount}/25` : `${rwEval.answeredCount}/25`;
    if (badgeSP) badgeSP.textContent = chk.speaking ? "✓ Listo" : "En familia";

    document.querySelectorAll(".vol-pill").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-vol") === state.currentVol);
    });

    const lockTooltips = {
      listening: "Etapa 1: Listening",
      rw: "Completá 1. Listening primero para desbloquear 2. Reading & Writing",
      speaking: "Completá 2. Reading & Writing primero para desbloquear 3. Speaking",
      results: "Completá 1. Listening, 2. Reading & Writing y 3. Speaking para desbloquear Resultados"
    };

    document.querySelectorAll(".mod-tab").forEach((btn) => {
      const mod = btn.getAttribute("data-mod");
      const unlocked = isModuleUnlocked(state.currentVol, mod);
      btn.classList.toggle("active", mod === state.currentMod);
      btn.classList.toggle("locked", !unlocked);
      btn.disabled = !unlocked;
      btn.title = unlocked ? `Ir a ${btn.textContent.trim()}` : lockTooltips[mod] || "";

      const lockIconEl = btn.querySelector(".mod-lock-icon");
      if (lockIconEl) {
        lockIconEl.textContent = unlocked ? "" : "🔒 ";
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. NAVEGACIÓN PRINCIPAL Y RENDERIZADO DE VISTAS
  // --------------------------------------------------------------------------
  function navigateTo(mod, partOptional, forceStagePopup) {
    if (!isModuleUnlocked(state.currentVol, mod)) {
      return;
    }
    const isEnteringStage =
      Boolean(STAGE_TIMER_CONFIG[mod]) && (state.currentMod !== mod || Boolean(forceStagePopup));

    state.currentMod = mod;
    if (partOptional && (mod === "listening" || mod === "rw")) {
      state.currentPart[mod] = partOptional;
    }

    if (!STAGE_TIMER_CONFIG[mod]) {
      stopTimer();
      closeStageModals();
    } else if (isEnteringStage) {
      prepareStageTimer(mod);
    }

    updateTopBadges();
    updateTimerUI();
    renderMain();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (isEnteringStage) {
      openStageStartModal(mod);
    }
  }

  function switchVolume(volKey) {
    if (!DATA.volumes[volKey]) return;
    state.currentVol = volKey;
    if (!isModuleUnlocked(volKey, state.currentMod)) {
      state.currentMod = "home";
    }
    saveState();
    if (STAGE_TIMER_CONFIG[state.currentMod]) {
      prepareStageTimer(state.currentMod);
      renderMain();
      openStageStartModal(state.currentMod);
    } else {
      stopTimer();
      closeStageModals();
      renderMain();
    }
  }

  function renderMain() {
    const main = document.getElementById("app-main");
    if (!main) return;

    if (state.currentMod === "home") {
      renderHomeView(main);
    } else if (state.currentMod === "listening") {
      renderListeningView(main);
    } else if (state.currentMod === "rw") {
      renderRWView(main);
    } else if (state.currentMod === "speaking") {
      renderSpeakingView(main);
    } else if (state.currentMod === "results") {
      renderResultsView(main);
    }
  }

  // --------------------------------------------------------------------------
  // 6. VISTA DE INICIO (HOME DASHBOARD PERSONALIZADO)
  // --------------------------------------------------------------------------
  function getDaysUntilExam() {
    const now = new Date();
    const exam = new Date(DATA.student.examDate);
    const diffMs = exam.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (days > 1) return { number: `${days} días`, label: "para el sábado 14 de noviembre" };
    if (days === 1) return { number: "¡Mañana!", label: "Sábado 14 de noviembre de 2026" };
    if (days === 0) return { number: "¡Es HOY!", label: `¡Muchos éxitos en tu examen, ${escapeHTML(getStudentName())}!` };
    return { number: "14 Nov 2026", label: "Cambridge Pre A1 Starters" };
  }

  function resetVolume(volKey) {
    const targetVol = volKey || state.currentVol;
    if (!DATA.volumes[targetVol]) return;
    state.volumes[targetVol] = createEmptyVolumeState();
    state.currentPart = {
      listening: "part1",
      rw: "part1"
    };
    state.activeClozeBlank = 1;
    state.activeSpeakingCard = null;
    saveState();
    navigateTo("home");
  }

  function renderHomeView(container) {
    const countdown = getDaysUntilExam();
    const vol1L = evaluateListening("vol1");
    const vol1RW = evaluateRW("vol1");
    const vol2L = evaluateListening("vol2");
    const vol2RW = evaluateRW("vol2");
    const studentNameHTML = escapeHTML(getStudentName());

    container.innerHTML = `
      <section class="hero-card">
        <div class="hero-content">
          <span class="hero-badge"><img src="documentation/cambridge-coat-arms.svg" alt="" class="inline-coat-arms-xs" /> CAMBRIDGE ENGLISH · PRE A1 STARTERS · 3.º GRADO</span>
          <h1 class="hero-title">¡Hola, ${studentNameHTML}! 🦁✨<br/>Tu simulador oficial para el sábado</h1>
          <p class="hero-subtitle">
            Acá tenés los <strong>2 cuadernillos oficiales completos de Cambridge</strong> (Volumen 1 y Volumen 2) tal como los vas a ver en papel este sábado, junto con tu <strong>estuche Ziploc virtual</strong> a la izquierda con el lápiz negro, la goma y los <strong>9 lápices de colores reglamentarios</strong>.
          </p>
          <div style="display:flex;flex-direction:column;align-items:flex-start;gap:0.75rem;margin-top:0.9rem;">
            <button type="button" class="btn-primary" id="hero-start-btn" style="background:#fde047;color:#1e293b;">
              🚀 Empezar 1. Listening (${DATA.volumes[state.currentVol].badge})
            </button>
            <button type="button" class="btn-secondary" id="hero-reset-vol-btn" style="background:rgba(239,68,68,0.22);color:#fee2e2;border-color:rgba(252,165,165,0.65);">
              🗑️ Reiniciar respuestas del ${DATA.volumes[state.currentVol].badge}
            </button>
            <button type="button" class="btn-secondary" id="hero-howto-btn" style="background:rgba(255,255,255,0.22);color:#fff;border-color:rgba(255,255,255,0.5);">
              📖 Cómo empezar (Guía para Familias + 20 Nombres)
            </button>
          </div>
        </div>
        <div class="countdown-box">
          <div class="countdown-days">${countdown.number}</div>
          <div class="countdown-label">${countdown.label}</div>
          <hr style="border:none;border-top:1px solid rgba(255,255,255,0.25);margin:0.65rem 0;" />
          <div style="font-size:0.8rem;opacity:0.95;">
            <img src="documentation/cambridge-coat-arms.svg" alt="Escudo de Cambridge" class="inline-coat-arms-sm" /> Máximo premio: <strong>15 Escudos</strong><br/>
            (5 Listening · 5 R&amp;W · 5 Speaking)
          </div>
        </div>
      </section>

      <div class="volumes-grid">
        ${renderVolumeDashboardCard("vol1", "📘 Volumen 1 (Sample Paper 1)", vol1L, vol1RW)}
        ${renderVolumeDashboardCard("vol2", "📙 Volumen 2 (Sample Paper 2)", vol2L, vol2RW)}
      </div>

      <section class="booklet-page" style="padding:1.4rem 1.75rem;">
        <h2 style="font-family:var(--font-heading);font-size:1.35rem;margin-bottom:0.75rem;color:var(--cambridge-purple-dark);">
          🎒 Checklist de la Ziploc real de ${studentNameHTML} para llevar el sábado al colegio
        </h2>
        <p style="font-size:0.95rem;color:#334155;margin-bottom:0.85rem;">
          Tocá cada útil en tu estuche lateral izquierdo para probarlo. Asegurate de tener estos mismos útiles reales listos en tu bolsa transparente:
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          ${DATA.pencilCase
            .map(
              (item) => `
              <span class="status-pill" style="background:#fff;border-color:#cbd5e1;">
                <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${item.hex};border:1px solid #334155;"></span>
                <strong>${item.label}</strong> <span style="color:#64748b;">(${item.es})</span>
              </span>
            `
            )
            .join("")}
        </div>
      </section>
    `;

    document.getElementById("hero-start-btn")?.addEventListener("click", () => {
      navigateTo("listening", "part1");
    });
    document.getElementById("hero-reset-vol-btn")?.addEventListener("click", () => {
      resetVolume(state.currentVol);
    });
    document.getElementById("hero-howto-btn")?.addEventListener("click", () => {
      openHowToModal();
    });

    container.querySelectorAll("[data-launch-vol]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        const v = btn.getAttribute("data-launch-vol");
        const m = btn.getAttribute("data-launch-mod");
        if (!isModuleUnlocked(v, m)) return;
        state.currentVol = v;
        saveState();
        navigateTo(m, "part1");
      });
    });
  }

  function renderVolumeDashboardCard(volKey, title, lEval, rwEval) {
    const isSelected = state.currentVol === volKey;
    const spState = state.volumes[volKey].speaking;
    const stepsDone = Object.values(spState.checkedSteps || {}).filter(Boolean).length;
    const rwUnlocked = isModuleUnlocked(volKey, "rw");
    const spUnlocked = isModuleUnlocked(volKey, "speaking");
    const resUnlocked = isModuleUnlocked(volKey, "results");

    return `
      <article class="volume-card ${isSelected ? "selected" : ""}">
        <div class="volume-card-header">
          <h2 class="volume-card-title">${title}</h2>
          <span class="status-pill ${isSelected ? "connected" : ""}">
            ${isSelected ? "Activo ahora" : "Disponible"}
          </span>
        </div>
        <div class="module-launch-list">
          <button type="button" class="module-launch-btn" data-launch-vol="${volKey}" data-launch-mod="listening">
            <div class="module-launch-info">
              <strong>1. 🎧 Listening (20 min · 4 partes)</strong>
              <span>Unir con líneas, deletreo/números, A/B/C y colorear (${volKey === "vol1" ? "globos" : "ananás"})</span>
            </div>
            <span class="status-pill">${lEval.answeredCount}/20 resp.</span>
          </button>

          <button type="button"
                  class="module-launch-btn ${rwUnlocked ? "" : "locked"}"
                  data-launch-vol="${volKey}"
                  data-launch-mod="rw"
                  ${rwUnlocked ? "" : "disabled"}
                  title="${rwUnlocked ? "Ir a 2. Reading & Writing" : "Completá 1. Listening primero"}">
            <div class="module-launch-info">
              <strong>${rwUnlocked ? "" : "🔒 "}2. ✏️ Reading &amp; Writing (20 min · 5 partes)</strong>
              <span>${rwUnlocked ? "✔/✘, Yes/No, Anagramas, Texto con dibujos e Historieta" : "Se desbloquea al finalizar 1. Listening"}</span>
            </div>
            <span class="status-pill">${rwUnlocked ? `${rwEval.answeredCount}/25 resp.` : "Bloqueado"}</span>
          </button>

          <button type="button"
                  class="module-launch-btn ${spUnlocked ? "" : "locked"}"
                  data-launch-vol="${volKey}"
                  data-launch-mod="speaking"
                  ${spUnlocked ? "" : "disabled"}
                  title="${spUnlocked ? "Ir a 3. Speaking" : "Completá 2. Reading & Writing primero"}">
            <div class="module-launch-info">
              <strong>${spUnlocked ? "" : "🔒 "}3. 🗣️ Speaking en Familia (3–5 min · 4 partes)</strong>
              <span>${spUnlocked ? `Lámina "${volKey === "vol1" ? "Kitchen" : "At the Beach & Boat"}" + 8 tarjetas + Guion` : "Se desbloquea al finalizar 2. Reading & Writing"}</span>
            </div>
            <span class="status-pill">${spUnlocked ? `${stepsDone}/5 pasos` : "Bloqueado"}</span>
          </button>

          <button type="button"
                  class="module-launch-btn ${resUnlocked ? "" : "locked"}"
                  data-launch-vol="${volKey}"
                  data-launch-mod="results"
                  ${resUnlocked ? "" : "disabled"}
                  style="${resUnlocked ? "background:#fefce8;border-color:#fde047;" : ""}"
                  title="${resUnlocked ? "Ver Resultados y Escudos" : "Completá Listening, Reading & Writing y Speaking primero"}">
            <div class="module-launch-info">
              <strong>${resUnlocked ? "" : "🔒 "}🏆 Resultados y Escudos de Cambridge</strong>
              <span>${resUnlocked ? "Revisar respuestas con la Marking Key oficial" : "Se desbloquea al finalizar las 3 etapas"}</span>
            </div>
            <span class="status-pill" style="${resUnlocked ? "background:#fef08a;border-color:#eab308;" : ""}">${resUnlocked ? "Ver Resultados →" : "Bloqueado"}</span>
          </button>
        </div>
      </article>
    `;
  }

  // --------------------------------------------------------------------------
  // 7. MÓDULO LISTENING (PARTES 1 A 4 + AUDIO + TAPESCRIPT + CANVAS)
  // --------------------------------------------------------------------------
  function isListeningPartDone(volKey, partKey) {
    const lState = state.volumes[volKey].listening;
    if (partKey === "part1") return Object.keys(lState.p1Lines || {}).length >= 5;
    if (partKey === "part2") return [1, 2, 3, 4, 5].every((q) => normalizeText(lState.p2Answers[q]));
    if (partKey === "part3") return [1, 2, 3, 4, 5].every((q) => Boolean(lState.p3Answers[q]));
    if (partKey === "part4") return Object.keys(lState.p4Colors || {}).length >= 5;
    return false;
  }

  function renderListeningView(container) {
    const vData = getVolData().listening;
    const partKey = state.currentPart.listening || "part1";
    const partData = vData[partKey];

    const partsList = [
      { key: "part1", label: "Part 1 · Líneas" },
      { key: "part2", label: "Part 2 · Nombres y N.º" },
      { key: "part3", label: "Part 3 · Tilde (A/B/C)" },
      { key: "part4", label: "Part 4 · Colorear" }
    ];

    container.innerHTML = `
      <div class="parts-nav-bar">
        <div class="parts-tabs" role="tablist">
          ${partsList
            .map((p) => {
              const done = isListeningPartDone(state.currentVol, p.key);
              return `
                <button type="button"
                        class="part-tab ${partKey === p.key ? "active" : ""}"
                        data-part="${p.key}">
                  <span class="part-done-dot ${done ? "done" : ""}"></span>
                  ${p.label}
                </button>
              `;
            })
            .join("")}
        </div>
        <div style="display:flex;gap:0.5rem;align-items:center;">
          <button type="button" class="btn-secondary" id="btn-grade-listening">
            ✅ Finalizar 1. Listening y pasar a 2. Reading &amp; Writing →
          </button>
        </div>
      </div>

      <!-- Barra de Audio Oficial -->
      <div class="audio-bar">
        <div class="audio-bar-left">
          <span class="audio-label">🎧 Pista Oficial (${getVolData().badge} · ${partData.title}):</span>
          <audio id="listening-audio" class="audio-player-el" controls preload="metadata" src="${partData.audio}"></audio>
        </div>
        <div class="audio-controls-extra">
          <button type="button" class="btn-chip" id="btn-audio-back5" title="Retroceder 5 segundos">⏪ -5s</button>
          <button type="button" class="btn-chip" id="btn-audio-fwd5" title="Adelantar 5 segundos">⏩ +5s</button>
          <button type="button" class="btn-chip ${state.playbackRate === 0.9 ? "active" : ""}" id="btn-audio-speed" title="Alternar velocidad normal (1.0x) o levemente más pausada (0.9x)">
            🐢 ${state.playbackRate === 0.9 ? "Velocidad 0.9x" : "Velocidad 1.0x"}
          </button>
          <button type="button" class="btn-chip ${state.tapescriptOpen ? "active" : ""}" id="btn-toggle-tapescript">
            📜 ${state.tapescriptOpen ? "Ocultar Tapescript (Docente)" : "Ver Tapescript (Docente)"}
          </button>
        </div>
      </div>

      ${
        state.tapescriptOpen
          ? `
        <div class="tapescript-drawer">
          <h4>📜 Tapescript Oficial — ${getVolData().title} · Listening ${partData.title} (Guía para Adulto / Docente)</h4>
          <pre class="tapescript-pre">${partData.tapescript}</pre>
        </div>
      `
          : ""
      }

      <!-- Hoja del Cuadernillo -->
      <section class="booklet-page">
        <div class="booklet-strip">Pre A1 Starters · Listening · ${getVolData().badge}</div>
        <header class="booklet-header">
          <h1 class="booklet-part-title">${partData.title}</h1>
          <div class="booklet-part-subtitle">${partData.subtitle}</div>
          <p class="booklet-instruction">${partData.instruction}</p>
        </header>

        <div class="lichu-tip-banner">
          <span>💡</span>
          <span><strong>Tip para ${escapeHTML(getStudentName())}:</strong> ${partData.tipEs}</span>
        </div>

        <div id="listening-part-body"></div>

        <footer class="booklet-footer-nav">
          <div>
            ${
              partKey !== "part1"
                ? `<button type="button" class="btn-secondary" id="btn-prev-part">← Parte anterior</button>`
                : `<span></span>`
            }
          </div>
          <div style="display:flex;gap:0.65rem;">
            ${
              partKey !== "part4"
                ? `<button type="button" class="btn-primary" id="btn-next-part">Siguiente Parte →</button>`
                : `<button type="button" class="btn-primary" id="btn-finish-listening">✅ Finalizar 1. Listening y pasar a 2. Reading &amp; Writing →</button>`
            }
          </div>
        </footer>
      </section>
    `;

    // Eventos de pestañas y audio
    container.querySelectorAll(".part-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.currentPart.listening = btn.getAttribute("data-part");
        renderListeningView(container);
      });
    });

    const audioEl = document.getElementById("listening-audio");
    if (audioEl) {
      audioEl.playbackRate = state.playbackRate;
    }

    document.getElementById("btn-audio-back5")?.addEventListener("click", () => {
      if (audioEl) audioEl.currentTime = Math.max(0, audioEl.currentTime - 5);
    });
    document.getElementById("btn-audio-fwd5")?.addEventListener("click", () => {
      if (audioEl) audioEl.currentTime = Math.min(audioEl.duration || 9999, audioEl.currentTime + 5);
    });
    document.getElementById("btn-audio-speed")?.addEventListener("click", () => {
      state.playbackRate = state.playbackRate === 1.0 ? 0.9 : 1.0;
      if (audioEl) audioEl.playbackRate = state.playbackRate;
      renderListeningView(container);
    });
    document.getElementById("btn-toggle-tapescript")?.addEventListener("click", () => {
      state.tapescriptOpen = !state.tapescriptOpen;
      renderListeningView(container);
    });
    document.getElementById("btn-grade-listening")?.addEventListener("click", () => {
      getVolState().checkedAnswers.listening = true;
      saveState();
      navigateTo("rw", "part1");
    });

    const order = ["part1", "part2", "part3", "part4"];
    const idx = order.indexOf(partKey);
    document.getElementById("btn-prev-part")?.addEventListener("click", () => {
      if (idx > 0) navigateTo("listening", order[idx - 1]);
    });
    document.getElementById("btn-next-part")?.addEventListener("click", () => {
      if (idx < order.length - 1) navigateTo("listening", order[idx + 1]);
    });
    document.getElementById("btn-finish-listening")?.addEventListener("click", () => {
      getVolState().checkedAnswers.listening = true;
      saveState();
      navigateTo("rw", "part1");
    });

    // Renderizar cuerpo específico de la parte
    const bodyEl = document.getElementById("listening-part-body");
    if (partKey === "part1") {
      renderListeningPart1(bodyEl, partData);
    } else if (partKey === "part2") {
      renderListeningPart2(bodyEl, partData);
    } else if (partKey === "part3") {
      renderListeningPart3(bodyEl, partData);
    } else if (partKey === "part4") {
      renderListeningPart4(bodyEl, partData);
    }
  }

  // --- LISTENING PART 1: UNIR NOMBRES CON PERSONAS EN CANVAS ---
  function renderListeningPart1(bodyEl, partData) {
    const lState = getVolState().listening;

    bodyEl.innerHTML = `
      <div class="canvas-stage-wrapper">
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap;justify-content:center;">
          <button type="button" class="btn-chip ${lState.showSolutionP1 ? "active" : ""}" id="btn-toggle-sol-p1">
            👁️ ${lState.showSolutionP1 ? "Ocultar Solución Oficial" : "Mostrar Solución Oficial (Docente)"}
          </button>
          <button type="button" class="btn-chip" id="btn-clear-p1">
            🗑️ Borrar todas mis líneas
          </button>
        </div>

        <div class="canvas-container" id="p1-canvas-container">
          <img src="${partData.sceneImg}" alt="Listening Part 1 Scene" class="canvas-bg-img" id="p1-scene-img" />
          <canvas id="p1-canvas" class="interactive-canvas"></canvas>
        </div>

        <div id="p1-status-pills" class="canvas-status-list"></div>
      </div>
    `;

    const img = document.getElementById("p1-scene-img");
    const canvas = document.getElementById("p1-canvas");
    const pillsWrap = document.getElementById("p1-status-pills");

    let dragStartNode = null;   // { kind: 'name'|'target', item }
    let dragCurrPos = null;     // { x: pct, y: pct }
    let selectedNameNode = null; // Permite unir también con 2 clics (clic en nombre -> clic en persona)

    function updateStatusPills() {
      const lines = lState.p1Lines || {};
      const entries = Object.entries(lines);
      let html = `
        <span class="status-pill example">
          📌 Ejemplo: ${partData.example.description}
        </span>
      `;
      entries.forEach(([nameId, targetId]) => {
        const tObj = partData.targets.find((t) => t.id === targetId);
        html += `
          <span class="status-pill connected">
            ✏️ <strong>${nameId}</strong> → ${tObj ? tObj.label : targetId}
            <button type="button" class="status-pill-del" data-del-name="${nameId}" title="Borrar esta línea">✕</button>
          </span>
        `;
      });
      if (entries.length === 0) {
        html += `<span class="status-pill">Todavía no trazaste líneas (0/5). Arrastrá desde un nombre hasta una persona.</span>`;
      }
      pillsWrap.innerHTML = html;

      pillsWrap.querySelectorAll("[data-del-name]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nId = btn.getAttribute("data-del-name");
          delete lState.p1Lines[nId];
          saveState();
          drawCanvas();
          updateStatusPills();
        });
      });
    }

    function syncCanvasSize() {
      const rect = img.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawCanvas();
      }
    }

    function pctToPx(xPct, yPct) {
      return {
        x: (xPct / 100) * canvas.width,
        y: (yPct / 100) * canvas.height
      };
    }

    function eventToPct(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      };
    }

    function hitTestBox(pct, box) {
      const [x1, y1, x2, y2] = box;
      return pct.x >= x1 && pct.x <= x2 && pct.y >= y1 && pct.y <= y2;
    }

    function findNodeAt(pct) {
      for (const n of partData.names) {
        if (hitTestBox(pct, n.box)) return { kind: "name", item: n };
      }
      for (const t of partData.targets) {
        if (hitTestBox(pct, t.box)) return { kind: "target", item: t };
      }
      return null;
    }

    // Distancia de un punto (pct) a un segmento (pA -> pB) para borrar con la goma
    function distToSegment(p, v, w) {
      const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
      if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
      let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
      t = Math.max(0, Math.min(1, t));
      return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
    }

    function drawArrowLine(ctx, fromPct, toPct, color, width, dashed) {
      const p1 = pctToPx(fromPct.x, fromPct.y);
      const p2 = pctToPx(toPct.x, toPct.y);
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      if (dashed) ctx.setLineDash([7, 5]);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Puntos extremos
      ctx.fillStyle = color;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, width * 1.2, 0, Math.PI * 2);
      ctx.arc(p2.x, p2.y, width * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawCanvas() {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Resaltar suavemente zonas interactivas de nombres y personajes cuando se arrastra o selecciona
      if (dragStartNode || selectedNameNode) {
        ctx.save();
        partData.targets.forEach((t) => {
          if (t.isExample) return;
          const [x1, y1, x2, y2] = t.box;
          const tl = pctToPx(x1, y1);
          const br = pctToPx(x2, y2);
          ctx.strokeStyle = "rgba(17, 24, 39, 0.5)";
          ctx.fillStyle = "rgba(17, 24, 39, 0.06)";
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
          ctx.fillRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        });
        ctx.restore();
      }

      // Si hay un nombre seleccionado con clic, destacarlo
      if (selectedNameNode) {
        const [x1, y1, x2, y2] = selectedNameNode.box;
        const tl = pctToPx(x1, y1);
        const br = pctToPx(x2, y2);
        ctx.save();
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 3;
        ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        ctx.restore();
      }

      // 2. Línea de cada unión hecha por el alumno/a (en color negro grafito como el lápiz PENCIL)
      Object.entries(lState.p1Lines || {}).forEach(([nameId, targetId]) => {
        const nObj = partData.names.find((n) => n.id === nameId);
        const tObj = partData.targets.find((t) => t.id === targetId);
        if (nObj && tObj) {
          drawArrowLine(ctx, nObj, tObj, "#111827", 3.8, false);
        }
      });

      // 3. Si está activada la vista de solución oficial para el docente, dibujar en verde punteado
      if (lState.showSolutionP1) {
        partData.markingKey.forEach((mk) => {
          const nObj = partData.names.find((n) => n.id === mk.nameId);
          const tObj = partData.targets.find((t) => t.id === mk.targetId);
          if (nObj && tObj) {
            drawArrowLine(ctx, nObj, tObj, "#16a34a", 3.2, true);
          }
        });
      }

      // 4. Línea temporal durante el arrastre
      if (dragStartNode && dragCurrPos) {
        drawArrowLine(ctx, dragStartNode.item, dragCurrPos, "#0f172a", 3.2, true);
      }
    }

    function tryEraseAt(pct) {
      const lines = lState.p1Lines || {};
      for (const [nameId, targetId] of Object.entries(lines)) {
        const nObj = partData.names.find((n) => n.id === nameId);
        const tObj = partData.targets.find((t) => t.id === targetId);
        if (nObj && tObj) {
          const d = distToSegment(pct, nObj, tObj);
          if (d < 3.5) {
            delete lState.p1Lines[nameId];
            saveState();
            drawCanvas();
            updateStatusPills();
            return true;
          }
        }
      }
      return false;
    }

    function connectPair(nodeA, nodeB) {
      if (!nodeA || !nodeB || nodeA.kind === nodeB.kind) return false;
      const nameItem = nodeA.kind === "name" ? nodeA.item : nodeB.item;
      const targetItem = nodeA.kind === "target" ? nodeA.item : nodeB.item;
      if (nameItem.isExample) return false;

      lState.p1Lines[nameItem.id] = targetItem.id;
      saveState();
      drawCanvas();
      updateStatusPills();
      return true;
    }

    canvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const pct = eventToPct(e);

      if (state.activeTool === "eraser") {
        tryEraseAt(pct);
        return;
      }

      const hit = findNodeAt(pct);
      if (hit) {
        // Si ya había un nombre seleccionado con clic y ahora toca un personaje, conectar
        if (selectedNameNode && hit.kind === "target") {
          connectPair({ kind: "name", item: selectedNameNode }, hit);
          selectedNameNode = null;
          drawCanvas();
          return;
        }
        if (hit.kind === "name" && !hit.item.isExample) {
          selectedNameNode = hit.item;
        } else {
          selectedNameNode = null;
        }
        dragStartNode = hit;
        dragCurrPos = pct;
        canvas.setPointerCapture(e.pointerId);
        drawCanvas();
      } else {
        selectedNameNode = null;
        drawCanvas();
      }
    });

    canvas.addEventListener("pointermove", (e) => {
      const pct = eventToPct(e);
      if (state.activeTool === "eraser" && e.buttons === 1) {
        tryEraseAt(pct);
        return;
      }
      if (!dragStartNode) return;
      dragCurrPos = pct;
      drawCanvas();
    });

    canvas.addEventListener("pointerup", (e) => {
      if (!dragStartNode) return;
      const pct = eventToPct(e);
      const endHit = findNodeAt(pct);
      if (endHit && endHit.kind !== dragStartNode.kind) {
        connectPair(dragStartNode, endHit);
        selectedNameNode = null;
      }
      dragStartNode = null;
      dragCurrPos = null;
      drawCanvas();
    });

    if (img.complete) {
      syncCanvasSize();
    } else {
      img.addEventListener("load", syncCanvasSize);
    }
    window.addEventListener("resize", syncCanvasSize);
    updateStatusPills();
    updateCanvasCursor();

    document.getElementById("btn-toggle-sol-p1")?.addEventListener("click", () => {
      lState.showSolutionP1 = !lState.showSolutionP1;
      renderListeningPart1(bodyEl, partData);
    });
    document.getElementById("btn-clear-p1")?.addEventListener("click", () => {
      lState.p1Lines = {};
      saveState();
      drawCanvas();
      updateStatusPills();
    });
  }

  // --- LISTENING PART 2: NOMBRES DELETREADOS Y NÚMEROS ---
  function renderListeningPart2(bodyEl, partData) {
    const lState = getVolState().listening;
    const isChecked = getVolState().checkedAnswers.listening;

    bodyEl.innerHTML = `
      <div class="part2-layout">
        <div class="scene-preview-box">
          <img src="${partData.sceneImg}" alt="Listening Part 2 Picture" />
        </div>
        <div>
          <div class="examples-box">
            <div class="examples-title">Examples</div>
            ${partData.examples
              .map(
                (ex) => `
                <div class="example-row">
                  <span class="q-prompt">${ex.prompt}</span>
                  <span class="handwritten-example">${ex.answer}</span>
                </div>
              `
              )
              .join("")}
          </div>

          <div class="questions-list">
            <div class="examples-title">Questions</div>
            ${partData.questions
              .map((qObj) => {
                const val = lState.p2Answers[qObj.q] || "";
                let statusClass = "";
                if (isChecked) {
                  statusClass = isAnswerAccepted(val, qObj.accepted) ? "correct" : "wrong";
                }
                return `
                  <div class="question-row">
                    <span class="q-num">${qObj.q}</span>
                    <span class="q-prompt">${qObj.prompt}</span>
                    <div class="q-answer-wrap">
                      ${qObj.prefix ? `<span class="q-affix">${qObj.prefix}</span>` : ""}
                      <input type="text"
                             class="exam-input ${statusClass}"
                             data-lp2-q="${qObj.q}"
                             value="${val.replace(/"/g, "&quot;")}"
                             placeholder="..........."
                             autocomplete="off"
                             spellcheck="false" />
                      ${qObj.suffix ? `<span class="q-affix">${qObj.suffix}</span>` : ""}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      </div>
    `;

    bodyEl.querySelectorAll("[data-lp2-q]").forEach((inp) => {
      const qNum = inp.getAttribute("data-lp2-q");
      inp.addEventListener("click", () => {
        if (state.activeTool === "eraser") {
          inp.value = "";
          lState.p2Answers[qNum] = "";
          saveState();
        }
      });
      inp.addEventListener("input", () => {
        lState.p2Answers[qNum] = inp.value;
        inp.classList.remove("correct", "wrong");
        saveState();
      });
    });
  }

  // --- LISTENING PART 3: MULTIPLE CHOICE VISUAL (A, B, C) ---
  function renderListeningPart3(bodyEl, partData) {
    const lState = getVolState().listening;

    function renderOptionCards(qKey, options, selectedLetter, isExample) {
      return ["A", "B", "C"]
        .map((letter) => {
          const isChecked = selectedLetter === letter;
          return `
            <div class="p3-opt-card ${isChecked ? "selected" : ""}"
                 data-p3-q="${isExample ? "" : qKey}"
                 data-p3-opt="${letter}">
              <img src="${options[letter]}" alt="Option ${letter}" class="p3-opt-img" />
              <div class="p3-tickbox-row">
                <span class="p3-opt-letter">${letter}</span>
                <div class="cambridge-tickbox" role="checkbox" aria-checked="${isChecked}">
                  ${isChecked ? "✔" : ""}
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    bodyEl.innerHTML = `
      <div class="p3-item-card is-example">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong class="q-prompt">Example: ${partData.example.prompt}</strong>
          <span class="status-pill example">Ejemplo resuelto (${partData.example.answer})</span>
        </div>
        <div class="p3-options-grid">
          ${renderOptionCards("ex", partData.example.options, partData.example.answer, true)}
        </div>
      </div>

      ${partData.questions
        .map((qObj) => {
          const sel = lState.p3Answers[qObj.q] || "";
          return `
            <div class="p3-item-card">
              <div style="display:flex;align-items:baseline;gap:0.5rem;">
                <span class="q-num">${qObj.q}</span>
                <span class="q-prompt">${qObj.prompt}</span>
              </div>
              <div class="p3-options-grid">
                ${renderOptionCards(qObj.q, qObj.options, sel, false)}
              </div>
            </div>
          `;
        })
        .join("")}
    `;

    bodyEl.querySelectorAll("[data-p3-q]").forEach((card) => {
      const qNum = card.getAttribute("data-p3-q");
      if (!qNum) return;
      card.addEventListener("click", () => {
        const opt = card.getAttribute("data-p3-opt");
        if (state.activeTool === "eraser") {
          delete lState.p3Answers[qNum];
        } else {
          lState.p3Answers[qNum] = opt;
        }
        saveState();
        renderListeningPart3(bodyEl, partData);
      });
    });
  }

  // --- LISTENING PART 4: COLOREAR OBJETOS EN LA ESCENA CON LOS 9 LÁPICES ---
  function renderListeningPart4(bodyEl, partData) {
    const lState = getVolState().listening;

    bodyEl.innerHTML = `
      <div class="canvas-stage-wrapper">
        <div style="display:flex;gap:0.6rem;flex-wrap:wrap;justify-content:center;align-items:center;">
          <span class="status-pill example">📌 Ejemplo: ${partData.example.desc}</span>
          <button type="button" class="btn-chip ${lState.showSolutionP4 ? "active" : ""}" id="btn-toggle-sol-p4">
            👁️ ${lState.showSolutionP4 ? "Ocultar Solución Oficial" : "Mostrar Solución Oficial (Docente)"}
          </button>
          <button type="button" class="btn-chip" id="btn-clear-p4">
            🗑️ Limpiar todo el coloreado
          </button>
        </div>

        <div id="p4-color-alert" class="lichu-tip-banner" style="background:#fefce8;border-left-color:#eab308;color:#854d0e;margin-bottom:0.2rem;">
          🎨 <span>Seleccioná uno de los <strong>9 lápices de colores</strong> en tu Ziploc de la izquierda y tocá o pintá sobre cada <strong>${partData.objectNoun}</strong>.</span>
        </div>

        <div class="canvas-container" id="p4-canvas-container">
          <img src="${partData.sceneImg}" alt="Listening Part 4 Colouring Scene" class="canvas-bg-img" id="p4-scene-img" />
          <canvas id="p4-canvas" class="interactive-canvas coloring-mode"></canvas>
        </div>

        <div id="p4-status-pills" class="canvas-status-list"></div>
      </div>
    `;

    const img = document.getElementById("p4-scene-img");
    const canvas = document.getElementById("p4-canvas");
    const pillsWrap = document.getElementById("p4-status-pills");
    const alertBox = document.getElementById("p4-color-alert");

    let isPainting = false;
    let currentStroke = null;

    function updateP4Pills() {
      const colored = lState.p4Colors || {};
      const entries = Object.entries(colored);
      if (entries.length === 0) {
        pillsWrap.innerHTML = `<span class="status-pill">Ningún objeto coloreado todavía (0/5). Elegí un color de la Ziploc y pintá en la escena.</span>`;
        return;
      }
      pillsWrap.innerHTML = entries
        .map(([zoneId, colorId]) => {
          const zObj = partData.zones.find((z) => z.id === zoneId);
          const cObj = DATA.pencilCase.find((c) => c.id === colorId);
          if (!zObj || !cObj) return "";
          return `
            <span class="status-pill connected" style="background:#fff;border-color:${cObj.hex};color:#0f172a;">
              <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${cObj.hex};"></span>
              <strong>${zObj.esLabel}:</strong> ${cObj.label}
              <button type="button" class="status-pill-del" data-del-zone="${zoneId}" title="Borrar color">✕</button>
            </span>
          `;
        })
        .join("");

      pillsWrap.querySelectorAll("[data-del-zone]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const zId = btn.getAttribute("data-del-zone");
          delete lState.p4Colors[zId];
          saveState();
          drawP4Canvas();
          updateP4Pills();
        });
      });
    }

    function syncSize() {
      const rect = img.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        drawP4Canvas();
      }
    }

    function pctToPx(xPct, yPct) {
      return {
        x: (xPct / 100) * canvas.width,
        y: (yPct / 100) * canvas.height
      };
    }

    function eventToPct(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      };
    }

    function findZoneAt(pct) {
      for (const z of partData.zones) {
        const [x1, y1, x2, y2] = z.box;
        if (pct.x >= x1 && pct.x <= x2 && pct.y >= y1 && pct.y <= y2) {
          return z;
        }
      }
      return null;
    }

    function drawP4Canvas() {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Rellenos inteligentes de zonas coloreadas por Lichu
      Object.entries(lState.p4Colors || {}).forEach(([zoneId, colorId]) => {
        const z = partData.zones.find((item) => item.id === zoneId);
        const tool = DATA.pencilCase.find((t) => t.id === colorId);
        if (!z || !tool) return;

        const center = pctToPx(z.x, z.y);
        const rx = (z.rx / 100) * canvas.width;
        const ry = (z.ry / 100) * canvas.height;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(center.x, center.y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = tool.fillHex || tool.hex;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = tool.hex;
        ctx.stroke();
        ctx.restore();
      });

      // 2. Trazos a mano alzada adicionales con lápiz de color
      (lState.p4Strokes || []).forEach((st) => {
        if (!st.points || st.points.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = st.fillHex || st.hex;
        ctx.lineWidth = Math.max(12, canvas.width * 0.022);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const p0 = pctToPx(st.points[0].x, st.points[0].y);
        ctx.moveTo(p0.x, p0.y);
        for (let i = 1; i < st.points.length; i++) {
          const pi = pctToPx(st.points[i].x, st.points[i].y);
          ctx.lineTo(pi.x, pi.y);
        }
        ctx.stroke();
        ctx.restore();
      });

      // 3. Vista de Solución Oficial para el docente
      if (lState.showSolutionP4) {
        partData.zones
          .filter((z) => !z.isDistractor)
          .forEach((z) => {
            const tool = DATA.pencilCase.find((t) => t.id === z.expectedColor);
            if (!tool) return;
            const [x1, y1, x2, y2] = z.box;
            const tl = pctToPx(x1, y1);
            const br = pctToPx(x2, y2);
            ctx.save();
            ctx.strokeStyle = tool.hex;
            ctx.lineWidth = 3.5;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
            ctx.fillStyle = "#0f172a";
            ctx.font = "bold 13px Nunito, sans-serif";
            ctx.fillText(`#${z.q}: ${tool.label}`, tl.x + 2, Math.max(14, tl.y - 5));
            ctx.restore();
          });
      }
    }

    function applyPaintOrEraseAt(pct) {
      const toolObj = DATA.pencilCase.find((t) => t.id === state.activeTool);
      const hitZone = findZoneAt(pct);

      if (state.activeTool === "eraser") {
        if (hitZone && lState.p4Colors[hitZone.id]) {
          delete lState.p4Colors[hitZone.id];
        }
        // Borrar también trazos cercanos
        lState.p4Strokes = (lState.p4Strokes || []).filter((st) =>
          !st.points.some((pt) => Math.hypot(pt.x - pct.x, pt.y - pct.y) < 5.5)
        );
        saveState();
        drawP4Canvas();
        updateP4Pills();
        return;
      }

      if (!toolObj || toolObj.type !== "color") {
        if (alertBox) {
          alertBox.style.background = "#fee2e2";
          alertBox.style.borderLeftColor = "#ef4444";
          alertBox.style.color = "#991b1b";
          alertBox.innerHTML = `⚠️ <span>Tenés seleccionado el <strong>lápiz negro (PENCIL)</strong>. ¡Hacé clic en uno de los <strong>9 lápices de colores</strong> en tu Ziploc de la izquierda para colorear!</span>`;
        }
        return;
      }

      if (alertBox) {
        alertBox.style.background = "#f0fdf4";
        alertBox.style.borderLeftColor = "#16a34a";
        alertBox.style.color = "#166534";
        alertBox.innerHTML = `🎨 <span>Pintando con <strong>${toolObj.label} (${toolObj.es})</strong>. Tocá o pintá el objeto que diga el audio.</span>`;
      }

      if (hitZone) {
        lState.p4Colors[hitZone.id] = toolObj.id;
        saveState();
        updateP4Pills();
      }
    }

    canvas.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const pct = eventToPct(e);
      isPainting = true;
      canvas.setPointerCapture(e.pointerId);

      const toolObj = DATA.pencilCase.find((t) => t.id === state.activeTool);
      if (toolObj && toolObj.type === "color") {
        currentStroke = {
          colorId: toolObj.id,
          hex: toolObj.hex,
          fillHex: toolObj.fillHex,
          points: [pct]
        };
        if (!lState.p4Strokes) lState.p4Strokes = [];
        lState.p4Strokes.push(currentStroke);
      }

      applyPaintOrEraseAt(pct);
      drawP4Canvas();
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!isPainting) return;
      const pct = eventToPct(e);
      if (currentStroke && state.activeTool !== "eraser") {
        currentStroke.points.push(pct);
      }
      applyPaintOrEraseAt(pct);
      drawP4Canvas();
    });

    canvas.addEventListener("pointerup", () => {
      isPainting = false;
      currentStroke = null;
      saveState();
    });

    if (img.complete) {
      syncSize();
    } else {
      img.addEventListener("load", syncSize);
    }
    window.addEventListener("resize", syncSize);
    updateP4Pills();
    updateCanvasCursor();

    document.getElementById("btn-toggle-sol-p4")?.addEventListener("click", () => {
      lState.showSolutionP4 = !lState.showSolutionP4;
      renderListeningPart4(bodyEl, partData);
    });
    document.getElementById("btn-clear-p4")?.addEventListener("click", () => {
      lState.p4Colors = {};
      lState.p4Strokes = [];
      saveState();
      drawP4Canvas();
      updateP4Pills();
    });
  }

  // --------------------------------------------------------------------------
  // 8. MÓDULO READING AND WRITING (PARTES 1 A 5 — 25 PREGUNTAS)
  // --------------------------------------------------------------------------
  function isRWPartDone(volKey, partKey) {
    const rwState = state.volumes[volKey].rw;
    const map = {
      part1: rwState.p1Answers,
      part2: rwState.p2Answers,
      part3: rwState.p3Answers,
      part4: rwState.p4Answers,
      part5: rwState.p5Answers
    };
    const obj = map[partKey] || {};
    return [1, 2, 3, 4, 5].every((q) => normalizeText(obj[q]));
  }

  function renderRWView(container) {
    const vData = getVolData().readingWriting;
    const partKey = state.currentPart.rw || "part1";
    const partData = vData[partKey];

    const partsList = [
      { key: "part1", label: "Part 1 · ✔ o ✘" },
      { key: "part2", label: "Part 2 · Yes / No" },
      { key: "part3", label: "Part 3 · Deletreo" },
      { key: "part4", label: "Part 4 · Texto Cloze" },
      { key: "part5", label: "Part 5 · Historieta" }
    ];

    container.innerHTML = `
      <div class="parts-nav-bar">
        <div class="parts-tabs" role="tablist">
          ${partsList
            .map((p) => {
              const done = isRWPartDone(state.currentVol, p.key);
              return `
                <button type="button"
                        class="part-tab ${partKey === p.key ? "active" : ""}"
                        data-rw-part="${p.key}">
                  <span class="part-done-dot ${done ? "done" : ""}"></span>
                  ${p.label}
                </button>
              `;
            })
            .join("")}
        </div>
        <div>
          <button type="button" class="btn-secondary" id="btn-grade-rw">
            ✅ Finalizar 2. Reading &amp; Writing y pasar a 3. Speaking →
          </button>
        </div>
      </div>

      <section class="booklet-page">
        <div class="booklet-strip">Pre A1 Starters · Reading &amp; Writing · ${getVolData().badge}</div>
        <header class="booklet-header">
          <h1 class="booklet-part-title">${partData.title}</h1>
          <div class="booklet-part-subtitle">${partData.subtitle}</div>
          <p class="booklet-instruction">${partData.instruction}</p>
        </header>

        <div class="lichu-tip-banner">
          <span>💡</span>
          <span><strong>Tip para ${escapeHTML(getStudentName())}:</strong> ${partData.tipEs}</span>
        </div>

        <div id="rw-part-body"></div>

        <footer class="booklet-footer-nav">
          <div>
            ${
              partKey !== "part1"
                ? `<button type="button" class="btn-secondary" id="btn-rw-prev">← Parte anterior</button>`
                : `<span></span>`
            }
          </div>
          <div>
            ${
              partKey !== "part5"
                ? `<button type="button" class="btn-primary" id="btn-rw-next">Siguiente Parte →</button>`
                : `<button type="button" class="btn-primary" id="btn-rw-finish">✅ Finalizar 2. Reading &amp; Writing y pasar a 3. Speaking →</button>`
            }
          </div>
        </footer>
      </section>
    `;

    container.querySelectorAll("[data-rw-part]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.currentPart.rw = btn.getAttribute("data-rw-part");
        renderRWView(container);
      });
    });

    const order = ["part1", "part2", "part3", "part4", "part5"];
    const idx = order.indexOf(partKey);
    document.getElementById("btn-rw-prev")?.addEventListener("click", () => {
      if (idx > 0) navigateTo("rw", order[idx - 1]);
    });
    document.getElementById("btn-rw-next")?.addEventListener("click", () => {
      if (idx < order.length - 1) navigateTo("rw", order[idx + 1]);
    });
    document.getElementById("btn-rw-finish")?.addEventListener("click", () => {
      getVolState().checkedAnswers.rw = true;
      saveState();
      navigateTo("speaking");
    });
    document.getElementById("btn-grade-rw")?.addEventListener("click", () => {
      getVolState().checkedAnswers.rw = true;
      saveState();
      navigateTo("speaking");
    });

    const bodyEl = document.getElementById("rw-part-body");
    if (partKey === "part1") {
      renderRWPart1(bodyEl, partData);
    } else if (partKey === "part2") {
      renderRWPart2(bodyEl, partData);
    } else if (partKey === "part3") {
      renderRWPart3(bodyEl, partData);
    } else if (partKey === "part4") {
      renderRWPart4(bodyEl, partData);
    } else if (partKey === "part5") {
      renderRWPart5(bodyEl, partData);
    }
  }

  // --- R&W PART 1: TICK (✔) OR CROSS (✘) ---
  function renderRWPart1(bodyEl, partData) {
    const rwState = getVolState().rw;

    bodyEl.innerHTML = `
      <div class="rwp1-list">
        <div class="examples-title">Examples</div>
        ${partData.examples
          .map(
            (ex) => `
            <div class="rwp1-row is-example">
              <div class="rwp1-left">
                <img src="${ex.img}" alt="${ex.sentence}" class="rwp1-img" />
                <span class="rwp1-sentence">${ex.sentence}</span>
              </div>
              <div class="rwp1-actions">
                <span class="status-pill example">Ejemplo</span>
                <div class="cambridge-tickbox ${ex.answer === "cross" ? "cross" : ""}">
                  ${ex.answer === "tick" ? "✔" : "✘"}
                </div>
              </div>
            </div>
          `
          )
          .join("")}

        <div class="examples-title" style="margin-top:0.6rem;">Questions</div>
        ${partData.questions
          .map((qObj) => {
            const val = rwState.p1Answers[qObj.q] || "";
            return `
              <div class="rwp1-row">
                <div class="rwp1-left">
                  <span class="q-num">${qObj.q}</span>
                  <img src="${qObj.img}" alt="${qObj.sentence}" class="rwp1-img" />
                  <span class="rwp1-sentence">${qObj.sentence}</span>
                </div>
                <div class="rwp1-actions">
                  <button type="button" class="tick-choice-btn tick ${val === "tick" ? "active" : ""}" data-rwp1-q="${qObj.q}" data-rwp1-val="tick">✔ Tick</button>
                  <button type="button" class="tick-choice-btn cross ${val === "cross" ? "active" : ""}" data-rwp1-q="${qObj.q}" data-rwp1-val="cross">✘ Cross</button>
                  <div class="cambridge-tickbox ${val === "cross" ? "cross" : ""}" data-rwp1-cycle="${qObj.q}" title="Clic para alternar ✔ / ✘">
                    ${val === "tick" ? "✔" : val === "cross" ? "✘" : ""}
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;

    bodyEl.querySelectorAll("[data-rwp1-val]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-rwp1-q");
        const v = btn.getAttribute("data-rwp1-val");
        if (state.activeTool === "eraser") {
          delete rwState.p1Answers[q];
        } else {
          rwState.p1Answers[q] = v;
        }
        saveState();
        renderRWPart1(bodyEl, partData);
      });
    });

    bodyEl.querySelectorAll("[data-rwp1-cycle]").forEach((box) => {
      box.addEventListener("click", () => {
        const q = box.getAttribute("data-rwp1-cycle");
        if (state.activeTool === "eraser") {
          delete rwState.p1Answers[q];
        } else {
          const curr = rwState.p1Answers[q] || "";
          rwState.p1Answers[q] = curr === "tick" ? "cross" : curr === "cross" ? "" : "tick";
        }
        saveState();
        renderRWPart1(bodyEl, partData);
      });
    });
  }

  // --- R&W PART 2: ESCENA + YES / NO ---
  function renderRWPart2(bodyEl, partData) {
    const rwState = getVolState().rw;
    const isChecked = getVolState().checkedAnswers.rw;

    bodyEl.innerHTML = `
      <div style="max-width:680px;margin:0 auto 1.25rem;">
        <div class="scene-preview-box">
          <img src="${partData.sceneImg}" alt="Reading and Writing Part 2 Scene" />
        </div>
      </div>

      <div class="examples-box">
        <div class="examples-title">Examples</div>
        ${partData.examples
          .map(
            (ex) => `
            <div class="example-row">
              <span class="q-prompt">${ex.sentence}</span>
              <span class="handwritten-example">${ex.answer}</span>
            </div>
          `
          )
          .join("")}
      </div>

      <div class="questions-list">
        <div class="examples-title">Questions</div>
        ${partData.questions
          .map((qObj) => {
            const val = rwState.p2Answers[qObj.q] || "";
            const norm = normalizeText(val);
            let statusClass = "";
            if (isChecked) {
              statusClass = norm === qObj.answer ? "correct" : "wrong";
            }
            return `
              <div class="question-row">
                <span class="q-num">${qObj.q}</span>
                <span class="q-prompt">${qObj.sentence}</span>
                <div class="q-answer-wrap">
                  <button type="button" class="btn-chip ${norm === "yes" ? "active" : ""}" data-rwp2-quick="${qObj.q}" data-val="yes">yes</button>
                  <button type="button" class="btn-chip ${norm === "no" ? "active" : ""}" data-rwp2-quick="${qObj.q}" data-val="no">no</button>
                  <input type="text"
                         class="exam-input ${statusClass}"
                         style="width:110px;"
                         data-rwp2-q="${qObj.q}"
                         value="${val.replace(/"/g, "&quot;")}"
                         placeholder="yes / no"
                         autocomplete="off"
                         spellcheck="false" />
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;

    bodyEl.querySelectorAll("[data-rwp2-q]").forEach((inp) => {
      const q = inp.getAttribute("data-rwp2-q");
      inp.addEventListener("click", () => {
        if (state.activeTool === "eraser") {
          inp.value = "";
          rwState.p2Answers[q] = "";
          saveState();
          renderRWPart2(bodyEl, partData);
        }
      });
      inp.addEventListener("input", () => {
        rwState.p2Answers[q] = inp.value;
        inp.classList.remove("correct", "wrong");
        saveState();
      });
    });

    bodyEl.querySelectorAll("[data-rwp2-quick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-rwp2-quick");
        const v = btn.getAttribute("data-val");
        if (state.activeTool === "eraser") {
          rwState.p2Answers[q] = "";
        } else {
          rwState.p2Answers[q] = v;
        }
        saveState();
        renderRWPart2(bodyEl, partData);
      });
    });
  }

  // --- R&W PART 3: ANAGRAMAS CON GUIONES EXACTOS Y FICHAS DE LETRAS ---
  function renderRWPart3(bodyEl, partData) {
    const rwState = getVolState().rw;

    // Calcula qué fichas de letras están usadas según las letras escritas por el alumno
    function getUsedTileIndices(scrambled, currentWord) {
      const used = [];
      const chars = (currentWord || "").toLowerCase().split("");
      chars.forEach((ch) => {
        if (!ch || ch === " ") return;
        for (let i = 0; i < scrambled.length; i++) {
          if (!used.includes(i) && scrambled[i].toLowerCase() === ch) {
            used.push(i);
            break;
          }
        }
      });
      return used;
    }

    bodyEl.innerHTML = `
      <div class="examples-title">Example</div>
      <div class="rwp3-row" style="background:#f5f3ff;border-style:dashed;border-color:#a78bfa;">
        <span class="q-num">Ex</span>
        <img src="${partData.example.img}" alt="Example object" class="rwp3-obj-img" />
        <div class="rwp3-center">
          <div class="dashes-Wrap">
            ${partData.example.answer
              .split("")
              .map(
                (ch) => `
                <input type="text" class="letter-dash-input" value="${ch}" disabled style="color:#475569;background:#f1f5f9;" />
              `
              )
              .join("")}
          </div>
          <span class="status-pill example">Ejemplo resuelto: ${partData.example.answer}</span>
        </div>
        <img src="${partData.example.lettersImg}" alt="Scrambled letters" class="rwp3-let-img" />
      </div>

      <div class="examples-title" style="margin-top:1rem;">Questions</div>
      ${partData.questions
        .map((qObj) => {
          const wordLen = qObj.answer.length;
          const savedWord = (rwState.p3Answers[qObj.q] || "").padEnd(wordLen, " ");
          const usedIndices = getUsedTileIndices(qObj.scrambled, rwState.p3Answers[qObj.q] || "");

          return `
            <div class="rwp3-row" data-rwp3-row="${qObj.q}">
              <span class="q-num">${qObj.q}</span>
              <img src="${qObj.img}" alt="Question ${qObj.q}" class="rwp3-obj-img" />
              <div class="rwp3-center">
                <div class="dashes-Wrap">
                  ${Array.from({ length: wordLen })
                    .map((_, idx) => {
                      const ch = savedWord[idx] === " " ? "" : savedWord[idx];
                      return `
                        <input type="text"
                               maxlength="1"
                               class="letter-dash-input"
                               data-rwp3-q="${qObj.q}"
                               data-rwp3-idx="${idx}"
                               data-rwp3-len="${wordLen}"
                               value="${ch}"
                               autocomplete="off"
                               spellcheck="false" />
                      `;
                    })
                    .join("")}
                </div>
                <div class="letter-tiles-row">
                  ${qObj.scrambled
                    .map((letChar, tIdx) => {
                      const isUsed = usedIndices.includes(tIdx);
                      return `
                        <button type="button"
                                class="letter-tile-btn ${isUsed ? "used" : ""}"
                                data-tile-q="${qObj.q}"
                                data-tile-char="${letChar}">
                          ${letChar}
                        </button>
                      `;
                    })
                    .join("")}
                  <button type="button" class="btn-chip" data-clear-rwp3="${qObj.q}" title="Borrar palabra">⌫</button>
                </div>
              </div>
              <img src="${qObj.lettersImg}" alt="Scrambled letters ${qObj.q}" class="rwp3-let-img" />
            </div>
          `;
        })
        .join("")}
    `;

    function collectWordFromInputs(qNum) {
      const inputs = Array.from(bodyEl.querySelectorAll(`[data-rwp3-q="${qNum}"]`));
      const raw = inputs.map((inp) => (inp.value || " ")[0]).join("");
      rwState.p3Answers[qNum] = raw.trimEnd();
      saveState();

      // Actualizar estado visual de las fichitas tachadas sin perder el foco del input
      const qObj = partData.questions.find((item) => String(item.q) === String(qNum));
      if (qObj) {
        const usedIdx = getUsedTileIndices(qObj.scrambled, raw);
        const tileBtns = bodyEl.querySelectorAll(`[data-tile-q="${qNum}"]`);
        tileBtns.forEach((btn, idx) => {
          btn.classList.toggle("used", usedIdx.includes(idx));
        });
      }
    }

    bodyEl.querySelectorAll("[data-rwp3-q]").forEach((inp) => {
      const qNum = inp.getAttribute("data-rwp3-q");
      const idx = Number(inp.getAttribute("data-rwp3-idx"));
      const len = Number(inp.getAttribute("data-rwp3-len"));

      inp.addEventListener("click", () => {
        if (state.activeTool === "eraser") {
          inp.value = "";
          collectWordFromInputs(qNum);
        } else {
          inp.select();
        }
      });

      inp.addEventListener("input", () => {
        const val = inp.value.replace(/[^a-zA-Z]/g, "").toLowerCase();
        inp.value = val;
        collectWordFromInputs(qNum);
        if (val && idx < len - 1) {
          const next = bodyEl.querySelector(`[data-rwp3-q="${qNum}"][data-rwp3-idx="${idx + 1}"]`);
          next?.focus();
          next?.select();
        }
      });

      inp.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !inp.value && idx > 0) {
          const prev = bodyEl.querySelector(`[data-rwp3-q="${qNum}"][data-rwp3-idx="${idx - 1}"]`);
          if (prev) {
            prev.value = "";
            prev.focus();
            collectWordFromInputs(qNum);
            e.preventDefault();
          }
        } else if (e.key === "ArrowLeft" && idx > 0) {
          bodyEl.querySelector(`[data-rwp3-q="${qNum}"][data-rwp3-idx="${idx - 1}"]`)?.focus();
        } else if (e.key === "ArrowRight" && idx < len - 1) {
          bodyEl.querySelector(`[data-rwp3-q="${qNum}"][data-rwp3-idx="${idx + 1}"]`)?.focus();
        }
      });
    });

    // Clic en fichita de letra -> completa el primer guion vacío
    bodyEl.querySelectorAll("[data-tile-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qNum = btn.getAttribute("data-tile-q");
        const ch = btn.getAttribute("data-tile-char");
        const inputs = Array.from(bodyEl.querySelectorAll(`[data-rwp3-q="${qNum}"]`));
        const emptyInp = inputs.find((i) => !i.value.trim());
        if (emptyInp) {
          emptyInp.value = ch;
          collectWordFromInputs(qNum);
        }
      });
    });

    bodyEl.querySelectorAll("[data-clear-rwp3]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qNum = btn.getAttribute("data-clear-rwp3");
        delete rwState.p3Answers[qNum];
        saveState();
        renderRWPart3(bodyEl, partData);
      });
    });
  }

  // --- R&W PART 4: TEXTO CLOZE ILUSTRADO ---
  function renderRWPart4(bodyEl, partData) {
    const rwState = getVolState().rw;
    const isChecked = getVolState().checkedAnswers.rw;
    const usedWords = Object.values(rwState.p4Answers || {}).map((w) => normalizeText(w));

    const passageHTML = partData.segments
      .map((seg) => {
        if (seg.type === "text") {
          return seg.text.replace(/\n\n/g, "<br/><br/>");
        }
        if (seg.type === "example") {
          return `<span class="handwritten-example" style="margin:0 0.25rem;">${seg.word}</span>`;
        }
        if (seg.type === "blank") {
          const val = rwState.p4Answers[seg.q] || "";
          const isActive = state.activeClozeBlank === seg.q;
          let statusClass = "";
          if (isChecked) {
            statusClass = normalizeText(val) === normalizeText(seg.answer) ? "correct" : "wrong";
          }
          return `
            <span class="cloze-blank-wrap">
              <span class="cloze-num">(${seg.q})</span>
              <input type="text"
                     class="exam-input cloze-input ${isActive ? "active-slot" : ""} ${statusClass}"
                     data-rwp4-blank="${seg.q}"
                     value="${val.replace(/"/g, "&quot;")}"
                     placeholder="..........."
                     autocomplete="off"
                     spellcheck="false" />
            </span>
          `;
        }
        return "";
      })
      .join("");

    bodyEl.innerHTML = `
      <div class="rwp4-container">
        <div class="rwp4-passage-box">
          <div class="rwp4-header">
            <h3>${partData.passageTitle}</h3>
            <img src="${partData.mainImg}" alt="${partData.passageTitle}" class="rwp4-main-img" />
          </div>
          <div>${passageHTML}</div>
        </div>

        <div class="rwp4-wordbox">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:0.5rem;">
            <strong style="font-family:var(--font-heading);">📦 Caja de Palabras (Tocá o arrastrá una tarjeta para colocarla en el espacio (${state.activeClozeBlank}))</strong>
            <span style="font-size:0.82rem;color:#64748b;">Sobran 2 palabras que no se usan</span>
          </div>
          <div class="rwp4-wordbox-grid">
            ${partData.wordBox
              .map((wItem) => {
                const isUsedByStudent = usedWords.includes(normalizeText(wItem.word));
                return `
                  <div class="wordbox-card ${wItem.isExample ? "example-used" : ""} ${isUsedByStudent ? "used-by-student" : ""}"
                       draggable="${!wItem.isExample}"
                       data-wordbox-word="${wItem.word}">
                    <img src="${wItem.img}" alt="${wItem.word}" />
                    <div style="font-weight:800;font-size:0.95rem;margin-top:2px;">
                      ${wItem.word} ${wItem.isExample ? "(Ejemplo)" : isUsedByStudent ? "✓" : ""}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      </div>
    `;

    bodyEl.querySelectorAll("[data-rwp4-blank]").forEach((inp) => {
      const q = Number(inp.getAttribute("data-rwp4-blank"));
      inp.addEventListener("focus", () => {
        state.activeClozeBlank = q;
        bodyEl.querySelectorAll("[data-rwp4-blank]").forEach((el) => {
          el.classList.toggle("active-slot", Number(el.getAttribute("data-rwp4-blank")) === q);
        });
      });
      inp.addEventListener("click", () => {
        if (state.activeTool === "eraser") {
          inp.value = "";
          rwState.p4Answers[q] = "";
          saveState();
          renderRWPart4(bodyEl, partData);
        }
      });
      inp.addEventListener("input", () => {
        rwState.p4Answers[q] = inp.value;
        saveState();
      });
      inp.addEventListener("dragover", (e) => e.preventDefault());
      inp.addEventListener("drop", (e) => {
        e.preventDefault();
        const droppedWord = e.dataTransfer?.getData("text/plain");
        if (droppedWord) {
          rwState.p4Answers[q] = droppedWord;
          state.activeClozeBlank = q < 5 ? q + 1 : 1;
          saveState();
          renderRWPart4(bodyEl, partData);
        }
      });
    });

    bodyEl.querySelectorAll("[data-wordbox-word]").forEach((card) => {
      const word = card.getAttribute("data-wordbox-word");
      if (word === partData.exampleWord) return;

      card.addEventListener("dragstart", (e) => {
        e.dataTransfer?.setData("text/plain", word);
      });

      card.addEventListener("click", () => {
        const targetBlank = state.activeClozeBlank || 1;
        rwState.p4Answers[targetBlank] = word;
        // Avanzar al siguiente espacio vacío
        const nextEmpty = [1, 2, 3, 4, 5].find((n) => n !== targetBlank && !normalizeText(rwState.p4Answers[n]));
        state.activeClozeBlank = nextEmpty || (targetBlank < 5 ? targetBlank + 1 : 1);
        saveState();
        renderRWPart4(bodyEl, partData);
      });
    });
  }

  // --- R&W PART 5: HISTORIETA EN 3 CUADROS (RESPUESTAS DE 1 SOLA PALABRA) ---
  function renderRWPart5(bodyEl, partData) {
    const rwState = getVolState().rw;
    const isChecked = getVolState().checkedAnswers.rw;

    bodyEl.innerHTML = partData.scenes
      .map(
        (sc) => `
        <div style="margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:2px dashed #cbd5e1;">
          <div style="max-width:660px;margin:0 auto 1rem;">
            <div class="scene-preview-box">
              <img src="${sc.img}" alt="Story Scene ${sc.sceneNum}" />
            </div>
          </div>

          ${
            sc.examples && sc.examples.length > 0
              ? `
            <div class="examples-box">
              <div class="examples-title">Examples</div>
              ${sc.examples
                .map(
                  (ex) => `
                  <div class="example-row">
                    <span class="q-prompt">${ex.prompt}</span>
                    <div class="q-answer-wrap">
                      ${ex.prefix ? `<span class="q-affix">${ex.prefix}</span>` : ""}
                      <span class="handwritten-example">${ex.answer}</span>
                    </div>
                  </div>
                `
                )
                .join("")}
            </div>
          `
              : ""
          }

          <div class="questions-list">
            ${sc.questions
              .map((qObj) => {
                const val = rwState.p5Answers[qObj.q] || "";
                let statusClass = "";
                if (isChecked) {
                  statusClass = isAnswerAccepted(val, qObj.accepted) ? "correct" : "wrong";
                }
                return `
                  <div class="question-row">
                    <span class="q-num">${qObj.q}</span>
                    <span class="q-prompt">${qObj.prompt}</span>
                    <div class="q-answer-wrap">
                      ${qObj.prefix ? `<span class="q-affix">${qObj.prefix}</span>` : ""}
                      <input type="text"
                             class="exam-input ${statusClass}"
                             data-rwp5-q="${qObj.q}"
                             value="${val.replace(/"/g, "&quot;")}"
                             placeholder="1 palabra..."
                             autocomplete="off"
                             spellcheck="false" />
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `
      )
      .join("");

    bodyEl.querySelectorAll("[data-rwp5-q]").forEach((inp) => {
      const q = inp.getAttribute("data-rwp5-q");
      inp.addEventListener("click", () => {
        if (state.activeTool === "eraser") {
          inp.value = "";
          rwState.p5Answers[q] = "";
          saveState();
        }
      });
      inp.addEventListener("input", () => {
        rwState.p5Answers[q] = inp.value;
        inp.classList.remove("correct", "wrong");
        saveState();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. MÓDULO SPEAKING (LÁMINA A COLOR + 8 TARJETAS RECORTADAS + PANEL DOCENTE)
  // --------------------------------------------------------------------------
  function speakEnglish(text, rate = 0.9) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-GB";
    utter.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const gbVoice = voices.find((v) => v.lang.includes("en-GB") || v.lang.includes("en_GB"));
    if (gbVoice) utter.voice = gbVoice;
    window.speechSynthesis.speak(utter);
  }

  function renderSpeakingView(container) {
    const spData = getVolData().speaking;
    const spState = getVolState().speaking;
    const placed = spState.placedCards || {};
    const studentNameHTML = escapeHTML(getStudentName());

    container.innerHTML = `
      <div class="speaking-workspace">
        <section class="booklet-page" style="padding:1.4rem 1.75rem 1.75rem 2.3rem;">
          <div class="booklet-strip">Pre A1 Starters · Speaking · ${getVolData().badge}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:0.85rem;">
            <div>
              <h1 class="booklet-part-title" style="text-align:left;font-size:1.55rem;">
                🗣️ Speaking: ${spData.sceneTitle}
              </h1>
              <p style="font-size:0.94rem;color:#475569;">
                <strong>${studentNameHTML}:</strong> Hacé clic en la lámina para señalar con el dedo (👆) cuando te pregunten <em>"Where's the...?"</em>, o arrastrá las <strong>8 tarjetitas</strong> sobre la escena cuando te digan <em>"Put the ... on/under/next to/between/in..."</em>.
              </p>
            </div>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
              <button type="button" class="btn-secondary" id="btn-reset-speaking-cards">
                🔄 Devolver todas las tarjetas a la bandeja
              </button>
              <button type="button" class="btn-primary" id="btn-finish-speaking-top">
                🏆 Finalizar 3. Speaking y ver Resultados →
              </button>
            </div>
          </div>

          <div class="speaking-board-area">
            <!-- Lámina Grande a Color (Scene Picture) -->
            <div class="speaking-scene-stage" id="speaking-scene-stage">
              <img src="${spData.sceneImg}" alt="${spData.sceneTitle}" class="speaking-scene-img" />
              ${Object.entries(placed)
                .map(([cardId, coords]) => {
                  const cardObj = spData.objectCards.find((c) => c.id === cardId);
                  if (!cardObj) return "";
                  return `
                    <div class="placed-object-card"
                         data-placed-card="${cardId}"
                         style="left:${coords.x}%;top:${coords.y}%;"
                         title="${cardObj.name} (${cardObj.es}) — Arrastrá para mover">
                      <img src="${cardObj.img}" alt="${cardObj.name}" />
                      <button type="button" class="placed-card-remove" data-remove-card="${cardId}" title="Quitar de la escena">✕</button>
                    </div>
                  `;
                })
                .join("")}
            </div>

            <!-- Bandeja con las 8 Object Cards recortadas -->
            <div class="speaking-cards-tray">
              <div class="tray-title">
                <span>✂️ 8 Object Cards</span>
                <span style="font-size:0.75rem;color:#64748b;">Tocá o arrastrá</span>
              </div>
              <div class="tray-grid">
                ${spData.objectCards
                  .map((card) => {
                    const isOnScene = Boolean(placed[card.id]);
                    const isSelected = state.activeSpeakingCard === card.id;
                    return `
                      <div class="tray-card ${isOnScene ? "on-scene" : ""} ${isSelected ? "active-card" : ""}"
                           draggable="true"
                           data-tray-card="${card.id}"
                           title="Tocá para seleccionar y hacer clic en la escena, o arrastrala">
                        <img src="${card.img}" alt="${card.name}" />
                        <div class="tray-card-label">${card.name}</div>
                        <button type="button"
                                class="btn-chip"
                                style="font-size:0.7rem;padding:2px 6px;margin-top:3px;"
                                data-speak-word="${card.name}"
                                title="Escuchar pronunciación">
                          🔊 ${card.num}
                        </button>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
        </section>

        <!-- Panel Colapsable del Examinador (Adulto / Docente acompañante) -->
        <section class="examiner-panel">
          <div class="examiner-panel-header" id="examiner-toggle-header">
            <div>
              <strong style="font-size:1.08rem;">👨‍🏫 Guion Oficial del Examinador para Adulto / Docente (Página 24 · ${getVolData().badge})</strong>
              <span style="font-size:0.82rem;opacity:0.9;margin-left:0.5rem;">
                Incluye <em>Summary of procedures</em>, <em>Minimum response expected</em> y <em>Back-up questions</em>
              </span>
            </div>
            <span>${spState.examinerOpen ? "▼ Ocultar panel" : "▶ Desplegar panel"}</span>
          </div>

          ${
            spState.examinerOpen
              ? `
            <div class="examiner-panel-body">
              <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:0.75rem 1rem;margin-bottom:0.85rem;font-size:0.86rem;">
                <strong style="color:var(--cambridge-purple-dark);">📋 Summary of procedures (Estructura oficial de los 3–5 minutos):</strong>
                <ul style="margin-top:0.35rem;padding-left:1.1rem;">
                  ${spData.summaryOfProcedures.map((line) => `<li>${line}</li>`).join("")}
                </ul>
              </div>

              <div style="overflow-x:auto;">
                <table class="examiner-table">
                  <thead>
                    <tr>
                      <th style="width:50px;">Hecho</th>
                      <th style="width:130px;">Parte</th>
                      <th>What the examiner does</th>
                      <th>What the examiner says (Examinador/a)</th>
                      <th>Minimum response expected from ${studentNameHTML}</th>
                      <th>Back-up questions (si duda)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${spData.examinerSteps
                      .map((st) => {
                        const isDone = Boolean(spState.checkedSteps[st.id]);
                        return `
                          <tr class="${isDone ? "step-done" : ""}">
                            <td style="text-align:center;">
                              <input type="checkbox"
                                     style="width:20px;height:20px;cursor:pointer;"
                                     data-step-check="${st.id}"
                                     ${isDone ? "checked" : ""} />
                            </td>
                            <td><strong>${st.part}</strong></td>
                            <td>${personalizeText(st.whatExaminerDoes)}</td>
                            <td><strong>${personalizeText(st.whatExaminerSays)}</strong></td>
                            <td style="color:#15803d;font-weight:700;">${personalizeText(st.minResponse)}</td>
                            <td style="color:#475569;font-style:italic;">${personalizeText(st.backupQuestions)}</td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>

              <div style="margin-top:1.1rem;padding-top:0.9rem;border-top:1.5px dashed #cbd5e1;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
                <div>
                  <strong><img src="documentation/cambridge-coat-arms.svg" alt="Escudo de Cambridge" class="inline-coat-arms-sm" /> Escudos de Speaking otorgados a ${studentNameHTML}:</strong>
                  <span style="font-size:0.86rem;color:#475569;margin-left:0.4rem;">(Seleccioná de 1 a 5 escudos para sumar al resultado final)</span>
                </div>
                <div style="display:flex;align-items:center;gap:0.45rem;">
                  ${[1, 2, 3, 4, 5]
                    .map(
                      (n) => `
                      <button type="button"
                              class="btn-chip ${spState.shieldsAwarded === n ? "active" : ""}"
                              data-sp-shields="${n}">
                        ${n} <img src="documentation/cambridge-coat-arms.svg" alt="Escudos" class="inline-coat-arms-xs" />
                      </button>
                    `
                    )
                    .join("")}
                  <button type="button" class="btn-primary" id="btn-sp-to-results">
                    🏆 Finalizar 3. Speaking y ver Resultados →
                  </button>
                </div>
              </div>
            </div>
          `
              : ""
          }
        </section>
      </div>
    `;

    const stage = document.getElementById("speaking-scene-stage");

    // Drag & Drop HTML5 desde la bandeja hacia la escena
    container.querySelectorAll("[data-tray-card]").forEach((cardEl) => {
      const cardId = cardEl.getAttribute("data-tray-card");

      cardEl.addEventListener("dragstart", (e) => {
        e.dataTransfer?.setData("text/plain", cardId);
      });

      cardEl.addEventListener("click", (e) => {
        if (e.target.closest("[data-speak-word]")) return;
        state.activeSpeakingCard = state.activeSpeakingCard === cardId ? null : cardId;
        renderSpeakingView(container);
      });
    });

    container.querySelectorAll("[data-speak-word]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        speakEnglish(btn.getAttribute("data-speak-word"));
      });
    });

    if (stage) {
      stage.addEventListener("dragover", (e) => e.preventDefault());
      stage.addEventListener("drop", (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer?.getData("text/plain");
        if (!cardId) return;
        const rect = stage.getBoundingClientRect();
        const x = Math.max(6, Math.min(94, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
        spState.placedCards[cardId] = { x, y };
        state.activeSpeakingCard = null;
        saveState();
        renderSpeakingView(container);
      });

      // Clic en la escena: si hay una tarjeta seleccionada en la bandeja, la ubica ahí; si no, muestra el dedito señalador (👆)
      stage.addEventListener("click", (e) => {
        if (e.target.closest(".placed-object-card")) return;
        const rect = stage.getBoundingClientRect();
        const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

        if (state.activeSpeakingCard) {
          spState.placedCards[state.activeSpeakingCard] = { x, y };
          state.activeSpeakingCard = null;
          saveState();
          renderSpeakingView(container);
          return;
        }

        // Mostrar animación de señalar ("Where's the...?")
        const ripple = document.createElement("div");
        ripple.className = "point-ripple";
        ripple.textContent = "👆";
        ripple.style.left = `${x}%`;
        ripple.style.top = `${y}%`;
        stage.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1300);
      });
    }

    // Permitir arrastrar con puntero (mouse/touch) las tarjetas ya colocadas en la escena
    container.querySelectorAll("[data-placed-card]").forEach((placedEl) => {
      const cardId = placedEl.getAttribute("data-placed-card");
      let dragging = false;

      placedEl.addEventListener("pointerdown", (e) => {
        if (e.target.closest("[data-remove-card]")) return;
        e.preventDefault();
        dragging = true;
        placedEl.setPointerCapture(e.pointerId);
      });

      placedEl.addEventListener("pointermove", (e) => {
        if (!dragging || !stage) return;
        const rect = stage.getBoundingClientRect();
        const x = Math.max(6, Math.min(94, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100));
        placedEl.style.left = `${x}%`;
        placedEl.style.top = `${y}%`;
        spState.placedCards[cardId] = { x, y };
      });

      placedEl.addEventListener("pointerup", () => {
        if (!dragging) return;
        dragging = false;
        saveState();
      });
    });

    container.querySelectorAll("[data-remove-card]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const cId = btn.getAttribute("data-remove-card");
        delete spState.placedCards[cId];
        saveState();
        renderSpeakingView(container);
      });
    });

    document.getElementById("btn-reset-speaking-cards")?.addEventListener("click", () => {
      spState.placedCards = {};
      state.activeSpeakingCard = null;
      saveState();
      renderSpeakingView(container);
    });

    document.getElementById("examiner-toggle-header")?.addEventListener("click", () => {
      spState.examinerOpen = !spState.examinerOpen;
      saveState();
      renderSpeakingView(container);
    });

    container.querySelectorAll("[data-step-check]").forEach((chk) => {
      chk.addEventListener("change", () => {
        const sId = chk.getAttribute("data-step-check");
        spState.checkedSteps[sId] = chk.checked;
        saveState();
        renderSpeakingView(container);
      });
    });

    container.querySelectorAll("[data-sp-shields]").forEach((btn) => {
      btn.addEventListener("click", () => {
        spState.shieldsAwarded = Number(btn.getAttribute("data-sp-shields"));
        saveState();
        renderSpeakingView(container);
      });
    });

    const finishSpeakingAndGoToResults = () => {
      getVolState().checkedAnswers.speaking = true;
      saveState();
      navigateTo("results");
    };

    document.getElementById("btn-finish-speaking-top")?.addEventListener("click", finishSpeakingAndGoToResults);
    document.getElementById("btn-sp-to-results")?.addEventListener("click", finishSpeakingAndGoToResults);
  }

  // --------------------------------------------------------------------------
  // 10. VISTA DE RESULTADOS Y ESCUDOS DE CAMBRIDGE (STATEMENT OF RESULTS)
  // --------------------------------------------------------------------------
  function renderResultsView(container) {
    const lEval = evaluateListening(state.currentVol);
    const rwEval = evaluateRW(state.currentVol);
    const spState = getVolState().speaking;
    const spShields = spState.shieldsAwarded || 5;
    const totalShields = lEval.shields + rwEval.shields + spShields;
    const studentNameHTML = escapeHTML(getStudentName());

    let encouragement = `¡Excelente trabajo, ${studentNameHTML}! Estás súper preparado/a para brillar este sábado 14 de noviembre.`;
    if (totalShields >= 13) {
      encouragement = `🌟 ¡IMPRESIONANTE, ${studentNameHTML.toUpperCase()}! Lograste nivel de distinción en Cambridge Pre A1 Starters. ¡El sábado la vas a romper!`;
    } else if (totalShields >= 10) {
      encouragement = `👏 ¡Muy buen trabajo, ${studentNameHTML}! Mirá abajo las explicaciones de cada pregunta para sumar todavía más escudos.`;
    } else {
      encouragement = `💪 ¡Buen entrenamiento, ${studentNameHTML}! En Cambridge nunca se reprueba: podés completar o corregir cualquier parte abajo para ganar los 15 escudos.`;
    }

    container.innerHTML = `
      <section class="booklet-page" style="padding:1.75rem 2rem 2rem 2.6rem;">
        <div class="booklet-strip">Cambridge English · Statement of Results · ${getVolData().badge}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;margin-bottom:1rem;">
          <div>
            <span class="status-pill example">🏆 REPORTE OFICIAL DE ESCUDOS · ${getVolData().title.toUpperCase()}</span>
            <h1 class="booklet-part-title" style="text-align:left;margin-top:0.35rem;">
              Resultados de ${studentNameHTML}
            </h1>
            <p style="color:#334155;font-size:1rem;margin-top:0.2rem;">${encouragement}</p>
          </div>
          <div style="text-align:center;background:#fefce8;border:2px solid #facc15;border-radius:16px;padding:0.75rem 1.25rem;">
            <div style="font-family:var(--font-heading);font-size:2rem;color:#b45309;line-height:1;display:inline-flex;align-items:center;gap:0.35rem;">
              <span>${totalShields} / 15</span>
              <img src="documentation/cambridge-coat-arms.svg" alt="Escudo de Cambridge" class="inline-coat-arms" />
            </div>
            <div style="font-size:0.8rem;font-weight:800;color:#854d0e;margin-top:0.2rem;">ESCUDOS TOTALES</div>
          </div>
        </div>

        <!-- Tarjetas de las 3 Habilidades -->
        <div class="shields-summary-grid">
          <div class="shield-skill-card">
            <h3 style="font-family:var(--font-heading);font-size:1.25rem;">🎧 Listening</h3>
            ${renderShieldsRowHTML(lEval.shields)}
            <div style="font-weight:800;font-size:1.05rem;color:#1e293b;">
              ${lEval.shields} de 5 Escudos (${lEval.score}/20 aciertos)
            </div>
            <button type="button" class="btn-secondary" style="margin-top:0.65rem;" data-goto-mod="listening" data-goto-part="part1">
              Ir a Listening
            </button>
          </div>

          <div class="shield-skill-card">
            <h3 style="font-family:var(--font-heading);font-size:1.25rem;">✏️ Reading &amp; Writing</h3>
            ${renderShieldsRowHTML(rwEval.shields)}
            <div style="font-weight:800;font-size:1.05rem;color:#1e293b;">
              ${rwEval.shields} de 5 Escudos (${rwEval.score}/25 aciertos)
            </div>
            <button type="button" class="btn-secondary" style="margin-top:0.65rem;" data-goto-mod="rw" data-goto-part="part1">
              Ir a Reading &amp; Writing
            </button>
          </div>

          <div class="shield-skill-card">
            <h3 style="font-family:var(--font-heading);font-size:1.25rem;">🗣️ Speaking</h3>
            ${renderShieldsRowHTML(spShields)}
            <div style="font-weight:800;font-size:1.05rem;color:#1e293b;">
              ${spShields} de 5 Escudos (Práctica en familia)
            </div>
            <button type="button" class="btn-secondary" style="margin-top:0.65rem;" data-goto-mod="speaking" data-goto-part="part1">
              Ir a Speaking
            </button>
          </div>
        </div>

        <hr style="border:none;border-top:2px dashed #cbd5e1;margin:1.5rem 0;" />

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
          <h2 style="font-family:var(--font-heading);font-size:1.4rem;">
            🔍 Revisión Pregunta por Pregunta vs. Marking Key Oficial
          </h2>
          <button type="button" class="btn-secondary" id="btn-reset-volume" style="color:#dc2626;border-color:#fca5a5;">
            🗑️ Reiniciar respuestas de ${getVolData().badge} en blanco
          </button>
        </div>

        ${renderReviewBlock("🎧 Listening · Part 1 (Unir con líneas)", lEval.details.part1, "listening", "part1")}
        ${renderReviewBlock("🎧 Listening · Part 2 (Nombres y números)", lEval.details.part2, "listening", "part2")}
        ${renderReviewBlock("🎧 Listening · Part 3 (Multiple choice A/B/C)", lEval.details.part3, "listening", "part3")}
        ${renderReviewBlock("🎧 Listening · Part 4 (Colorear en la escena)", lEval.details.part4, "listening", "part4")}

        ${renderReviewBlock("✏️ Reading & Writing · Part 1 (Tick ✔ or Cross ✘)", rwEval.details.part1, "rw", "part1")}
        ${renderReviewBlock("✏️ Reading & Writing · Part 2 (Yes / No)", rwEval.details.part2, "rw", "part2")}
        ${renderReviewBlock("✏️ Reading & Writing · Part 3 (Deletreo / Anagramas)", rwEval.details.part3, "rw", "part3")}
        ${renderReviewBlock("✏️ Reading & Writing · Part 4 (Cloze ilustrado)", rwEval.details.part4, "rw", "part4")}
        ${renderReviewBlock("✏️ Reading & Writing · Part 5 (Historieta — 1 palabra)", rwEval.details.part5, "rw", "part5")}
      </section>
    `;

    container.querySelectorAll("[data-goto-mod]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = btn.getAttribute("data-goto-mod");
        const p = btn.getAttribute("data-goto-part");
        navigateTo(m, p);
      });
    });

    document.getElementById("btn-reset-volume")?.addEventListener("click", () => {
      resetVolume(state.currentVol);
    });
  }

  function renderReviewBlock(title, items, mod, part) {
    const okCount = items.filter((i) => i.isCorrect).length;
    return `
      <div class="review-part-block">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem;">
          <strong style="font-family:var(--font-heading);font-size:1.08rem;">${title} — ${okCount}/${items.length} correctas</strong>
          <button type="button" class="btn-chip" data-goto-mod="${mod}" data-goto-part="${part}">
            ✏️ Ver en el cuadernillo →
          </button>
        </div>
        ${items
          .map(
            (it) => `
            <div class="review-item-row">
              <div style="flex:1;">
                <span class="review-badge ${it.isCorrect ? "ok" : "miss"}">
                  ${it.isCorrect ? "✔ Correcto" : "✘ A revisar"}
                </span>
                <strong style="margin-left:0.4rem;">#${it.q}:</strong> ${it.prompt}
                <div style="font-size:0.84rem;color:#475569;margin-top:2px;">
                  💡 ${it.hintEs}
                </div>
              </div>
              <div style="text-align:right;min-width:210px;">
                <div>Tu respuesta: <strong>${it.userAnswer}</strong></div>
                <div style="color:#15803d;font-size:0.85rem;">Marking Key: <strong>${it.correctAnswer}</strong></div>
              </div>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // 11. MODAL DE LOS 20 NOMBRES OFICIALES + DICTADO RÁPIDO
  // --------------------------------------------------------------------------
  function spellNameOutLoud(name) {
    const letters = name.toUpperCase().split("").join(", ");
    speakEnglish(`${name}. ${letters}. ${name}.`, 0.85);
  }

  function openNamesModal() {
    const modal = document.getElementById("names-modal");
    const grid = document.getElementById("official-names-grid");
    if (!modal || !grid) return;

    grid.innerHTML = DATA.officialNames
      .map((name) => {
        const spelled = name.toUpperCase().split("").join("-");
        return `
          <button type="button" class="name-card-btn" data-spell-name="${name}">
            <span>🔊 ${name}</span>
            <span class="name-card-spell">${spelled}</span>
          </button>
        `;
      })
      .join("");

    grid.querySelectorAll("[data-spell-name]").forEach((btn) => {
      btn.addEventListener("click", () => {
        spellNameOutLoud(btn.getAttribute("data-spell-name"));
      });
    });

    modal.classList.remove("hidden");
  }

  function closeNamesModal() {
    document.getElementById("names-modal")?.classList.add("hidden");
  }

  function startSurpriseDictation() {
    const names = DATA.officialNames;
    const chosen = names[Math.floor(Math.random() * names.length)];
    state.dictationTarget = chosen;
    const inp = document.getElementById("input-dictation");
    const fb = document.getElementById("dictation-feedback");
    if (inp) {
      inp.value = "";
      inp.focus();
    }
    if (fb) {
      fb.style.color = "#0369a1";
      fb.textContent = "🎧 Escuchá las letras y escribí el nombre...";
    }
    const letters = chosen.toUpperCase().split("").join(", ");
    speakEnglish(`Listen and spell: ${letters}. Again: ${letters}.`, 0.82);
  }

  function checkSurpriseDictation() {
    const inp = document.getElementById("input-dictation");
    const fb = document.getElementById("dictation-feedback");
    if (!inp || !fb) return;
    if (!state.dictationTarget) {
      fb.style.color = "#b45309";
      fb.textContent = "Primero tocá el botón '🔊 Escuchar nombre sorpresa deletreado'.";
      return;
    }
    const userVal = normalizeText(inp.value);
    const targetVal = normalizeText(state.dictationTarget);
    if (userVal === targetVal) {
      fb.style.color = "#15803d";
      fb.textContent = `✔ ¡Excelente, ${getStudentName()}! Era "${state.dictationTarget}" (${state.dictationTarget.toUpperCase().split("").join("-")}).`;
      speakEnglish(`Great job! ${state.dictationTarget}.`, 0.95);
    } else {
      fb.style.color = "#dc2626";
      fb.textContent = `✘ Casi: escribiste "${inp.value || "(nada)"}", pero era "${state.dictationTarget}" (${state.dictationTarget.toUpperCase().split("").join("-")}). ¡Probá otro!`;
    }
  }

  // --------------------------------------------------------------------------
  // 12. MODAL POPUP DE BIENVENIDA (PREGUNTA EL NOMBRE EN CADA CARGA)
  // --------------------------------------------------------------------------
  function openWelcomeNameModal() {
    const modal = document.getElementById("welcome-name-modal");
    const inp = document.getElementById("input-student-name");
    if (!modal) return;
    modal.classList.remove("hidden");
    if (inp) {
      inp.value = state.studentName || "";
      setTimeout(() => {
        inp.focus();
        inp.select();
      }, 60);
    }
  }

  function handleWelcomeNameSubmit(e) {
    if (e) e.preventDefault();
    const inp = document.getElementById("input-student-name");
    const rawName = inp ? inp.value.trim() : "";
    if (!rawName) {
      inp?.focus();
      return;
    }
    state.studentName = rawName;
    document.getElementById("welcome-name-modal")?.classList.add("hidden");
    updateStudentNameUI();
    renderMain();
  }

  function openHowToModal() {
    document.getElementById("how-to-modal")?.classList.remove("hidden");
  }

  function closeHowToModal() {
    document.getElementById("how-to-modal")?.classList.add("hidden");
  }

  // --------------------------------------------------------------------------
  // 13. INICIALIZACIÓN Y EVENTOS GLOBALES
  // --------------------------------------------------------------------------
  function initApp() {
    loadState();
    updateStudentNameUI();
    renderZiplocToolbar();
    updateTopBadges();
    updateTimerUI();
    renderMain();

    // Siempre preguntar el nombre al cargar index.html (única instancia para ingresar el nombre)
    openWelcomeNameModal();

    document.getElementById("welcome-name-form")?.addEventListener("submit", handleWelcomeNameSubmit);

    // Manual de Procedimientos ("Cómo empezar") para Familias
    document.getElementById("btn-how-to-modal")?.addEventListener("click", openHowToModal);
    document.getElementById("btn-close-how-to-modal")?.addEventListener("click", closeHowToModal);
    document.getElementById("how-to-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "how-to-modal") closeHowToModal();
    });
    document.getElementById("btn-howto-start-vol1")?.addEventListener("click", () => {
      closeHowToModal();
      switchVolume("vol1");
      navigateTo("listening", "part1");
    });
    document.getElementById("btn-howto-start-vol2")?.addEventListener("click", () => {
      closeHowToModal();
      switchVolume("vol2");
      navigateTo("listening", "part1");
    });

    // Botón de marca -> vuelve al inicio
    document.getElementById("btn-home")?.addEventListener("click", () => {
      navigateTo("home");
    });

    // Selector de Volumen (Vol 1 / Vol 2)
    document.querySelectorAll(".vol-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        switchVolume(btn.getAttribute("data-vol"));
      });
    });

    // Pestañas de módulos (1. Listening / 2. R&W / 3. Speaking / Resultados)
    document.querySelectorAll(".mod-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        navigateTo(btn.getAttribute("data-mod"), undefined, true);
      });
    });

    // Popups de inicio de tiempo por punto y tiempo cumplido
    document.getElementById("btn-stage-start")?.addEventListener("click", () => {
      closeStageModals();
      startStageCountdown();
    });
    document.getElementById("btn-stage-timeup-next")?.addEventListener("click", () => {
      advanceToNextEvaluationPoint();
    });

    // Cronómetro
    document.getElementById("btn-timer-toggle")?.addEventListener("click", toggleTimer);
    document.getElementById("btn-timer-reset")?.addEventListener("click", resetTimer);

    // Colapsar / expandir Ziploc
    document.getElementById("btn-toggle-ziploc")?.addEventListener("click", () => {
      state.ziplocCollapsed = !state.ziplocCollapsed;
      renderZiplocToolbar();
    });

    // Modal de 20 nombres oficiales (ubicado al pie de "Cómo empezar")
    document.getElementById("btn-names-modal")?.addEventListener("click", () => {
      closeHowToModal();
      openNamesModal();
    });
    document.getElementById("btn-close-names-modal")?.addEventListener("click", closeNamesModal);
    document.getElementById("names-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "names-modal") closeNamesModal();
    });
    document.getElementById("btn-play-dictation")?.addEventListener("click", startSurpriseDictation);
    document.getElementById("btn-check-dictation")?.addEventListener("click", checkSurpriseDictation);
    document.getElementById("input-dictation")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkSurpriseDictation();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
