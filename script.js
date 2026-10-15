(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      }
    });
  }

  const countryButtons = Array.from(document.querySelectorAll("[data-country]"));
  let selectedCountry = "Япония";

  function selectCountry(country) {
    selectedCountry = country;
    countryButtons.forEach((button) => {
      const selected = button.dataset.country === country;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  countryButtons.forEach((button) => {
    button.addEventListener("click", () => selectCountry(button.dataset.country));
  });

  document.querySelectorAll("[data-country-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const country = link.dataset.countryLink;
      selectCountry(country);
    });
  });

  const form = document.querySelector("#request-form");
  const feedback = document.querySelector("#form-feedback");
  const summary = document.querySelector("#request-summary");
  const copyButton = document.querySelector("#copy-request");
  const copyStatus = document.querySelector("#copy-status");
  let requestText = "";

  if (form && feedback && summary) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const carType = document.querySelector("#car-type").value || "Пока не определён";
      const budget = document.querySelector("#budget").value || "Пока не определён";
      const details = document.querySelector("#details").value.trim() || "Дополнительные пожелания не указаны";

      requestText = [
        "Запрос на подбор автомобиля — РАНГ АВТО",
        "Страна: " + selectedCountry,
        "Тип автомобиля: " + carType,
        "Бюджет: " + budget,
        "Пожелания: " + details
      ].join("\n");

      summary.textContent = requestText;
      feedback.hidden = false;
      if (copyStatus) copyStatus.textContent = "";
      feedback.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    });
  }

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      if (!requestText) return;
      try {
        await navigator.clipboard.writeText(requestText);
        if (copyStatus) copyStatus.textContent = "Текст скопирован.";
      } catch (error) {
        const temporary = document.createElement("textarea");
        temporary.value = requestText;
        temporary.setAttribute("readonly", "");
        temporary.style.position = "fixed";
        temporary.style.opacity = "0";
        document.body.appendChild(temporary);
        temporary.select();
        const copied = document.execCommand("copy");
        temporary.remove();
        if (copyStatus) copyStatus.textContent = copied ? "Текст скопирован." : "Не удалось скопировать. Выделите текст запроса вручную.";
      }
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
/* Connect the visual search to the existing enquiry form without pretending to send a lead. */
(() => {
  const finder = document.querySelector("#finder-form");
  if (!finder) return;
  finder.addEventListener("submit", (event) => {
    event.preventDefault();
    const country = finder.querySelector('input[name="finder-country"]:checked')?.value || "Япония";
    const body = document.querySelector("#finder-body")?.value || "";
    const budget = document.querySelector("#finder-budget")?.value || "";
    const countryButton = Array.from(document.querySelectorAll("[data-country]")).find(el => el.dataset.country === country);
    countryButton?.click();
    const typeField = document.querySelector("#car-type");
    const budgetField = document.querySelector("#budget");
    if (typeField && body) {
      const match = Array.from(typeField.options || []).find(opt => opt.value === body || opt.textContent.trim() === body);
      if (match) typeField.value = match.value;
    }
    if (budgetField && budget) {
      const match = Array.from(budgetField.options || []).find(opt => opt.value === budget || opt.textContent.trim() === budget);
      if (match) budgetField.value = match.value;
    }
    const details = document.querySelector("#details");
    if (details) {
      const additions = ["Запрос из быстрого подбора", "Страна: " + country, body && "Тип: " + body, budget && "Бюджет: " + budget].filter(Boolean).join("; ");
      details.value = details.value.trim() ? details.value.trim() + "\n" + additions : additions;
    }
    document.querySelector("#request")?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  });
})();
