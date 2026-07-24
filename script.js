const fallback = {
  members: 16,
  recruiting: true,
  heroLead: "笑って集まり、本気で戦う\nCODを一緒に楽しむ仲間を募集中",
  aboutTitle: "楽しく、本気で",
  aboutLead: "ゲームの合間も笑い声が絶えない\nそんな場所を目指して生まれたクランです",
  aboutText: "COD MW3～最新作で活動中。初心者から経験者まで、腕前を問わず一緒に楽しめるメンバーを歓迎しています。",
  saturdayTitle: "毎週土曜のプラベ",
  saturdayText: "毎週土曜日はクランメンバーでプライベートマッチを開催。ふざけながら楽しむ日も、本気で勝負する日もあります。",
  weekdayTitle: "普段の活動",
  weekdayText: "平日の夜等は最新作を中心に、公開マッチやランクプレイを楽しんでいます。",
  joinText: "全プラットフォーム対応。詳しい入隊条件はDM・面談でお伝えします。",
  leaderX: "https://x.com/Straight_Flush0",
  creatorX: "https://x.com/nosuri113",
  officialX: "https://x.com/CallofDutyJP",
  newsUrl: "https://fpsjp.net/?s=Call+of+Duty",
  backgroundYoutube: "",
  movies: [{ title: "SMILE HIGHLIGHTS", youtubeUrl: "" }]
};

const text = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value ?? "";
  });
};

const lines = (selector, value) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.replaceChildren();
    String(value ?? "").split("\n").forEach((line, index) => {
      if (index) element.append(document.createElement("br"));
      element.append(document.createTextNode(line));
    });
  });
};

const youtubeId = (url) => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1).split("/")[0];
    if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2];
    if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2];
    return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
};

function renderMovie(movie, index) {
  const id = youtubeId(movie.youtubeUrl);
  const player = document.querySelector("#movie-player");
  const title = movie.title || `CLAN MOVIE ${String(index + 1).padStart(2, "0")}`;
  if (id) {
    player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="${title.replaceAll('"', "&quot;")}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  } else {
    player.innerHTML = `<div class="movie-visual movie-visual-${(index % 3) + 1}"><span class="movie-grid"></span><span class="movie-number">${String(index + 1).padStart(2, "0")}</span><span class="play-button"><i></i></span><div class="movie-caption"><small>NOW SELECTED</small><b>${title}</b></div><span class="test-badge">YOUTUBE VIDEO / COMING SOON</span></div>`;
  }
}

function render(data) {
  text("[data-members]", data.members);
  text("[data-members-copy]", `現在${data.members}名で活動中`);
  lines("[data-hero-lead]", data.heroLead);
  text("[data-about-title]", data.aboutTitle);
  lines("[data-about-lead]", data.aboutLead);
  text("[data-about-text]", data.aboutText);
  text("[data-saturday-title]", data.saturdayTitle);
  text("[data-saturday-text]", data.saturdayText);
  text("[data-weekday-title]", data.weekdayTitle);
  text("[data-weekday-text]", data.weekdayText);
  text("[data-join-text]", data.joinText);
  document.querySelectorAll("[data-leader-x]").forEach((a) => a.href = data.leaderX);
  document.querySelector("[data-creator-x]").href = data.creatorX;
  document.querySelector("[data-official-x]").href = data.officialX;
  document.querySelector("[data-news-url]").href = data.newsUrl;
  text("[data-recruiting]", data.recruiting ? "メンバー募集" : "募集休止中");

  const bgId = youtubeId(data.backgroundYoutube);
  if (bgId) {
    document.querySelector(".hero-video").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${bgId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${bgId}&modestbranding=1&playsinline=1" tabindex="-1" title="背景動画" allow="autoplay; encrypted-media"></iframe>`;
    document.querySelector(".hero-video").classList.add("has-youtube");
  }

  const movies = Array.isArray(data.movies) && data.movies.length ? data.movies : fallback.movies;
  const list = document.querySelector("#movie-list");
  list.replaceChildren();
  movies.forEach((movie, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = index === 0 ? "active" : "";
    button.innerHTML = `<span class="movie-thumb movie-thumb-${(index % 3) + 1}"><i>${String(index + 1).padStart(2, "0")}</i></span><span><small>YOUTUBE VIDEO / ${String(index + 1).padStart(2, "0")}</small><b></b></span><i>↗</i>`;
    button.querySelector("b").textContent = movie.title || `CLAN MOVIE ${index + 1}`;
    button.addEventListener("click", () => {
      list.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderMovie(movie, index);
    });
    list.append(button);
  });
  renderMovie(movies[0], 0);
}

fetch("./content/site.json", { cache: "no-store" })
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((data) => render({ ...fallback, ...data }))
  .catch(() => render(fallback));

document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth" });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.12 });
document.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));

const localDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

async function loadVisitorCounts() {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const endpoint = "https://codclansmile.goatcounter.com/counter/TOTAL.json";

  try {
    const [todayResponse, monthResponse] = await Promise.all([
      fetch(`${endpoint}?start=${localDate(today)}`, { cache: "no-store" }),
      fetch(`${endpoint}?start=${localDate(monthStart)}`, { cache: "no-store" })
    ]);

    if (!todayResponse.ok || !monthResponse.ok) throw new Error("Counter unavailable");

    const [todayData, monthData] = await Promise.all([
      todayResponse.json(),
      monthResponse.json()
    ]);

    document.querySelector("#views-today").textContent = todayData.count;
    document.querySelector("#views-month").textContent = monthData.count;
    document.querySelector("#views-note").textContent = "集計結果は最大約4時間遅れて更新される場合があります";
  } catch {
    document.querySelector("#views-note").textContent = "閲覧数を取得できませんでした。時間をおいて再読み込みしてください";
  }
}

loadVisitorCounts();
