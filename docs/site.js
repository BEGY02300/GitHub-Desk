const repository = "BEGY02300/Gestion-GitHub-graphique";
const api = `https://api.github.com/repos/${repository}`;
const latestReleaseUrl = `https://github.com/${repository}/releases/latest`;

const elements = {
  releaseStatus: document.querySelector("#release-status"),
  releaseUpdated: document.querySelector("#release-updated"),
  releaseTitle: document.querySelector("#latest-release-title"),
  releaseDescription: document.querySelector("#release-description"),
  releaseNotes: document.querySelector("#release-notes"),
  releasePublished: document.querySelector("#release-published"),
  activityStatus: document.querySelector("#activity-status"),
  activityList: document.querySelector("#activity-list"),
};

const platformAssets = [
  {
    asset: "download-windows",
    checksum: "checksum-windows",
    label: "Windows",
    packagePattern: /^github-desk-windows-x64-.+\.zip$/,
    checksumPattern: /^SHA256SUMS-.+-windows\.txt$/,
  },
  {
    asset: "download-macos",
    checksum: "checksum-macos",
    label: "macOS",
    packagePattern: /^github-desk-macos-(?:arm64|x86_64|x64)-.+\.zip$/,
    checksumPattern: /^SHA256SUMS-.+-darwin\.txt$/,
  },
  {
    asset: "download-linux",
    checksum: "checksum-linux",
    label: "Linux",
    packagePattern: /^github-desk-linux-x64-.+\.tar\.gz$/,
    checksumPattern: /^SHA256SUMS-.+-linux\.txt$/,
  },
];

function isRepositoryUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.pathname.startsWith(`/${repository}/`);
  } catch {
    return false;
  }
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date indisponible";
  }
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeZone: "Europe/Paris",
  }).format(date);
}

function setAssetLink(id, asset, fallbackText) {
  const link = document.getElementById(id);
  if (!link) return;

  if (asset && isRepositoryUrl(asset.browser_download_url)) {
    link.href = asset.browser_download_url;
    link.textContent = `${asset.name} · Télécharger`;
    link.setAttribute("aria-label", `Télécharger ${asset.name} depuis la release GitHub`);
    link.classList.remove("download-unavailable");
    return;
  }

  link.href = latestReleaseUrl;
  link.textContent = fallbackText;
  link.setAttribute("aria-label", `${fallbackText} sur la dernière release GitHub`);
  link.classList.add("download-unavailable");
}

async function fetchGithubJson(url) {
  const response = await fetch(url, {
    cache: "no-cache",
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) {
    const reason = response.status === 403
      ? "La limite de consultation publique de GitHub est peut-être atteinte. Réessaie plus tard."
      : `GitHub a répondu avec le statut ${response.status}.`;
    throw new Error(reason);
  }
  return response.json();
}

async function loadRelease() {
  const release = await fetchGithubJson(`${api}/releases/latest`);
  if (!release || typeof release.tag_name !== "string" || !Array.isArray(release.assets)) {
    throw new Error("Les informations de release reçues sont invalides.");
  }

  const assets = release.assets.filter((asset) =>
    asset && typeof asset.name === "string" && isRepositoryUrl(asset.browser_download_url)
  );
  const releaseNotes = typeof release.body === "string"
    ? release.body
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, "")
      .replace(/^\s*(?:#+\s*)?(?:\*\*)?Full Changelog(?:\*\*)?:.*$/gim, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[`*_>#]/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim()
    : "";
  elements.releaseTitle.textContent = `GitHub Desk ${release.tag_name}`;
  elements.releaseDescription.textContent = releaseNotes
    ? releaseNotes.slice(0, 360)
    : "Version publiée sur GitHub. Consulte les notes complètes et les changements associés.";
  elements.releaseNotes.href = isRepositoryUrl(release.html_url)
    ? release.html_url
    : latestReleaseUrl;
  elements.releasePublished.textContent = release.published_at
    ? `Publiée le ${formatDate(release.published_at)}`
    : "Date de publication indisponible";
  elements.releaseUpdated.textContent = "Release vérifiée sur GitHub";

  for (const platform of platformAssets) {
    const binary = assets.find((asset) => platform.packagePattern.test(asset.name));
    const checksum = assets.find((asset) => platform.checksumPattern.test(asset.name));
    setAssetLink(
      platform.asset,
      binary,
      `Paquet ${platform.label} indisponible · voir la release`
    );
    setAssetLink(
      platform.checksum,
      checksum,
      `SHA-256 ${platform.label} indisponible · voir la release`
    );
  }
}

function createActivityItem(commit) {
  const item = document.createElement("li");
  item.className = "activity-item";

  const link = document.createElement("a");
  const commitUrl = commit?.html_url;
  const sha = typeof commit?.sha === "string" ? commit.sha : "";
  const isCommitUrl = isRepositoryUrl(commitUrl) &&
    /^\/[^/]+\/[^/]+\/commit\/[a-f0-9]{40}$/i.test(new URL(commitUrl).pathname);
  if (!isCommitUrl || !/^[a-f0-9]{40}$/i.test(sha)) {
    throw new Error("GitHub a fourni un lien de commit inattendu.");
  }
  link.href = commitUrl;
  link.target = "_blank";
  link.rel = "noreferrer";

  const title = document.createElement("span");
  title.className = "activity-title";
  const message = typeof commit.commit?.message === "string" ? commit.commit.message : "";
  title.textContent = message.split("\n", 1)[0] || "Modification sans titre";

  const metadata = document.createElement("span");
  metadata.className = "activity-meta";
  const author = commit.author?.login || commit.commit?.author?.name || "Contributeur";
  const date = commit.commit?.author?.date || commit.commit?.committer?.date;
  metadata.textContent = `${author} · ${date ? formatDate(date) : "date inconnue"} · ${sha.slice(0, 7)}`;

  link.append(title, metadata);
  item.append(link);
  return item;
}

async function loadActivity() {
  const commits = await fetchGithubJson(`${api}/commits?per_page=5`);
  if (!Array.isArray(commits)) {
    throw new Error("La liste des changements reçue est invalide.");
  }
  if (commits.length === 0) {
    elements.activityStatus.textContent = "Aucun changement récent à afficher.";
    return;
  }

  elements.activityList.replaceChildren(...commits.map(createActivityItem));
  elements.activityStatus.textContent = "Activité synchronisée avec la branche principale.";
}

async function startLiveUpdates() {
  const results = await Promise.allSettled([loadRelease(), loadActivity()]);
  const failed = results.filter((result) => result.status === "rejected");

  if (failed.length === 0) {
    elements.releaseStatus.textContent = "Versions, téléchargements et activité synchronisés avec GitHub.";
    return;
  }

  const errors = failed.map((result) => result.reason?.message || "Erreur réseau inconnue.");
  if (results[0].status === "rejected") {
    elements.releaseUpdated.textContent = "Synchronisation impossible";
    elements.releaseStatus.textContent = `La dernière release n’a pas pu être chargée : ${errors[0]} Les liens ouvrent la page de la dernière release GitHub.`;
  }
  if (results[1].status === "rejected") {
    elements.activityStatus.textContent = `L’activité GitHub n’a pas pu être chargée : ${errors.at(-1)}`;
  }
}

startLiveUpdates();
