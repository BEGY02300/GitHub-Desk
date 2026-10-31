"use strict";

const copyStatus = document.createElement("p");
copyStatus.className = "copy-status";
copyStatus.setAttribute("role", "status");
copyStatus.setAttribute("aria-live", "polite");

for (const pre of document.querySelectorAll(".install-section pre")) {
  const code = pre.querySelector("code");
  if (!code) continue;

  const block = document.createElement("div");
  block.className = "command-block";
  pre.before(block);
  block.append(pre);

  const button = document.createElement("button");
  button.className = "copy-command";
  button.type = "button";
  button.textContent = "Copier les commandes";
  button.setAttribute("aria-label", "Copier ces commandes dans le presse-papiers");
  block.append(button, copyStatus.cloneNode());

  button.addEventListener("click", async () => {
    const status = block.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(code.textContent.trim());
      button.textContent = "Copié !";
      status.textContent = "Commandes copiées. Collez-les dans le terminal correspondant.";
    } catch {
      button.textContent = "Copie impossible";
      status.textContent = "Le navigateur n’autorise pas la copie. Sélectionnez le texte des commandes et copiez-le manuellement.";
    }

    window.setTimeout(() => {
      button.textContent = "Copier les commandes";
    }, 2500);
  });
}
