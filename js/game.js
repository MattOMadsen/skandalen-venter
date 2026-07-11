/* Skandalen venter — fuld spil-loop */

(function () {
  const $ = (id) => document.getElementById(id);

  const screens = {
    start: $("screen-start"),
    select: $("screen-select"),
    game: $("screen-game"),
    end: $("screen-end"),
  };

  let state = null;
  let selectedId = null;
  let pressSession = null;

  function show(name) {
    Object.values(screens).forEach((el) => el.classList.remove("active"));
    screens[name].classList.add("active");
  }

  function phaseForWeek(week) {
    return (
      PHASES.find((p) => week >= p.weeks[0] && week <= p.weeks[1]) ||
      PHASES[PHASES.length - 1]
    );
  }

  // —— UI feedback ——
  function toast(msg, kind = "warn") {
    const root = $("toast-root");
    const el = document.createElement("div");
    el.className = "toast " + kind;
    el.textContent = msg;
    root.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function floatDeltas(beforeM, afterM, beforeR, afterR) {
    const root = $("float-root");
    const labels = { magt: "Magt", kasse: "Kasse", image: "Image", mistanke: "Mistanke" };
    let i = 0;
    ["magt", "kasse", "image", "mistanke"].forEach((k) => {
      const d = afterM[k] - beforeM[k];
      if (!d) return;
      spawnFloat(
        `${labels[k]} ${d > 0 ? "+" : ""}${d}`,
        k === "mistanke" ? d > 0 : d < 0,
        i++
      );
    });
    if (beforeR && afterR) {
      REL_KEYS.forEach((k) => {
        const d = afterR[k] - beforeR[k];
        if (!d || Math.abs(d) < 3) return;
        spawnFloat(
          `${REL_META[k].emoji} ${d > 0 ? "+" : ""}${d}`,
          d < 0,
          i++
        );
      });
    }
    function spawnFloat(text, bad, idx) {
      const el = document.createElement("div");
      el.className = "float-delta " + (bad ? "neg" : "pos");
      el.textContent = text;
      el.style.left = 18 + Math.random() * 55 + "%";
      el.style.top = 32 + idx * 7 + "%";
      root.appendChild(el);
      setTimeout(() => el.remove(), 1100);
    }
  }

  function snapshot() {
    return {
      meters: { ...state.meters },
      rel: { ...state.rel },
    };
  }

  function afterChange(before) {
    floatDeltas(before.meters, state.meters, before.rel, state.rel);
    renderAllStatus();
    warnCritical(before);
  }

  function warnCritical(before) {
    REL_KEYS.forEach((k) => {
      const v = state.rel[k];
      const prev = before.rel[k];
      if (v <= 15 && prev > 15) {
        toast(`${REL_META[k].emoji} ${REL_META[k].label} er kritisk lav!`, "bad");
      } else if (v >= 90 && prev < 90) {
        toast(`${REL_META[k].emoji} ${REL_META[k].label} er farligt høj!`, "bad");
      }
    });
    if (state.meters.mistanke >= 85 && before.meters.mistanke < 85) {
      toast("🚨 Mistanken er kritisk!", "bad");
    }
  }

  function renderAllStatus() {
    renderMeters();
    renderRels();
    updateHeat();
    renderEvidence();
    renderDebts();
    renderMoodLine();
  }

  function updateHeat() {
    const s = state.meters.mistanke;
    const fill = $("heat-fill");
    if (!fill) return;
    const wrap = fill.closest(".heat-wrap");
    fill.style.width = s + "%";
    let band = "low";
    if (s >= 80) band = "max";
    else if (s >= 55) band = "high";
    else if (s >= 30) band = "mid";
    $("heat-quip").textContent = pick(TENSION_QUIPS[band]);
    wrap.classList.toggle("hot", s >= 70);
    document.body.classList.toggle("critical-heat", s >= 85);
  }

  function renderMeters() {
    const m = state.meters;
    const rows = [
      ["magt", "⚡ Magt", m.magt],
      ["kasse", "💰 Kasse", m.kasse],
      ["image", "✨ Image", m.image],
      ["mistanke", "🕵️ Mistanke", m.mistanke],
    ];
    $("meters").innerHTML = rows
      .map(
        ([cls, label, val]) => `
      <div class="meter ${cls}${cls === "mistanke" && val >= 70 ? " danger" : ""}">
        <span class="m-label">${label}</span>
        <span class="m-val">${val}</span>
        <div class="bar"><div class="fill" style="width:${val}%"></div></div>
      </div>`
      )
      .join("");
  }

  function renderRels() {
    const el = $("rel-bars");
    if (!el) return;
    el.innerHTML = REL_KEYS.map((k) => {
      const v = state.rel[k];
      const meta = REL_META[k];
      const danger = v <= 20 || v >= 85 ? " danger" : "";
      return `
        <div class="rel-item${danger}" title="${meta.low} / ${meta.high}">
          <span class="rel-top">${meta.emoji} ${meta.label} ${relFace(v)}</span>
          <div class="rel-bar"><div class="rel-fill rel-${k}" style="width:${v}%"></div></div>
          <span class="rel-num">${v}</span>
        </div>`;
    }).join("");
  }

  function renderMoodLine() {
    const el = $("mood-line");
    if (!el) return;
    el.innerHTML = REL_KEYS.map(
      (k) =>
        `<span class="mood-chip">${REL_META[k].emoji} ${relFace(state.rel[k])}</span>`
    ).join("");
  }

  function renderEvidence() {
    const n = state.evidence.length;
    const el = $("evidence-bar");
    el.classList.toggle("has-proof", n > 0);
    el.textContent = n === 0 ? "🗂️ Beviser: 0" : `🗂️ Beviser: ${n}`;
  }

  function renderDebts() {
    const el = $("debt-bar");
    if (!state.debts.length) {
      el.classList.add("hidden");
      return;
    }
    el.classList.remove("hidden");
    el.textContent = `🔗 Gæld: ${state.debts.length}`;
    el.title = state.debts.map((d) => `${d.label} (uge ${d.due})`).join(" · ");
  }

  function focusPlayPanel(id) {
    const el = $(id);
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function hidePlayPanels() {
    ["panel-actions", "panel-event", "panel-week-end", "panel-press", "panel-episode"].forEach(
      (id) => {
        const el = $(id);
        if (el) el.classList.add("hidden");
      }
    );
  }

  // —— Start / select ——
  function renderHeroPortraits() {
    $("hero-portraits").innerHTML = CHARACTERS.map(
      (c) => `<img src="${c.img}" alt="${c.name}" title="${c.name}" />`
    ).join("");
  }
  renderHeroPortraits();

  $("btn-to-select").addEventListener("click", () => {
    renderCharacterGrid();
    show("select");
  });
  $("btn-back-start").addEventListener("click", () => show("start"));

  function renderCharacterGrid() {
    const grid = $("character-grid");
    grid.innerHTML = "";
    CHARACTERS.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "char-card" + (selectedId === c.id ? " selected" : "");
      btn.innerHTML = `
        <img class="thumb" src="${c.img}" alt="" />
        <span class="body">
          <span class="animal">${c.emoji} ${c.animal}</span>
          <span class="name">${c.name}</span>
          <span class="blurb">${c.blurb}</span>
        </span>`;
      btn.addEventListener("click", () => {
        selectedId = c.id;
        renderCharacterGrid();
        renderDetail(c);
      });
      grid.appendChild(btn);
    });
  }

  function renderDetail(c) {
    const el = $("character-detail");
    el.classList.remove("hidden");
    el.innerHTML = `
      <div class="detail-layout">
        <img class="detail-portrait" src="${c.img}" alt="${c.name}" />
        <div>
          <span class="animal" style="color:var(--accent);font-weight:800;font-size:0.75rem;letter-spacing:0.06em;text-transform:uppercase">
            ${c.emoji} ${c.animal} · ${c.arch}
          </span>
          <strong style="display:block;font-size:1.2rem;margin-top:0.25rem">${c.name}</strong>
          <p class="catch">“${c.catchphrase}”</p>
          <div class="stat-row">
            <span>Magt<strong>${c.start.magt}</strong></span>
            <span>Kasse<strong>${c.start.kasse}</strong></span>
            <span>Image<strong>${c.start.image}</strong></span>
            <span>Mistanke<strong>${c.start.mistanke}</strong></span>
          </div>
          <p class="muted" style="font-size:0.8rem;margin:0.5rem 0">
            Start-relationer: Parti ${c.startRel.parti} · Presse ${c.startRel.presse} ·
            Vælgere ${c.startRel.vaelgere} · Lobby ${c.startRel.lobby}
          </p>
          <p class="muted"><strong>Styrke:</strong> ${c.strength}</p>
          <p class="muted"><strong>Svaghed:</strong> ${c.weakness}</p>
          <button type="button" class="btn primary big" id="btn-start-game" style="margin-top:0.85rem">
            Start som ${c.emoji} ${c.name.split(" ")[0]}
          </button>
        </div>
      </div>`;
    $("btn-start-game").addEventListener("click", () => startGame(c));
  }

  function startGame(char) {
    state = {
      char,
      week: 1,
      meters: { ...char.start },
      rel: { ...char.startRel },
      evidence: [],
      debts: [],
      flags: {},
      log: [],
      actionsThisWeek: 0,
      maxActions: 2,
      weekType: WEEK_TYPES.normal,
      weekNotes: [],
      history: [],
      comboSneaky: 0,
      refusedTemptationTotal: 0,
    };
    for (let i = 0; i < (char.startEvidence || 0); i++) {
      addEvidence(state, "Gammelt spor fra ‘før din tid’");
    }
    $("char-portrait").src = char.img;
    $("char-portrait").alt = char.name;
    document.body.classList.remove("critical-heat");
    toast(`${char.emoji} Velkommen — hold relationerne i live!`, "good");
    show("game");
    beginWeek();
  }

  // —— Week types ——
  function pickWeekType() {
    if (state.week === 8) return WEEK_TYPES.normal;
    const r = Math.random();
    const late = state.week >= 18;
    if (late) {
      if (r < 0.35) return WEEK_TYPES.crisis;
      if (r < 0.55) return WEEK_TYPES.temptation;
      if (r < 0.7) return WEEK_TYPES.quiet;
      return WEEK_TYPES.normal;
    }
    if (state.week <= 3) {
      if (r < 0.25) return WEEK_TYPES.quiet;
      if (r < 0.4) return WEEK_TYPES.temptation;
      return WEEK_TYPES.normal;
    }
    if (r < 0.18) return WEEK_TYPES.crisis;
    if (r < 0.38) return WEEK_TYPES.temptation;
    if (r < 0.55) return WEEK_TYPES.quiet;
    return WEEK_TYPES.normal;
  }

  function beginWeek() {
    state.actionsThisWeek = 0;
    state.weekNotes = [];
    state.comboSneaky = 0;
    state.episodeDone = false;
    pressSession = null;

    const phase = phaseForWeek(state.week);
    state.weekType = pickWeekType();
    // Episode-first: max 1 ekstra træk efter historien
    state.maxActions = 1;

    $("phase-label").textContent = `${phase.name}`;
    $("week-label").textContent = `Uge ${state.week} / ${TOTAL_WEEKS}`;
    $("char-name-chip").textContent = `${state.char.emoji} ${state.char.name}`;

    if (state.week === 24) {
      finishCampaign(true);
      return;
    }

    // Valgaften som særlig episode-uge
    if (state.week === 8) {
      const hl = valgaftenHeadline();
      $("headline-text").textContent = hl;
      flashHeadline(false);
      renderAllStatus();
      endWeekSummary();
      return;
    }

    passiveDrift();
    renderAllStatus();

    if (state.week === 4) toast("🏁 Valgkamp!", "warn");
    if (state.week === 9) toast("🏛️ Regeringspoker", "warn");
    if (state.week === 6) toast("🎙️ Boss-uge: Pressemøde!", "warn");
    if (state.week === 12) toast("⚖️ Boss-uge: Kommissionen!", "bad");
    if (state.week === 18) toast("🗳️ Boss-uge: Midtvejs!", "warn");

    // Gæld / gamle beviser kan afbryde — men ellers altid episode først
    const due = state.debts.filter((d) => d.due <= state.week);
    if (due.length && Math.random() < 0.55) {
      showDebtEvent(due[0]);
      return;
    }

    startEpisodeWeek();
  }

  function flashHeadline(crisis) {
    const box = $("headline-box");
    box.classList.remove("flash");
    void box.offsetWidth;
    box.classList.add("flash");
    box.classList.toggle("crisis", !!crisis);
  }

  function startEpisodeWeek() {
    const ep = pickEpisodeForWeek(state);
    state.currentEpisode = ep;

    // Track recent
    state.flags.recentEpisodes = state.flags.recentEpisodes || [];
    state.flags.recentEpisodes.push(ep.id);
    if (state.flags.recentEpisodes.length > 5) state.flags.recentEpisodes.shift();

    const hl = (ep.headline || ep.title).replace(/\{navn\}/g, state.char.name);
    $("headline-text").textContent = hl;
    flashHeadline(!!ep.boss);

    if (ep.isPressBoss) {
      // Boss pressemøde = mini-spil direkte
      toast("🎙️ LIVE pressemøde!", "warn");
      const fakeAction = { id: "press_konf", name: ep.title };
      startPressGame(fakeAction);
      return;
    }

    showEpisode(ep);
  }

  function showEpisode(ep) {
    hidePlayPanels();
    const panel = $("panel-episode");
    panel.classList.remove("hidden");
    panel.classList.toggle("boss", !!ep.boss);
    focusPlayPanel("panel-episode");

    $("episode-badge").textContent = ep.boss
      ? `⚔️ BOSS · UGE ${state.week}`
      : `${ep.emoji || "📖"} EPISODE`;
    $("week-type-pill").textContent = ep.boss ? "Boss-uge" : "Historie";
    $("week-type-pill").className = "pill week-type " + (ep.boss ? "crisis" : "normal");
    $("episode-npc").textContent = ep.npc ? `👤 ${ep.npc}` : "";
    $("episode-title").textContent = ep.title;
    $("episode-text").textContent = ep.text;
    $("episode-reply").classList.add("hidden");
    $("episode-reply").textContent = "";

    const box = $("episode-choices");
    box.innerHTML = "";
    (ep.choices || []).forEach((ch, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "action-btn" + (ch.temptation ? " temptation" : "");
      btn.innerHTML = `
        <span class="ico">${["🅰️", "🅱️", "©️"][idx] || "•"}</span>
        <span class="title">${ch.temptation ? "⚠️ " : ""}${ch.label}</span>`;
      btn.addEventListener("click", () => resolveEpisodeChoice(ep, ch, btn));
      box.appendChild(btn);
    });
  }

  function resolveEpisodeChoice(ep, ch) {
    // Disable further clicks
    $("episode-choices")
      .querySelectorAll("button")
      .forEach((b) => {
        b.disabled = true;
      });

    const before = snapshot();
    let note = ch.note || "";
    let replyObj = ch.reply;

    // requireKasse fail path
    if (ch.requireKasse && state.meters.kasse < ch.requireKasse) {
      add(state, ch.failEffect || { mistanke: 8 });
      addRel(state, ch.failRel || {});
      if (ch.failReveal) revealEvidence(state);
      note = ch.failNote || note;
    } else if (ch.coinflip) {
      const win = Math.random() < (ch.coinflip.chance ?? 0.5);
      const branch = win ? ch.coinflip.win : ch.coinflip.lose;
      add(state, branch.effect || {});
      addRel(state, branch.rel || {});
      note = branch.note || note;
      replyObj = branch.reply || replyObj;
    } else {
      add(state, ch.effect || {});
      addRel(state, ch.rel || {});
    }

    if (ch.evidence) {
      if (ch.evidenceChance == null || Math.random() < ch.evidenceChance) {
        addEvidence(state, ch.evidence);
      }
    }
    if (ch.clearOneEvidence && state.evidence.length) {
      state.evidence.pop();
    }
    if (ch.debt) {
      state.debts.push({
        label: ch.debt.label,
        due: state.week + (ch.debt.dueAdd || 3),
      });
    }
    if (ch.setFlag === "tookTemptation") {
      state.flags.tookTemptation = true;
      state.flags.temptationCount = (state.flags.temptationCount || 0) + 1;
    }
    if (ch.setFlag === "refusedTemptation") {
      state.flags.refusedTemptation = (state.flags.refusedTemptation || 0) + 1;
    }
    if (ch.setFlag === "staffLoyal") state.flags.staffLoyal = true;
    if (ch.flagStorm) state.flags.stormNext = true;
    if (ch.temptation) toast("⚠️ Fristelse", "warn");

    const reply = resolveReply(replyObj, state.char.id);
    if (reply) {
      $("episode-reply").textContent = reply;
      $("episode-reply").classList.remove("hidden");
      state.weekNotes.push(reply);
    }
    if (note) state.weekNotes.push(note);

    state.history.push({
      week: state.week,
      kind: "episode",
      name: ep.title,
      msg: note || reply || ch.label,
    });
    state.episodeDone = true;

    afterChange(before);

    if (checkAnyLose()) return;

    // Kun episodens 3 valg — ingen ekstra handlings-menu (mindre støj)
    setTimeout(() => {
      if (checkAnyLose()) return;
      endWeekSummary();
    }, 650);
  }

  /** Beholdt til pressemøde / særlige flows — max 2 knapper */
  function showLimitedActions() {
    state.actionsThisWeek = 0;
    state.maxActions = 1;
    hidePlayPanels();
    $("panel-actions").classList.remove("hidden");
    focusPlayPanel("panel-actions");
    $("actions-left").textContent = "Vælg 1";
    $("week-hint").textContent = "Kun ét valg — hold det simpelt.";

    // Kun 2 tydelige retninger: ro vs risiko
    const ids = ["lav_profil", Math.random() < 0.5 ? "tale" : "ryd_op"];
    if (state.char.uniqueAction && Math.random() < 0.4) {
      ids[1] = state.char.uniqueAction;
    }

    const list = $("actions-list");
    list.innerHTML = "";
    ids.forEach((id) => {
      const a = ACTIONS[id];
      if (!a) return;
      const btn = document.createElement("button");
      btn.type = "button";
      const locked = a.require && !a.require(state);
      btn.disabled = locked;
      btn.className = "action-btn" + (a.unique ? " unique" : "");
      const ico = ACTION_ICONS[id] || "•";
      btn.innerHTML = `
        <span class="ico">${ico}</span>
        <span class="title">${a.name}${a.unique ? " ★" : ""}</span>
        <div class="tags">${a.tags || ""}</div>`;
      btn.addEventListener("click", () => doAction(a));
      list.appendChild(btn);
    });
  }

  function passiveDrift() {
    // Hvis image er lav, vælgere falder stille
    if (state.meters.image < 25) addRel(state, { vaelgere: -2 });
    if (state.meters.mistanke > 70) addRel(state, { presse: -2, vaelgere: -1 });
  }

  function valgaftenHeadline() {
    const score =
      state.meters.image * 0.4 +
      state.meters.magt * 0.25 +
      state.rel.vaelgere * 0.35 -
      state.meters.mistanke * 0.35;
    if (score > 55) {
      add(state, { magt: 10, image: 5 });
      addRel(state, { vaelgere: 8, parti: 6 });
      state.weekNotes.push("🎉 Valgsejr — mandat i hus.");
      toast("Valgsejr!", "good");
      return "Valgaften: Fremgang! Folket (næsten) elsker dig.";
    }
    if (score > 35) {
      add(state, { magt: 4 });
      addRel(state, { vaelgere: 2 });
      state.weekNotes.push("Valget var… acceptabelt.");
      return "Valgaften: Status quo med svedige håndtryk.";
    }
    add(state, { magt: -6, image: -4 });
    addRel(state, { vaelgere: -10, parti: -6 });
    state.weekNotes.push("📉 Valgnederlag — stolen er ikke tom endnu.");
    toast("Valget gjorde ondt", "bad");
    return "Valgaften: Bagsmæk og undskyldende opslag.";
  }

  // —— Actions ——
  function showActions() {
    hidePlayPanels();
    $("panel-actions").classList.remove("hidden");
    focusPlayPanel("panel-actions");

    const left = state.maxActions - state.actionsThisWeek;
    $("actions-left").textContent =
      left === 1 ? "1 valg tilbage" : `${left} valg tilbage`;
    $("week-hint").textContent = state.weekType.hint;

    let ids = [...COMMON_ACTION_IDS];
    if (state.char.uniqueAction) ids.unshift(state.char.uniqueAction);

    // Fristelses-uger: vis 2 fristelser
    if (state.weekType.showTemptation || state.week >= 12) {
      const temps = [...TEMPTATION_IDS].sort(() => Math.random() - 0.5).slice(0, 2);
      ids = [...temps, ...ids];
    }

    // Shuffle men hold unik/fristelse øverst
    if (state.week >= 8) {
      const special = ids.filter((id) => ACTIONS[id]?.unique || ACTIONS[id]?.temptation);
      const rest = ids.filter((id) => !special.includes(id));
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      ids = [...special, ...rest];
    }

    // Dedup
    ids = [...new Set(ids)];

    // Krise: færre valg
    if (state.weekType.id === "crisis") {
      ids = ids.slice(0, 7);
    }
    if (state.weekType.id === "quiet") {
      ids = ids.filter((id) => !ACTIONS[id]?.temptation).slice(0, 8);
      if (!ids.includes("lav_profil")) ids.unshift("lav_profil");
    }

    const list = $("actions-list");
    list.innerHTML = "";
    ids.forEach((id) => {
      const a = ACTIONS[id];
      if (!a) return;
      if (a.unique && state.char.uniqueAction !== id) return;

      const btn = document.createElement("button");
      btn.type = "button";
      const locked = a.require && !a.require(state);
      btn.disabled = locked || left <= 0;
      btn.className =
        "action-btn" +
        (a.unique ? " unique" : "") +
        (a.temptation ? " temptation" : "") +
        (a.fuzzy ? " fuzzy" : "");
      const ico = ACTION_ICONS[id] || "•";
      const tagText = a.fuzzy ? "???" : a.tags || "";
      btn.innerHTML = `
        <span class="ico">${ico}</span>
        <span class="title">${a.temptation ? "⚠️ " : ""}${a.name}${a.unique ? " ★" : ""}</span>
        <div class="tags">${tagText}${locked && a.requireText ? " · " + a.requireText : ""}</div>`;
      btn.addEventListener("click", () => doAction(a));
      list.appendChild(btn);
    });
  }

  function doAction(action) {
    if (state.actionsThisWeek >= state.maxActions) return;
    if (action.require && !action.require(state)) return;

    if (action.isPressGame) {
      startPressGame(action);
      return;
    }

    const before = snapshot();
    const msg = action.run(state);
    if (msg === "PRESS_GAME") {
      startPressGame(action);
      return;
    }

    state.actionsThisWeek += 1;
    state.weekNotes.push(msg);
    state.history.push({ week: state.week, kind: "action", name: action.name, msg });

    if (action.temptation) {
      toast("⚠️ Fristelse taget", "warn");
    }

    // Combo snyd
    const sneaky = ["bilag", "middag", "job_ven", "kuvert", "hemmelig_fond", "slet_mapper"].includes(
      action.id
    );
    if (sneaky) {
      state.comboSneaky = (state.comboSneaky || 0) + 1;
      if (state.comboSneaky >= 2) {
        add(state, { mistanke: 5 });
        addRel(state, { presse: -4 });
        state.weekNotes.push("😏 Dobbelt-fif — nogen lagde mærke til det.");
        toast("Dobbelt-fif! Ekstra pres", "warn");
        state.comboSneaky = 0;
      }
    } else {
      state.comboSneaky = 0;
    }

    if (action.id === "lav_profil" || action.id === "ryd_op") {
      state.flags.cleanWeeks = (state.flags.cleanWeeks || 0) + (action.id === "lav_profil" ? 1 : 0);
    }

    // Karakter-replik lejlighedsvis
    if (Math.random() < 0.4 && typeof CHAR_QUIPS !== "undefined") {
      const quips = CHAR_QUIPS[state.char.id];
      if (quips) {
        const q = pick(quips);
        state.weekNotes.push(q);
        toast(q.slice(0, 48) + (q.length > 48 ? "…" : ""), "warn");
      }
    }

    afterChange(before);
    if (checkAnyLose()) return;

    // Efter ekstra-træk: facit (episode er allerede spillet)
    afterActions();
  }

  $("btn-skip-week").addEventListener("click", () => {
    if (state.actionsThisWeek === 0 && state.episodeDone) {
      state.weekNotes.push("Du skipper ekstra-trækket. Videre i historien.");
    }
    afterActions();
  });

  function afterActions() {
    // Sjælden ekstra-krise (historien er allerede episode)
    if (Math.random() < 0.12 && state.meters.mistanke >= 55) {
      const ev = pickEvent();
      if (ev) {
        toast("⚡ Ekstra krise!", "bad");
        showEvent(ev);
        return;
      }
    }
    if (Math.random() < 0.18) {
      state.weekNotes.push(
        pick([
          "En journalist ringede — du “var i møde”.",
          "Parti-chatten var stille. For stille.",
          "Du tjekkede bilagene. To gange.",
        ])
      );
    }
    endWeekSummary();
  }

  function pickEvent() {
    const pool = EVENTS.filter((e) => {
      if (e.minWeek && state.week < e.minWeek) return false;
      if (e.onlyIf && !e.onlyIf(state)) return false;
      return true;
    });
    if (!pool.length) return null;
    const total = pool.reduce((s, e) => s + (e.weight || 1), 0);
    let r = Math.random() * total;
    for (const e of pool) {
      r -= e.weight || 1;
      if (r <= 0) return e;
    }
    return pool[pool.length - 1];
  }

  function showEvent(ev) {
    hidePlayPanels();
    $("panel-event").classList.remove("hidden");
    focusPlayPanel("panel-event");
    $("event-title").textContent = ev.title;
    $("event-text").textContent = ev.text;
    const box = $("event-choices");
    box.innerHTML = "";
    ev.choices.forEach((ch, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "action-btn" + (ch.label.includes("⚠️") ? " temptation" : "");
      btn.innerHTML = `
        <span class="ico">${["🅰️", "🅱️", "©️"][idx] || "•"}</span>
        <span class="title">${ch.label}</span>`;
      btn.addEventListener("click", () => {
        const before = snapshot();
        const msg = ch.run(state);
        state.weekNotes.push(msg);
        state.history.push({ week: state.week, kind: "event", name: ev.title, msg });
        afterChange(before);
        if (checkAnyLose()) return;
        if (!state.episodeDone) {
          startEpisodeWeek();
        } else {
          endWeekSummary();
        }
      });
      box.appendChild(btn);
    });
  }

  function showDebtEvent(debt) {
    hidePlayPanels();
    $("panel-event").classList.remove("hidden");
    focusPlayPanel("panel-event");
    $("event-title").textContent = "🔗 En gammel tjeneste forfalder";
    $("event-text").textContent = debt.label + " — de ringer.";
    const box = $("event-choices");
    box.innerHTML = "";
    [
      {
        label: "Betal (magt & kasse)",
        ico: "💰",
        run() {
          add(state, { magt: -6, kasse: -8, mistanke: -3 });
          addRel(state, { lobby: 6, parti: 2 });
          state.debts = state.debts.filter((d) => d !== debt);
          return "Gælden er betalt. Smilets pris var overpris.";
        },
      },
      {
        label: "Afvis",
        ico: "🙅",
        run() {
          add(state, { image: -8, mistanke: 8 });
          addRel(state, { lobby: -14, presse: -6, vaelgere: -4 });
          state.debts = state.debts.filter((d) => d !== debt);
          if (Math.random() < 0.5) revealEvidence(state);
          return "Du sagde nej. De sagde ‘se her’ til pressen.";
        },
      },
      {
        label: "⚠️ Snyd dig ud",
        ico: "🦊",
        run() {
          add(state, { mistanke: 10, magt: 2 });
          addRel(state, { lobby: -8, presse: -4 });
          state.debts = state.debts.filter((d) => d !== debt);
          addEvidence(state, "Brudt aftale / tomme løfter");
          state.flags.tookTemptation = true;
          return "Du snød dig fri. Friheden er midlertidig.";
        },
      },
    ].forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "action-btn" + (ch.label.includes("⚠️") ? " temptation" : "");
      btn.innerHTML = `<span class="ico">${ch.ico}</span><span class="title">${ch.label}</span>`;
      btn.addEventListener("click", () => {
        const before = snapshot();
        state.weekNotes.push(ch.run());
        afterChange(before);
        if (checkAnyLose()) return;
        if (!state.episodeDone) startEpisodeWeek();
        else endWeekSummary();
      });
      box.appendChild(btn);
    });
  }

  function showEvidenceEvent() {
    hidePlayPanels();
    $("panel-event").classList.remove("hidden");
    focusPlayPanel("panel-event");
    $("event-title").textContent = "📂 Gammelt bevis dukker op";
    $("event-text").textContent =
      "Holm smiler uden glæde. “Aktindsigt. Eller en intern. Eller begge.”";
    const box = $("event-choices");
    box.innerHTML = "";
    [
      {
        label: "Konfronter sandheden",
        ico: "🫡",
        run() {
          revealEvidence(state);
          add(state, { image: 2 });
          addRel(state, { presse: 2, vaelgere: 2 });
          return "Du tog den på hagen. Næsten klædende.";
        },
      },
      {
        label: "Spin & tåge",
        ico: "🌫️",
        run() {
          revealEvidence(state);
          add(state, { mistanke: 4 });
          addRel(state, { presse: -4, vaelgere: -2 });
          return "Tåge på tåge. Vælgerne hostede.";
        },
      },
      {
        label: "Angrib budbringeren",
        ico: "🥊",
        run() {
          revealEvidence(state);
          add(state, { image: -6, magt: 3 });
          addRel(state, { presse: -10, vaelgere: -4 });
          return "Budbringeren faldt. Beviset overlevede.";
        },
      },
    ].forEach((ch) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "action-btn";
      btn.innerHTML = `<span class="ico">${ch.ico}</span><span class="title">${ch.label}</span>`;
      btn.addEventListener("click", () => {
        const before = snapshot();
        state.weekNotes.push(ch.run());
        afterChange(before);
        if (checkAnyLose()) return;
        if (!state.episodeDone) startEpisodeWeek();
        else endWeekSummary();
      });
      box.appendChild(btn);
    });
  }

  // —— Pressemøde minispil ——
  function startPressGame(action) {
    const qs = [...PRESS_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 3);
    pressSession = {
      action,
      questions: qs,
      index: 0,
      score: 0,
      notes: [],
    };
    state.actionsThisWeek += 1;
    showPressQuestion();
  }

  function showPressQuestion() {
    hidePlayPanels();
    $("panel-press").classList.remove("hidden");
    focusPlayPanel("panel-press");
    const ps = pressSession;
    const q = ps.questions[ps.index];
    $("press-progress").textContent = `Spørgsmål ${ps.index + 1} / ${ps.questions.length}`;
    $("press-question").textContent = q.q;
    $("press-choices").innerHTML = "";

    [
      { key: "a", data: q.a },
      { key: "b", data: q.b },
    ].forEach(({ data }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "action-btn";
      btn.innerHTML = `<span class="ico">🎤</span><span class="title">${data.label}</span>`;
      btn.addEventListener("click", () => answerPress(data));
      $("press-choices").appendChild(btn);
    });
  }

  function answerPress(choice) {
    const before = snapshot();
    add(state, choice.effect || {});
    addRel(state, choice.rel || {});
    pressSession.notes.push(choice.label);
    // score: image up good, mistanke up bad
    const img = choice.effect?.image || 0;
    const mis = choice.effect?.mistanke || 0;
    pressSession.score += img - mis;
    afterChange(before);

    pressSession.index += 1;
    if (pressSession.index >= pressSession.questions.length) {
      finishPressGame();
    } else {
      showPressQuestion();
    }
  }

  function finishPressGame() {
    const ps = pressSession;
    let msg;
    if (ps.score >= 8) {
      add(state, { image: 6, mistanke: -3 });
      addRel(state, { presse: 8, vaelgere: 4 });
      msg = "📺 Pressemødet: Du ejede lokalet. Holm nikkede næsten.";
      toast("Stærkt pressemøde!", "good");
    } else if (ps.score >= 0) {
      addRel(state, { presse: 2 });
      msg = "📺 Pressemødet: Overlevet. Svedigt, men stående.";
    } else {
      add(state, { image: -4, mistanke: 6 });
      addRel(state, { presse: -8, vaelgere: -4 });
      msg = "📺 Pressemødet: Svejsen sprang. Det bliver i aftenens klip.";
      toast("Pressemøde floppede", "bad");
    }
    state.weekNotes.push(msg);
    state.history.push({
      week: state.week,
      kind: "action",
      name: ps.action.name,
      msg,
    });
    state.flags.pressGames = (state.flags.pressGames || 0) + 1;
    state.episodeDone = true;
    pressSession = null;
    renderAllStatus();
    if (checkAnyLose()) return;
    // Altid direkte til facit — undgå ekstra valg-menu
    endWeekSummary();
  }

  // —— Week end / lose ——
  function endWeekSummary() {
    if (checkAnyLose()) return;

    renderAllStatus();
    hidePlayPanels();
    $("panel-week-end").classList.remove("hidden");
    focusPlayPanel("panel-week-end");

    const notes = state.weekNotes.length
      ? state.weekNotes.map((n) => "• " + n).join("\n")
      : "• En stille uge i magtens maskinrum.";
    const mood =
      "\n\nRelationer: " +
      REL_KEYS.map((k) => `${REL_META[k].emoji}${relFace(state.rel[k])}`).join(" ");
    $("week-summary").textContent = notes + mood;

    if (state.meters.mistanke > 70) {
      const before = snapshot();
      add(state, { image: -2 });
      addRel(state, { vaelgere: -2 });
      afterChange(before);
    }
  }

  $("btn-next-week").addEventListener("click", () => {
    state.week += 1;
    if (state.week > TOTAL_WEEKS) {
      finishCampaign(true);
      return;
    }
    beginWeek();
  });

  function checkAnyLose() {
    if (state.meters.mistanke >= 100) {
      if (state.char.traits.softLanding && !state.flags.usedLife) {
        state.flags.usedLife = true;
        state.meters.mistanke = 78;
        add(state, { magt: -10, image: -8 });
        addRel(state, { parti: -6, presse: -4 });
        state.weekNotes.push("🐷 Du landede på benene. Igen.");
        toast("Ni liv (gris-version)!", "good");
        renderAllStatus();
        return false;
      }
      finishCampaign(false, "scandal");
      return true;
    }

    const collapse = checkRelCollapse(state);
    if (collapse) {
      state.flags.relDeath = collapse;
      finishCampaign(false, "rel");
      return true;
    }

    const annoy = state.flags.partyAnnoy || 0;
    const shield = state.char.traits.partyShield ? 2 : 0;
    if (annoy >= 5 + shield && state.meters.image < 35 && state.rel.parti < 35) {
      finishCampaign(false, "party");
      return true;
    }
    return false;
  }

  // —— End ——
  function finishCampaign(won, reason) {
    state.survived = won;
    state.endReason = reason || (won ? "win" : "scandal");
    document.body.classList.remove("critical-heat");

    let kind = state.endReason;
    if (won && state.meters.magt >= 75 && state.meters.image >= 50 && state.rel.vaelgere >= 50) {
      kind = "pm";
    } else if (won) {
      kind = "win";
    }

    let headline;
    if (kind === "rel" && state.flags.relDeath) {
      headline = pick(END_HEADLINES.rel)
        .replace(/\{navn\}/g, state.char.name)
        .replace(/\{årsag\}/g, state.flags.relDeath.reason)
        .replace(/\{uger\}/g, String(state.week));
    } else {
      headline = pick(END_HEADLINES[kind] || END_HEADLINES.scandal)
        .replace(/\{navn\}/g, state.char.name)
        .replace(/\{uger\}/g, String(state.week));
    }

    const score = computeScore(won);
    const grade = scoreGrade(score, won);
    const rank = rankTitle(won, kind, state);
    const epitaph = pickEpitaph(won, kind, state);
    const achievements = collectAchievements(won, state);
    const highlights = collectHighlights(state);

    show("end");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const card = $("end-card");
    card.classList.toggle("won", won);
    card.classList.toggle("lost", !won);

    $("end-portrait").src = state.char.img;
    $("end-portrait").alt = state.char.name;
    $("end-eyebrow").textContent = won ? "🏆 Kampagne slut" : "💥 Exit";
    $("end-title").textContent = won ? "Du overlevede perioden" : "Du faldt";
    $("end-rank").textContent = `${grade.emoji} ${rank} · Karakter ${grade.letter}`;
    $("end-headline").textContent = headline;
    $("end-epitaph").textContent = epitaph;

    $("end-stats").innerHTML = `
      <div><span class="label">Score</span><span class="val">${score}</span></div>
      <div><span class="label">Karakter</span><span class="val">${grade.letter}</span></div>
      <div><span class="label">Uger</span><span class="val">${state.week}/${TOTAL_WEEKS}</span></div>
      <div><span class="label">Handlinger</span><span class="val">${state.history.filter((h) => h.kind === "action").length}</span></div>
      <div><span class="label">Kriser</span><span class="val">${state.history.filter((h) => h.kind === "event").length}</span></div>
      <div><span class="label">Beviser</span><span class="val">${state.evidence.length}</span></div>`;

    const m = state.meters;
    $("end-meters").innerHTML = [
      ["magt", "⚡ Magt", m.magt],
      ["kasse", "💰 Kasse", m.kasse],
      ["image", "✨ Image", m.image],
      ["mistanke", "🕵️ Mistanke", m.mistanke],
      ...REL_KEYS.map((k) => ["rel", `${REL_META[k].emoji} ${REL_META[k].label}`, state.rel[k]]),
    ]
      .map(
        ([cls, label, val]) => `
      <div class="meter ${cls}">
        <span class="m-label">${label}</span>
        <span class="m-val">${val}</span>
        <div class="bar"><div class="fill" style="width:${val}%"></div></div>
      </div>`
      )
      .join("");

    $("end-achievements").innerHTML = achievements.length
      ? achievements.map((a) => `<span class="ach">${a}</span>`).join("")
      : `<span class="ach empty">Ingen achievements — bare kaos</span>`;

    $("end-highlights").innerHTML = highlights
      .map((h) => `<li><strong>Uge ${h.week}:</strong> ${h.text}</li>`)
      .join("");

    const report = buildShareReport({
      headline, score, grade, rank, epitaph, won, achievements, highlights,
    });
    $("end-report").textContent = report;
    state.lastReport = report;
    toast(won ? "Slutrapport klar!" : "Se din exit-rapport", won ? "good" : "bad");
  }

  function computeScore(won) {
    const m = state.meters;
    const r = state.rel;
    let s =
      state.week * 12 +
      m.magt * 1.1 +
      m.kasse * 0.7 +
      m.image * 1.0 -
      m.mistanke * 0.9 -
      state.evidence.length * 5 +
      (r.parti + r.presse + r.vaelgere + r.lobby) * 0.15;
    // Balance bonus (Reigns-style midt-zone)
    REL_KEYS.forEach((k) => {
      if (r[k] >= 35 && r[k] <= 70) s += 8;
    });
    if (won) s += 80;
    if (m.magt >= 75 && won) s += 40;
    if (!state.flags.tookTemptation && won) s += 35;
    if (state.char.traits.hardFall && !won) s -= 20;
    return Math.max(0, Math.round(s));
  }

  function scoreGrade(score, won) {
    if (!won && score < 80) return { letter: "F", emoji: "🗑️" };
    if (!won) return { letter: "D", emoji: "📉" };
    if (score >= 450) return { letter: "S", emoji: "👑" };
    if (score >= 360) return { letter: "A", emoji: "🏆" };
    if (score >= 280) return { letter: "B", emoji: "👍" };
    if (score >= 200) return { letter: "C", emoji: "😐" };
    return { letter: "D", emoji: "😬" };
  }

  function rankTitle(won, kind, st) {
    if (kind === "pm") return "Statsminister-materiale";
    if (kind === "party") return "Smeltet af eget parti";
    if (kind === "rel" && st.flags.relDeath) {
      return st.flags.relDeath.reason;
    }
    if (!won) {
      if (st.week <= 6) return "Lyn-skandale";
      if (st.evidence.length >= 5) return "Bevis-arkivet selv";
      return "Dagens hovedperson (ufrivilligt)";
    }
    if (!st.flags.tookTemptation) return "Den hellige (næsten)";
    if (st.meters.mistanke < 25) return "Den usynlige operatør";
    if (st.rel.lobby >= 75) return "Lobbyens yndling";
    if (st.rel.vaelgere >= 75) return "Folkets darling";
    return "Overleveren";
  }

  function pickEpitaph(won, kind, st) {
    const name = st.char.name.split(" ")[0];
    if (kind === "pm") return `${name} tog magten — og smilede som om bilagene aldrig fandtes.`;
    if (kind === "party") return `Partiet klappede ${name} på skulderen. Så ud ad døren.`;
    if (kind === "rel" && st.flags.relDeath) {
      return st.flags.relDeath.reason + `. Det tog ${st.week} uger.`;
    }
    if (!won) {
      return pick([
        `Historien husker ikke reformerne. Den husker kvitteringen.`,
        `${name} lovede åbenhed. Fik den — ufrivilligt.`,
        `“Jeg husker det ikke” virkede. Indtil det ikke gjorde.`,
      ]);
    }
    if (!st.flags.tookTemptation) {
      return `${name} sagde nej til kuverterne. En sjælden art i magtens zoo.`;
    }
    return pick([
      `${name} overlevede perioden. Demokratiet også — nogenlunde.`,
      `Ren nok til valgplakaten. Snu nok til bagsiden.`,
      `En karriere bygget på middage, tåge og benarbejde.`,
    ]);
  }

  function collectAchievements(won, st) {
    const a = [];
    const m = st.meters;
    if (won) a.push("🏁 Fuldført periode");
    if (won && m.magt >= 75 && m.image >= 50) a.push("👑 Statsminister-vibes");
    if (!st.flags.tookTemptation && st.week >= 10) a.push("😇 Fristelsens mester (sagde nej)");
    if ((st.flags.temptationCount || 0) >= 3) a.push("😈 Kuvert-samleren");
    if ((st.flags.refusedTemptation || 0) >= 2) a.push("🛑 Nej-tak-klubben");
    if (m.mistanke < 20 && st.week >= 12) a.push("🥷 Usynlig operatør");
    if (m.kasse >= 80) a.push("💰 Dybe lommer");
    if (st.rel.vaelgere >= 80) a.push("🗳️ Folkets yndling");
    if (st.rel.lobby >= 80) a.push("💼 Lobby-konge");
    if (st.evidence.length === 0 && st.week >= 10) a.push("🧹 Rent papirspor");
    if (st.evidence.length >= 6) a.push("📂 Bevis-samleren");
    if (st.flags.usedLife) a.push("🐷 Ni liv (næsten)");
    if (st.week <= 5 && !won) a.push("⚡ Lynnedslag");
    if ((st.flags.pressGames || 0) >= 2) a.push("🎙️ TV-van");
    if ((st.flags.denials || 0) >= 3) a.push("🤷 Hukommelses-mester");
    // Balance: alle rel midt
    if (won && REL_KEYS.every((k) => st.rel[k] >= 30 && st.rel[k] <= 75)) {
      a.push("⚖️ Balancekunstner (Reigns-vibes)");
    }
    return a.slice(0, 10);
  }

  function collectHighlights(st) {
    const spicy = st.history.filter((h) =>
      /bevis|skandale|kuvert|krise|pressemøde|fristelse|afslør|lobby/i.test(h.msg + h.name)
    );
    const pool = spicy.length ? spicy : st.history;
    const items = pool
      .slice(-5)
      .reverse()
      .map((h) => ({
        week: h.week,
        text: `${h.name}: ${h.msg.length > 100 ? h.msg.slice(0, 97) + "…" : h.msg}`,
      }));
    if (!items.length) {
      items.push({ week: st.week, text: "En bemærkelsesværdigt stille karriere." });
    }
    return items.slice(0, 5);
  }

  function buildShareReport({ headline, score, grade, rank, epitaph, won, achievements, highlights }) {
    const m = state.meters;
    const c = state.char;
    const r = state.rel;
    return [
      "🗞️ SKANDALEN VENTER — SLUTRAPPORT",
      "────────────────────────────",
      `${c.emoji} ${c.name} (${c.animal})`,
      `${won ? "✅ OVERLEVEDE" : "❌ FALDT"} · ${rank}`,
      `Score ${score} · Karakter ${grade.letter} ${grade.emoji}`,
      "",
      `📰 ${headline}`,
      `💬 ${epitaph}`,
      "",
      `📊 Magt ${m.magt} · Kasse ${m.kasse} · Image ${m.image} · Mistanke ${m.mistanke}`,
      `🏛️ Parti ${r.parti} · 📰 Presse ${r.presse} · 🗳️ Vælgere ${r.vaelgere} · 💼 Lobby ${r.lobby}`,
      `🗓️ Uge ${state.week}/${TOTAL_WEEKS} · 🗂️ Beviser: ${state.evidence.length}`,
      "",
      "🏅 Achievements:",
      ...(achievements.length ? achievements.map((x) => `  ${x}`) : ["  (ingen)"]),
      "",
      "📌 Højdepunkter:",
      ...highlights.map((h) => `  Uge ${h.week}: ${h.text}`),
      "",
      "Spil: Skandalen venter · dansk politisk satire",
    ].join("\n");
  }

  $("btn-copy-report").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(state.lastReport || "");
      $("btn-copy-report").textContent = "Kopieret!";
      toast("Rapport kopieret!", "good");
      setTimeout(() => {
        $("btn-copy-report").textContent = "Kopiér rapport";
      }, 1500);
    } catch {
      $("btn-copy-report").textContent = "Kopiér manuelt";
    }
  });

  $("btn-restart").addEventListener("click", () => {
    selectedId = null;
    state = null;
    $("character-detail").classList.add("hidden");
    document.body.classList.remove("critical-heat");
    show("start");
  });
})();
