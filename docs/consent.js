const consentPanel = document.querySelector("[data-consent-panel]");
const consentStatus = document.querySelector("[data-consent-status]");
const consentSettings = document.querySelector("[data-consent-open]");
const consentStorageKey = "github-desk-cookie-consent";

if (consentPanel && consentStatus && consentSettings) {
  let tagManagerLoading = false;
  let tagManagerLoaded = false;

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function updateAnalyticsConsent(granted) {
    gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }

  function loadTagManager() {
    if (tagManagerLoaded || tagManagerLoading) {
      updateAnalyticsConsent(true);
      return;
    }

    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    gtag("consent", "update", {
      analytics_storage: "granted",
    });
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=GTM-W38XTKK7";
    tagManagerLoading = true;
    script.addEventListener("load", () => {
      tagManagerLoading = false;
      tagManagerLoaded = true;
    }, { once: true });
    script.addEventListener("error", () => {
      tagManagerLoading = false;
      script.remove();
      consentStatus.textContent = "Google Tag Manager n’a pas pu être chargé. Vérifiez votre connexion ou votre bloqueur de contenu ; aucun suivi ne sera effectué tant que le tag n’est pas chargé.";
      showConsentPanel();
    }, { once: true });
    document.head.append(script);
  }

  function saveConsent(choice) {
    try {
      window.localStorage.setItem(consentStorageKey, choice);
      return true;
    } catch {
      consentStatus.textContent = "Votre choix ne peut pas être mémorisé dans ce navigateur ; il sera redemandé lors de votre prochaine visite.";
      return false;
    }
  }

  function setConsent(choice) {
    consentStatus.textContent = "";
    const saved = saveConsent(choice);
    consentPanel.hidden = saved;
    if (choice === "accepted") {
      loadTagManager();
    } else if (tagManagerLoaded || tagManagerLoading) {
      updateAnalyticsConsent(false);
    }
  }

  function showConsentPanel() {
    consentPanel.hidden = false;
    consentSettings.hidden = false;
  }

  document.querySelector("[data-consent-accept]")?.addEventListener("click", () => {
    setConsent("accepted");
  });
  document.querySelector("[data-consent-reject]")?.addEventListener("click", () => {
    setConsent("rejected");
  });
  consentSettings.addEventListener("click", () => {
    consentStatus.textContent = "";
    showConsentPanel();
  });

  try {
    const savedConsent = window.localStorage.getItem(consentStorageKey);
    if (savedConsent === "accepted") {
      consentSettings.hidden = false;
      loadTagManager();
    } else if (savedConsent === "rejected") {
      consentSettings.hidden = false;
    } else {
      showConsentPanel();
    }
  } catch {
    consentStatus.textContent = "Le navigateur ne permet pas de lire votre choix enregistré ; aucun outil de mesure ne sera chargé sans votre accord.";
    showConsentPanel();
  }
}
