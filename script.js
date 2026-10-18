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

/* Figma hero country selection */
(() => {
 const options = [...document.querySelectorAll('[data-hero-country]')];
 const name = document.getElementById('hero-country-name');
 const duration = document.querySelector('.hero-duration');
 const cases = { 'Китай': ['КИТАЯ','ОТ 25 ДНЕЙ'], 'Корея': ['КОРЕИ','ПО ЗАПРОСУ'], 'Япония': ['ЯПОНИИ','ПО ЗАПРОСУ'] };
 options.forEach(button=>button.addEventListener('click',()=>{
   options.forEach(other=>other.classList.toggle('is-active',other===button));
   const item=cases[button.dataset.heroCountry];if(name)name.textContent=item[0];if(duration)duration.textContent=item[1];
 }));
})();

/* Figma catalog tabs (visual-only; integration by external catalog provider). */
document.querySelectorAll('[data-catalog-tab]').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('[data-catalog-tab]').forEach(other=>other.classList.toggle('is-active',other===btn));
 const title=document.querySelector('.f-catalog-placeholder-top span:first-child');
 if(title)title.textContent='RANG AUTO / '+btn.dataset.catalogTab.toUpperCase();
}));
/* FAQ topic tabs with accessible disclosure panels. */
const faqData={
 'Общее':[
 ['Почему выгодно покупать автомобиль из Азии, а не в России?','Стоимость и выбор зависят от конкретной модели, комплектации, курса валют и действующих платежей. Сравнивать варианты лучше по полному расчёту под ключ.'],
 ['Чем покупка через РАНГ АВТО отличается от самостоятельного заказа?','Можно обсудить подбор, проверку, логистику и оформление в рамках одного процесса. Конкретный перечень услуг определяется договором.'],
 ['Что значит «проходной» и «непроходной» автомобиль?','Так неформально называют автомобили с разными условиями таможенного оформления. Правила и ставки зависят от характеристик и даты ввоза.'],
 ['Что делать, если выбранный автомобиль не укладывается в бюджет?','Можно рассмотреть другую комплектацию, модель, год выпуска или рынок покупки.'],
 ['Как контролировать покупку и доставку?','Порядок информирования о ходе заказа согласовывается с менеджером.'],
 ['Сколько занимает покупка и доставка?','Срок зависит от страны, автомобиля, маршрута, таможенных процедур и других обстоятельств. Точный ориентир обсуждается перед заказом.']
 ],
 'Гарантия':[['Есть ли гарантия на автомобиль?','Условия и объём гарантийных обязательств необходимо уточнить в договоре для конкретного автомобиля.'],['На что распространяется гарантия?','Перечень узлов, срок и исключения фиксируются в согласованных документах.']],
 'Оплата':[['Как формируется стоимость под ключ?','Расчёт может включать стоимость автомобиля, перевозку, таможенные платежи, оформление и услуги.'],['Можно ли приобрести автомобиль в кредит?','Возможность кредитования и условия зависят от банка и программы.']],
 'Логистика':[['Из каких стран доставляете автомобили?','Рассматриваем автомобили из Китая, Южной Кореи и Японии.'],['Как узнать срок доставки?','Срок рассчитывается индивидуально с учётом маршрута и этапов оформления.']],
 'Документы':[['Какие документы оформляются?','Состав документов зависит от страны ввоза и характеристик автомобиля. Уточняйте перечень до заключения договора.'],['Можно ли поставить автомобиль на учёт?','Порядок регистрации зависит от документов и соответствия автомобиля действующим требованиям.']],
 'Проверка':[['Как проверяется состояние автомобиля?','Доступный объём проверки зависит от источника покупки, рынка и конкретного автомобиля.'],['Можно ли запросить историю автомобиля?','Обсудите с менеджером доступные отчёты и документы по выбранному варианту.']]
};
function renderFigmaFaq(topic){
 const host=document.getElementById('f-faq-content');if(!host)return;
 host.replaceChildren();
 (faqData[topic]||[]).forEach(([question,answer])=>{
 const d=document.createElement('details'),s=document.createElement('summary'),p=document.createElement('p');
 s.textContent=question;p.textContent=answer;d.append(s,p);host.append(d);
 });
 document.querySelectorAll('[data-faq-tab]').forEach(b=>{const active=b.dataset.faqTab===topic;b.classList.toggle('is-active',active);b.setAttribute('aria-selected',String(active));});
}
document.querySelectorAll('[data-faq-tab]').forEach(b=>b.addEventListener('click',()=>renderFigmaFaq(b.dataset.faqTab)));
renderFigmaFaq('Общее');
/* New Figma form country controls are handled by existing request-form logic. */
document.querySelectorAll('.f-country-choices [data-country]').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('.f-country-choices [data-country]').forEach(other=>other.classList.toggle('is-selected',other===btn));
}));
