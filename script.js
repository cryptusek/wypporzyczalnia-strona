const cars = {
  supra: {
    index: "01 — 04",
    origin: "Japonia · 3.0L R6 Turbo",
    title: "Toyota<br><em>Supra</em>",
    description:
      "Japoński design, sześć cylindrów i tylny napęd. Precyzyjne coupé stworzone dla tych, którzy liczą każdy zakręt.",
    power: "340 KM",
    zero: "4,3 s",
    drive: "RWD",
    price: "900 PLN",
    booking: "Toyota Supra MK5",
    bg: "27% center",
  },
  corvette: {
    index: "02 — 04",
    origin: "USA · 6.2L V8",
    title: "Corvette<br><em>C7</em>",
    description:
      "V8, które nie potrzebuje ścieżki dźwiękowej. Brutalne, głośne i zaprojektowane po to, żeby zatrzymywać spojrzenia.",
    power: "461 KM",
    zero: "3,7 s",
    drive: "RWD",
    price: "1 100 PLN",
    booking: "Chevrolet Corvette C7",
    bg: "45% center",
  },
  jaguar: {
    index: "03 — 04",
    origin: "Wielka Brytania · Grand Tourer",
    title: "Jaguar<br><em>F-Type</em>",
    description:
      "Brytyjska elegancja i sportowa dusza. Idealny na wyjątkowy wieczór, wesele, sesję lub dłuższy wypad za miasto.",
    power: "300–575 KM",
    zero: "od 3,7 s",
    drive: "RWD / AWD",
    price: "800 PLN",
    booking: "Jaguar F-Type",
    bg: "89% center",
  },
  bmw: {
    index: "04 — 04",
    origin: "Niemcy · 3.0L R6 Twin-Turbo",
    title: "BMW<br><em>M3 G80</em>",
    description:
      "Cztery miejsca i charakter torowego samochodu. M3 łączy codzienną użyteczność z przyspieszeniem, którego nie da się pomylić.",
    power: "510 KM",
    zero: "od 3,5 s",
    drive: "RWD / xDrive",
    price: "1 050 PLN",
    booking: "BMW M3 G80",
    bg: "70% center",
  },
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const progressBar = document.querySelector(".scroll-progress span");
const header = document.querySelector(".site-header");
const parallaxLayers = [...document.querySelectorAll(".parallax-layer")];
const kineticLines = [...document.querySelectorAll(".kinetic-type span")];

let scrollY = window.scrollY;
let ticking = false;

function updateScrollEffects() {
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? scrollY / documentHeight : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  header.classList.toggle("scrolled", scrollY > 30);

  if (!prefersReducedMotion) {
    parallaxLayers.forEach((layer) => {
      const speed = Number(layer.dataset.speed || 0);
      const rect = layer.parentElement.getBoundingClientRect();
      const local = window.innerHeight - rect.top;
      layer.style.transform = `translate3d(0, ${local * speed}px, 0) scale(1.06)`;
    });

    kineticLines.forEach((line) => {
      const speed = Number(line.dataset.speed || 0);
      const rect = line.parentElement.getBoundingClientRect();
      line.style.transform = `translate3d(${(window.innerHeight - rect.top) * speed}px, 0, 0)`;
    });
  }

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    scrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true },
);

updateScrollEffects();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
);

document.querySelectorAll(".reveal:not(.hero .reveal)").forEach((element) => {
  revealObserver.observe(element);
});

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  mobileMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  mobileMenu.classList.toggle("is-open", !open);
  document.body.classList.toggle("menu-open", !open);
});

mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const specElements = {
  counter: document.querySelector("#spec-counter"),
  origin: document.querySelector("#spec-origin"),
  title: document.querySelector("#spec-title"),
  description: document.querySelector("#spec-description"),
  power: document.querySelector("#spec-power"),
  zero: document.querySelector("#spec-zero"),
  drive: document.querySelector("#spec-drive"),
  price: document.querySelector("#spec-price"),
  background: document.querySelector(".spec-bg"),
};

const specButtons = [...document.querySelectorAll("[data-spec-car]")];

function selectCar(key, scrollToSpecs = false) {
  const car = cars[key];
  if (!car) return;

  specElements.counter.textContent = car.index;
  specElements.origin.textContent = car.origin;
  specElements.title.innerHTML = car.title;
  specElements.description.textContent = car.description;
  specElements.power.textContent = car.power;
  specElements.zero.textContent = car.zero;
  specElements.drive.textContent = car.drive;
  specElements.price.textContent = car.price;
  specElements.background.style.backgroundPosition = car.bg;

  specButtons.forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.specCar === key));
  });

  const bookingCar = document.querySelector("#booking-car");
  bookingCar.value = car.booking;
  bookingCar.dispatchEvent(new Event("change"));

  if (scrollToSpecs) {
    document.querySelector(".spec-showcase").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }
}

specButtons.forEach((button) => {
  button.addEventListener("click", () => selectCar(button.dataset.specCar));
});

document.querySelectorAll("[data-select-car]").forEach((button) => {
  button.addEventListener("click", () => selectCar(button.dataset.selectCar, true));
});

document.querySelectorAll("[data-package]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#booking-package").value = link.dataset.package;
  });
});

if (!prefersReducedMotion) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
const monthNames = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];
const carKeyByBookingName = Object.fromEntries(
  Object.entries(cars).map(([key, car]) => [car.booking, key]),
);
const availabilityCalendar = document.querySelector("#availability-calendar");
const availabilityMonth = document.querySelector("#availability-month");
const availabilityStatus = document.querySelector("#availability-status");
const bookingCarSelect = document.querySelector("#booking-car");
const dateFromInput = document.querySelector("#booking-date-from");
const dateToInput = document.querySelector("#booking-date-to");
let calendarCursor = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedStart = "";
let selectedEnd = "";
let awaitingRangeEnd = false;

function readableDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function selectedCarKey() {
  return carKeyByBookingName[bookingCarSelect.value] || "";
}

function updateSelectedDates() {
  dateFromInput.value = selectedStart;
  dateToInput.value = selectedEnd;
  if (!selectedCarKey()) {
    availabilityStatus.textContent = "Najpierw wybierz samochód.";
  } else if (!selectedStart) {
    availabilityStatus.textContent = "Wybierz pierwszy dzień wynajmu.";
  } else if (selectedStart && selectedEnd && awaitingRangeEnd) {
    availabilityStatus.textContent = `Wybrano ${readableDate(selectedStart)}. Możesz wysłać zapytanie albo wybrać dzień zwrotu.`;
  } else if (!selectedEnd) {
    availabilityStatus.textContent = `${readableDate(selectedStart)} — teraz wybierz dzień zwrotu.`;
  } else {
    availabilityStatus.textContent = `Wybrany termin: ${readableDate(selectedStart)} – ${readableDate(selectedEnd)}.`;
  }
}

function renderAvailability() {
  const carKey = selectedCarKey();
  const busy = new Set(window.SportCarAvailability.read()[carKey] || []);
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const leading = (new Date(year, month, 1).getDay() + 6) % 7;
  const selectedRange = new Set(
    selectedStart && selectedEnd
      ? window.SportCarAvailability.datesBetween(selectedStart, selectedEnd)
      : [],
  );

  availabilityMonth.textContent = `${monthNames[month]} ${year}`;
  availabilityCalendar.replaceChildren();

  for (let index = 0; index < leading; index += 1) {
    const empty = document.createElement("span");
    empty.className = "calendar-day is-empty";
    availabilityCalendar.append(empty);
  }

  for (let day = 1; day <= days; day += 1) {
    const date = window.SportCarAvailability.formatDate(new Date(year, month, day));
    const button = document.createElement("button");
    const isPast = date < localToday;
    const isBusy = busy.has(date);
    button.type = "button";
    button.className = "calendar-day";
    button.textContent = String(day);
    button.dataset.date = date;
    button.setAttribute("aria-label", readableDate(date));

    if (isPast) button.classList.add("is-past");
    if (isBusy) button.classList.add("is-busy");
    if (selectedRange.has(date)) button.classList.add("is-range");
    if (date === selectedStart || date === selectedEnd) button.classList.add("is-selected");
    button.disabled = !carKey || isPast || isBusy;

    button.addEventListener("click", () => {
      if (!selectedStart || (selectedEnd && !awaitingRangeEnd)) {
        selectedStart = date;
        selectedEnd = date;
        awaitingRangeEnd = true;
      } else if (date < selectedStart) {
        selectedEnd = selectedStart;
        selectedStart = date;
      } else if (window.SportCarAvailability.rangeHasBusy(carKey, selectedStart, date)) {
        availabilityStatus.textContent = "W tym zakresie jest zajęty dzień. Wybierz krótszy termin.";
        return;
      } else {
        selectedEnd = date;
        awaitingRangeEnd = false;
      }
      updateSelectedDates();
      renderAvailability();
    });

    availabilityCalendar.append(button);
  }

  updateSelectedDates();
}

document.querySelector("#availability-prev").addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1);
  renderAvailability();
});

document.querySelector("#availability-next").addEventListener("click", () => {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1);
  renderAvailability();
});

bookingCarSelect.addEventListener("change", () => {
  selectedStart = "";
  selectedEnd = "";
  awaitingRangeEnd = false;
  renderAvailability();
});

window.SportCarAvailability.subscribe(renderAvailability);

const requestedCar = new URLSearchParams(window.location.search).get("car");
if (requestedCar && cars[requestedCar]) {
  bookingCarSelect.value = cars[requestedCar].booking;
}

document.querySelector(".booking-form").addEventListener("submit", (event) => {
  if (!selectedStart || !selectedEnd) {
    event.preventDefault();
    availabilityStatus.textContent = "Wybierz pełny termin wynajmu w kalendarzu.";
    availabilityCalendar.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
  }
});

renderAvailability();
document.querySelector("#year").textContent = String(new Date().getFullYear());
