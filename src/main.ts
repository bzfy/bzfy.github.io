(() => {
  const REPO_OWNER = "bzfy";
  const REPO_NAME = "bzfy.github.io";
  const REPO_BRANCH = "bzfy";
  const PAGE_BASE = "https://bzfy.github.io";
  const START_DATE = "2021-01-01";
  const INTRO_SESSION_KEY = "bzfy_intro_played_v1";
  const BOOT_SESSION_KEY = "bzfy_boot_done_v1";
  const BOOT_MIN_MS = 950;

  const app = document.getElementById("app");
  if (!app) return;

  let runtimeTimer = null;
  let requestSeq = 0;
  let activeView = "";
  let bgMotionBound = false;
  let introInitialized = false;

  const contentsState = {
    loading: false,
    error: "",
    keyword: "",
    currentPath: "",
    items: [],
    els: {
      pathCurrent: null,
      backBtn: null,
      input: null,
      listWrap: null,
      stateBox: null,
    },
  };

  const articleState = {
    loading: false,
    error: "",
    items: [],
    els: {
      listWrap: null,
      stateBox: null,
    },
  };

  const repoState = {
    loading: false,
    error: "",
    items: [],
    els: {
      listWrap: null,
      stateBox: null,
    },
  };

  function getRuntime(startDate) {
    const start = new Date(startDate + "T00:00:00");
    const now = new Date();
    const diff = Math.max(0, now.getTime() - start.getTime());
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff / (60 * 60 * 1000)) % 24);
    const minutes = Math.floor((diff / (60 * 1000)) % 60);
    return `${days} 天 ${hours} 小时 ${minutes} 分钟`;
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getRoute() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const [pathPart, queryPart = ""] = raw.split("?");
    const normalizedPath = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
    return {
      path: normalizedPath || "/",
      query: new URLSearchParams(queryPart),
    };
  }

  function navigateTo(hash) {
    if (location.hash === hash) {
      renderRoute();
      return;
    }
    location.hash = hash;
  }

  function setContentsPath(path) {
    const query = new URLSearchParams();
    if (path) query.set("path", path);
    const queryString = query.toString();
    navigateTo(`#/contents${queryString ? `?${queryString}` : ""}`);
  }

  function clearTimers() {
    if (runtimeTimer !== null) {
      clearInterval(runtimeTimer);
      runtimeTimer = null;
    }
  }

  function showBootMask() {
    const mask = document.createElement("div");
    mask.className = "boot-mask";
    mask.innerHTML = `
      <div class="boot-inner">
        <div class="boot-num-wrap"><span class="boot-num">0</span><span class="boot-unit">%</span></div>
      </div>
    `;
    const numEl = mask.querySelector(".boot-num");
    let visualValue = 0;
    let disposed = false;

    const setProgress = (progress) => {
      if (disposed || !numEl) return;
      const clamped = Math.max(0, Math.min(1, progress));
      const target = Math.floor(clamped * 100);
      visualValue += (target - visualValue) * 0.24;
      const shown = Math.max(0, Math.min(100, Math.round(visualValue)));
      numEl.textContent = String(shown);
    };

    const finish = () => {
      if (!numEl) return;
      numEl.textContent = "100";
      mask.classList.add("is-done");
    };

    document.body.appendChild(mask);
    return {
      setProgress,
      finish,
      hide: () => {
        disposed = true;
        mask.classList.add("is-out");
        window.setTimeout(() => {
          mask.remove();
        }, 420);
      },
    };
  }

  function playIntroOnce() {
    if (introInitialized) return false;
    introInitialized = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (sessionStorage.getItem(INTRO_SESSION_KEY) === "1") return false;
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");

    const overlay = document.createElement("div");
    overlay.className = "intro-overlay";
    overlay.innerHTML = `
      <div class="intro-beam intro-beam-a"></div>
      <div class="intro-beam intro-beam-b"></div>
      <div class="intro-grid"></div>
      <div class="intro-shell">
        <div class="intro-topbar-spacer"></div>
        <div class="intro-main">
          <div class="intro-center">
            <p class="intro-kicker">bzfy portfolio</p>
            <h2 class="intro-logo-word" aria-label="bzfy">
              <svg class="intro-logo-svg" viewBox="0 0 760 180" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="intro-flow-rainbow" gradientUnits="userSpaceOnUse" x1="170" y1="90" x2="530" y2="90">
                    <stop offset="0%" stop-color="#00e7ff" />
                    <stop offset="35%" stop-color="#92ff55" />
                    <stop offset="68%" stop-color="#ff7a59" />
                    <stop offset="100%" stop-color="#00e7ff" />
                    <animateTransform attributeName="gradientTransform" type="rotate" from="0 380 90" to="360 380 90" dur="5.8s" repeatCount="indefinite" />
                  </linearGradient>
                </defs>
                <text class="intro-logo-letter-base" x="170" y="118">b</text>
                <text class="intro-logo-letter-base" x="280" y="118">z</text>
                <text class="intro-logo-letter-base" x="390" y="118">f</text>
                <text class="intro-logo-letter-base" x="476" y="118">y</text>

                <text class="intro-logo-letter-flow intro-letter-1" x="170" y="118">b</text>
                <text class="intro-logo-letter-flow intro-letter-2" x="280" y="118">z</text>
                <text class="intro-logo-letter-flow intro-letter-3" x="390" y="118">f</text>
                <text class="intro-logo-letter-flow intro-letter-4" x="476" y="118">y</text>
              </svg>
            </h2>
          </div>
        </div>
        <div class="intro-footer-spacer"></div>
      </div>
      <div class="intro-shutter intro-shutter-top"></div>
      <div class="intro-shutter intro-shutter-bottom"></div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("intro-lock");

    // Pre-warm one frame to avoid first-frame composition glitch.
    window.requestAnimationFrame(() => {
      overlay.classList.add("is-in");
    });

    window.setTimeout(() => {
      overlay.classList.add("is-out");
      document.body.classList.remove("intro-lock");
    }, 2920);

    window.setTimeout(() => {
      overlay.remove();
    }, 4100);
    return true;
  }

  function bindBackgroundMotion() {
    if (bgMotionBound) return;
    bgMotionBound = true;

    const root = document.documentElement;
    let tx = 50;
    let ty = 50;
    let cx = 50;
    let cy = 50;
    let rafId = 0;

    const applyPos = (x, y) => {
      tx = Math.max(0, Math.min(100, (x / window.innerWidth) * 100));
      ty = Math.max(0, Math.min(100, (y / window.innerHeight) * 100));
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty("--mx", cx.toFixed(2));
      root.style.setProperty("--my", cy.toFixed(2));
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", (e) => {
      applyPos(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      applyPos(t.clientX, t.clientY);
    }, { passive: true });

    if (!rafId) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function layoutHtml(active, content) {
    return `
      <div class="shell">
        <header class="topbar">
          <a class="brand" href="#/" data-nav="home-link">bzfy</a>
          <div class="nav-actions">
            <button class="contents-btn ${active === "contents" ? "active" : ""}" type="button" data-nav="contents">Contents</button>
            <button class="contents-btn ${active === "repository" ? "active" : ""}" type="button" data-nav="repository">Repository</button>
            <button class="contents-btn ${active === "articles" ? "active" : ""}" type="button" data-nav="articles">Articles</button>
          </div>
        </header>
        ${content}
      </div>
    `;
  }

  function bindTopNav() {
    const brand = app.querySelector('[data-nav="home-link"]');
    if (brand) {
      brand.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("#/");
      });
    }

    const contentsBtn = app.querySelector('[data-nav="contents"]');
    if (contentsBtn) {
      contentsBtn.addEventListener("click", () => {
        contentsState.keyword = "";
        setContentsPath("");
      });
    }

    const articleBtn = app.querySelector('[data-nav="articles"]');
    if (articleBtn) {
      articleBtn.addEventListener("click", () => {
        navigateTo("#/articles");
      });
    }

    const repoBtn = app.querySelector('[data-nav="repository"]');
    if (repoBtn) {
      repoBtn.addEventListener("click", () => {
        navigateTo("#/repository");
      });
    }
  }

  function renderHome() {
    clearTimers();
    activeView = "home";

    app.innerHTML = layoutHtml(
      "home",
      `
      <main class="home-main">
        <h1 class="logo-word" aria-label="bzfy">
          <svg class="logo-svg" viewBox="0 0 760 180" role="img" aria-hidden="true">
            <defs>
              <linearGradient id="flow-rainbow" gradientUnits="userSpaceOnUse" x1="170" y1="90" x2="530" y2="90">
                <stop offset="0%" stop-color="#00e7ff" />
                <stop offset="35%" stop-color="#92ff55" />
                <stop offset="68%" stop-color="#ff7a59" />
                <stop offset="100%" stop-color="#00e7ff" />
                <animateTransform attributeName="gradientTransform" type="rotate" from="0 380 90" to="360 380 90" dur="4.2s" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            <text class="logo-letter-base" x="170" y="118">b</text>
            <text class="logo-letter-base" x="280" y="118">z</text>
            <text class="logo-letter-base" x="390" y="118">f</text>
            <text class="logo-letter-base" x="476" y="118">y</text>

            <text class="logo-letter-flow letter-1" x="170" y="118">b</text>
            <text class="logo-letter-flow letter-2" x="280" y="118">z</text>
            <text class="logo-letter-flow letter-3" x="390" y="118">f</text>
            <text class="logo-letter-flow letter-4" x="476" y="118">y</text>
          </svg>
        </h1>
      </main>
      <footer class="site-footer">
        <span id="runtimeText">运行时间：${escapeHtml(getRuntime(START_DATE))}</span>
      </footer>
      `
    );

    bindTopNav();

    const runtimeText = document.getElementById("runtimeText");
    runtimeTimer = window.setInterval(() => {
      if (runtimeText) runtimeText.textContent = `运行时间：${getRuntime(START_DATE)}`;
    }, 60000);
  }

  function getFilteredItems() {
    const key = contentsState.keyword.toLowerCase();
    if (!key) return contentsState.items;
    return contentsState.items.filter((item) => item.name.toLowerCase().includes(key));
  }

  function goParent() {
    const parts = contentsState.currentPath.split("/");
    parts.pop();
    setContentsPath(parts.join("/"));
  }

  function openItem(item) {
    if (item.type === "dir") {
      setContentsPath(item.path);
      return;
    }
    let relativePath = item.path;
    if (relativePath.toLowerCase().endsWith(".md")) relativePath = relativePath.slice(0, -3);
    window.open(`${PAGE_BASE}/${relativePath}`, "_blank", "noopener");
  }

  function updateContentsDom() {
    const { pathCurrent, backBtn, listWrap, stateBox } = contentsState.els;
    if (!pathCurrent || !backBtn || !listWrap || !stateBox) return;

    pathCurrent.textContent = `/${contentsState.currentPath || ""}`;
    backBtn.style.display = contentsState.currentPath ? "inline-flex" : "none";

    if (contentsState.loading) {
      stateBox.className = "state-box";
      stateBox.textContent = "加载目录中...";
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    if (contentsState.error) {
      stateBox.className = "state-box error";
      stateBox.textContent = contentsState.error;
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    const filtered = getFilteredItems();
    if (!filtered.length) {
      stateBox.className = "state-box";
      stateBox.textContent = "没有匹配项";
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    stateBox.style.display = "none";

    listWrap.innerHTML = filtered
      .map(
        (item, idx) => `
          <div class="list-item" data-index="${idx}">
            <span class="icon">${item.type === "dir" ? "📁" : "📄"}</span>
            <span class="name">${escapeHtml(item.name)}</span>
            <span class="hint">${item.type === "dir" ? "进入" : "打开"}</span>
          </div>
        `
      )
      .join("");

    listWrap.querySelectorAll(".list-item").forEach((node) => {
      node.addEventListener("click", () => {
        const index = Number(node.getAttribute("data-index"));
        const item = filtered[index];
        if (item) openItem(item);
      });
    });
  }

  async function fetchAndDisplay(path) {
    contentsState.currentPath = path || "";
    contentsState.loading = true;
    contentsState.error = "";
    updateContentsDom();

    const mySeq = ++requestSeq;

    try {
      const suffix = contentsState.currentPath ? `/${contentsState.currentPath}` : "";
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents${suffix}?ref=${REPO_BRANCH}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`GitHub API ${resp.status}`);
      const data = await resp.json();
      if (mySeq !== requestSeq) return;

      const arr = Array.isArray(data) ? data : [];
      contentsState.items = arr.sort((a, b) => {
        if (a.type === "dir" && b.type !== "dir") return -1;
        if (a.type !== "dir" && b.type === "dir") return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      if (mySeq !== requestSeq) return;
      contentsState.error = `获取目录失败：${error instanceof Error ? error.message : String(error)}`;
      contentsState.items = [];
    } finally {
      if (mySeq === requestSeq) {
        contentsState.loading = false;
        updateContentsDom();
      }
    }
  }

  function renderContentsShell() {
    clearTimers();
    activeView = "contents";

    app.innerHTML = layoutHtml(
      "contents",
      `
      <section class="view contents-view">
        <div class="contents-toolbar">
          <strong>Repository Contents</strong>
          <input id="keywordInput" type="text" placeholder="搜索文件/文件夹..." />
        </div>

        <div class="path-bar">
          <button class="path-btn" id="rootBtn">根目录</button>
          <button class="path-btn" id="backBtn">返回上级</button>
          <span class="path-current" id="pathCurrent">/</span>
        </div>

        <div class="state-box" id="stateBox"></div>
        <div class="listing" id="listWrap"></div>
      </section>
      `
    );

    bindTopNav();

    contentsState.els.pathCurrent = document.getElementById("pathCurrent");
    contentsState.els.backBtn = document.getElementById("backBtn");
    contentsState.els.input = document.getElementById("keywordInput");
    contentsState.els.listWrap = document.getElementById("listWrap");
    contentsState.els.stateBox = document.getElementById("stateBox");

    if (contentsState.els.input) {
      contentsState.els.input.value = contentsState.keyword;
      contentsState.els.input.addEventListener("input", () => {
        contentsState.keyword = contentsState.els.input.value;
        updateContentsDom();
      });
      contentsState.els.input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          contentsState.keyword = "";
          contentsState.els.input.value = "";
          updateContentsDom();
        }
      });
    }

    const rootBtn = document.getElementById("rootBtn");
    if (rootBtn) rootBtn.addEventListener("click", () => setContentsPath(""));

    if (contentsState.els.backBtn) {
      contentsState.els.backBtn.addEventListener("click", goParent);
    }
  }

  function updateArticlesDom() {
    const { listWrap, stateBox } = articleState.els;
    if (!listWrap || !stateBox) return;

    if (articleState.loading) {
      stateBox.className = "state-box";
      stateBox.textContent = "加载文章中...";
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    if (articleState.error) {
      stateBox.className = "state-box error";
      stateBox.textContent = articleState.error;
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    if (!articleState.items.length) {
      stateBox.className = "state-box";
      stateBox.textContent = "暂无文章";
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    stateBox.style.display = "none";
    listWrap.innerHTML = articleState.items
      .map((item) => {
        const cleanTitle = escapeHtml(item.name.replace(/\.md$/i, ""));
        return `
          <article class="article-card" data-path="${escapeHtml(item.path)}">
            <h3>${cleanTitle}</h3>
            <p>${escapeHtml(item.path)}</p>
            <button class="path-btn open-article" type="button">打开文章</button>
          </article>
        `;
      })
      .join("");

    listWrap.querySelectorAll(".article-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        if (!e.target.classList.contains("open-article") && e.target.closest(".open-article") === null) {
          return;
        }
        const path = card.getAttribute("data-path");
        if (!path) return;
        const relativePath = path.toLowerCase().endsWith(".md") ? path.slice(0, -3) : path;
        window.open(`${PAGE_BASE}/${relativePath}`, "_blank", "noopener");
      });
    });
  }

  async function fetchArticles() {
    articleState.loading = true;
    articleState.error = "";
    updateArticlesDom();

    const mySeq = ++requestSeq;

    try {
      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/articles?ref=${REPO_BRANCH}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`GitHub API ${resp.status}`);
      const data = await resp.json();
      if (mySeq !== requestSeq) return;

      const arr = Array.isArray(data) ? data : [];
      articleState.items = arr
        .filter((item) => item.type === "file" && item.name.toLowerCase().endsWith(".md"))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      if (mySeq !== requestSeq) return;
      articleState.error = `获取文章失败：${error instanceof Error ? error.message : String(error)}`;
      articleState.items = [];
    } finally {
      if (mySeq === requestSeq) {
        articleState.loading = false;
        updateArticlesDom();
      }
    }
  }

  function renderArticlesShell() {
    clearTimers();
    activeView = "articles";

    app.innerHTML = layoutHtml(
      "articles",
      `
      <section class="view contents-view">
        <div class="contents-toolbar">
          <strong>Articles</strong>
          <span class="path-current">/articles</span>
        </div>
        <div class="state-box" id="articleStateBox"></div>
        <div class="article-grid" id="articleListWrap"></div>
      </section>
      `
    );

    bindTopNav();

    articleState.els.stateBox = document.getElementById("articleStateBox");
    articleState.els.listWrap = document.getElementById("articleListWrap");
  }

  function updateReposDom() {
    const { listWrap, stateBox } = repoState.els;
    if (!listWrap || !stateBox) return;

    if (repoState.loading) {
      stateBox.className = "state-box";
      stateBox.textContent = "加载仓库中...";
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    if (repoState.error) {
      stateBox.className = "state-box error";
      stateBox.textContent = repoState.error;
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    if (!repoState.items.length) {
      stateBox.className = "state-box";
      stateBox.textContent = "暂无仓库";
      stateBox.style.display = "block";
      listWrap.innerHTML = "";
      return;
    }

    stateBox.style.display = "none";
    listWrap.innerHTML = repoState.items
      .map((repo) => {
        const desc = repo.description ? escapeHtml(repo.description) : "No description";
        const lang = repo.language ? escapeHtml(repo.language) : "Unknown";
        const updated = new Date(repo.updated_at).toLocaleDateString("zh-CN");
        return `
          <article class="repo-card">
            <h3>${escapeHtml(repo.name)}</h3>
            <p>${desc}</p>
            <div class="repo-meta">
              <span>${lang}</span>
              <span>⭐ ${repo.stargazers_count}</span>
              <span>🍴 ${repo.forks_count}</span>
              <span>${updated}</span>
            </div>
            <a class="path-btn repo-link" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener">打开仓库</a>
          </article>
        `;
      })
      .join("");

    listWrap.querySelectorAll(".repo-card").forEach((card) => {
      const reset = () => {
        card.style.transform = "";
      };

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = ((y / rect.height) - 0.5) * -2;
        const ry = ((x / rect.width) - 0.5) * 2;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-0.5px)`;
      });

      card.addEventListener("mouseleave", reset);
      card.addEventListener("blur", reset);
    });
  }

  async function fetchRepos() {
    repoState.loading = true;
    repoState.error = "";
    updateReposDom();

    const mySeq = ++requestSeq;
    try {
      const url = `https://api.github.com/users/${REPO_OWNER}/repos?sort=updated&per_page=100`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`GitHub API ${resp.status}`);
      const data = await resp.json();
      if (mySeq !== requestSeq) return;
      const arr = Array.isArray(data) ? data : [];
      repoState.items = arr.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } catch (error) {
      if (mySeq !== requestSeq) return;
      repoState.error = `获取仓库失败：${error instanceof Error ? error.message : String(error)}`;
      repoState.items = [];
    } finally {
      if (mySeq === requestSeq) {
        repoState.loading = false;
        updateReposDom();
      }
    }
  }

  function renderRepositoryShell() {
    clearTimers();
    activeView = "repository";

    app.innerHTML = layoutHtml(
      "repository",
      `
      <section class="view contents-view">
        <div class="contents-toolbar">
          <strong>Repository</strong>
          <a class="path-current" href="https://github.com/${REPO_OWNER}" target="_blank" rel="noopener">@${REPO_OWNER}</a>
        </div>
        <div class="state-box" id="repoStateBox"></div>
        <div class="repo-grid" id="repoListWrap"></div>
      </section>
      `
    );

    bindTopNav();

    repoState.els.stateBox = document.getElementById("repoStateBox");
    repoState.els.listWrap = document.getElementById("repoListWrap");
  }

  function renderRoute() {
    const route = getRoute();

    if (route.path === "/contents") {
      if (activeView !== "contents") {
        renderContentsShell();
      }
      const path = (route.query.get("path") || "").trim();
      void fetchAndDisplay(path);
      return;
    }

    if (route.path === "/articles") {
      if (activeView !== "articles") {
        renderArticlesShell();
      }
      void fetchArticles();
      return;
    }

    if (route.path === "/repository") {
      if (activeView !== "repository") {
        renderRepositoryShell();
      }
      void fetchRepos();
      return;
    }

    if (route.path !== "/") {
      navigateTo("#/");
      return;
    }

    renderHome();
  }

  window.addEventListener("hashchange", renderRoute);
  bindBackgroundMotion();
  renderRoute();

  const skipBoot = sessionStorage.getItem(BOOT_SESSION_KEY) === "1";
  if (skipBoot) {
    playIntroOnce();
  } else {
    const bootStart = performance.now();
    const boot = showBootMask();

    const animateBoot = () => {
      const elapsed = performance.now() - bootStart;
      const progress = Math.min(1, elapsed / BOOT_MIN_MS);
      boot.setProgress(progress);
      if (progress < 1) {
        window.requestAnimationFrame(animateBoot);
        return;
      }

      sessionStorage.setItem(BOOT_SESSION_KEY, "1");
      playIntroOnce();
      boot.finish();
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => boot.hide());
      });
    };

    window.requestAnimationFrame(animateBoot);
  }
})();


