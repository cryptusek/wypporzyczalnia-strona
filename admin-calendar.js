const adminCalendar = document.querySelector("#admin-calendar");
const adminMonth = document.querySelector("#admin-month");
const adminCar = document.querySelector("#admin-car");
const adminMessage = document.querySelector("#admin-message");
const adminBusyCount = document.querySelector("#admin-busy-count");
const adminPin = document.querySelector("#admin-pin");
const today = new Date();
const localToday = window.SportCarAvailability.formatDate(today);
const monthNames = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];
let cursor = new Date(today.getFullYear(), today.getMonth(), 1);

if (!window.SportCarAvailability.online) {
  adminMessage.textContent = "Tryb GitHub Pages: zmiany zapisują się tylko w tej przeglądarce.";
}

function renderAdminCalendar() {
  const car = adminCar.value;
  const state = window.SportCarAvailability.read();
  const busy = new Set(state[car] || []);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const leading = (new Date(year, month, 1).getDay() + 6) % 7;
  let monthBusy = 0;

  adminMonth.textContent = `${monthNames[month]} ${year}`;
  adminCalendar.replaceChildren();

  for (let index = 0; index < leading; index += 1) {
    const empty = document.createElement("span");
    empty.className = "calendar-day is-empty";
    adminCalendar.append(empty);
  }

  for (let day = 1; day <= days; day += 1) {
    const date = window.SportCarAvailability.formatDate(new Date(year, month, day));
    const button = document.createElement("button");
    const isPast = date < localToday;
    const isBusy = busy.has(date);
    if (isBusy) monthBusy += 1;

    button.type = "button";
    button.className = "calendar-day";
    button.textContent = String(day);
    button.disabled = isPast;
    if (isPast) button.classList.add("is-past");
    if (isBusy) button.classList.add("is-busy");

    button.addEventListener("click", async () => {
      try {
        const nowBusy = await window.SportCarAvailability.toggleBusy(car, date, adminPin.value);
        adminMessage.textContent = nowBusy
          ? `${date} oznaczono jako zajęty${window.SportCarAvailability.online ? "." : " w tej przeglądarce."}`
          : `${date} jest ponownie dostępny${window.SportCarAvailability.online ? "." : " w tej przeglądarce."}`;
        renderAdminCalendar();
      } catch (error) {
        adminMessage.textContent = error.message;
        adminPin.focus();
      }
    });
    adminCalendar.append(button);
  }

  adminBusyCount.textContent = String(monthBusy);
}

document.querySelector("#admin-prev").addEventListener("click", () => {
  cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
  renderAdminCalendar();
});

document.querySelector("#admin-next").addEventListener("click", () => {
  cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  renderAdminCalendar();
});

adminCar.addEventListener("change", renderAdminCalendar);
window.SportCarAvailability.subscribe(renderAdminCalendar);
window.SportCarAvailability.refreshOnline();
renderAdminCalendar();
