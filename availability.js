(() => {
  const STORAGE_KEY = "sportcar-rental-availability-v1";
  const carKeys = ["supra", "corvette", "jaguar", "bmw"];
  const apiEnabled = location.protocol !== "file:" && !location.hostname.endsWith("github.io");
  let onlineState = null;

  function blankState() {
    return Object.fromEntries(carKeys.map((key) => [key, []]));
  }

  function read() {
    if (onlineState) return onlineState;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const state = blankState();
      carKeys.forEach((key) => {
        state[key] = Array.isArray(saved[key]) ? [...new Set(saved[key])].sort() : [];
      });
      return state;
    } catch {
      return blankState();
    }
  }

  function write(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    onlineState = state;
    window.dispatchEvent(new CustomEvent("sportcar:availability"));
  }

  async function toggleBusy(car, date, pin = "") {
    if (!apiEnabled) {
      const state = read();
      if (!state[car]) return false;
      const dates = new Set(state[car]);
      const nowBusy = !dates.has(date);
      nowBusy ? dates.add(date) : dates.delete(date);
      state[car] = [...dates].sort();
      write(state);
      return nowBusy;
    }

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ car, date, pin }),
      });
      if (response.status === 401) throw new Error("Nieprawidłowy PIN administratora.");
      if (response.ok) {
        const payload = await response.json();
        write(payload.state);
        return payload.busy;
      }
    } catch (error) {
      if (error.message.includes("PIN")) throw error;
    }

    const state = read();
    if (!state[car]) return false;
    const dates = new Set(state[car]);
    const nowBusy = !dates.has(date);
    nowBusy ? dates.add(date) : dates.delete(date);
    state[car] = [...dates].sort();
    write(state);
    return nowBusy;
  }

  async function refreshOnline() {
    if (!apiEnabled) return false;

    try {
      const response = await fetch("/api/availability", { cache: "no-store" });
      if (!response.ok) return false;
      const state = await response.json();
      write(state);
      return true;
    } catch {
      return false;
    }
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function datesBetween(start, end) {
    const result = [];
    if (!start || !end) return result;
    const cursor = new Date(`${start}T12:00:00`);
    const last = new Date(`${end}T12:00:00`);
    while (cursor <= last) {
      result.push(formatDate(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  }

  function rangeHasBusy(car, start, end) {
    const busy = new Set(read()[car] || []);
    return datesBetween(start, end).some((date) => busy.has(date));
  }

  function subscribe(callback) {
    const handler = () => callback(read());
    window.addEventListener("storage", handler);
    window.addEventListener("sportcar:availability", handler);
    return handler;
  }

  window.SportCarAvailability = {
    carKeys,
    datesBetween,
    formatDate,
    rangeHasBusy,
    read,
    refreshOnline,
    subscribe,
    toggleBusy,
    online: apiEnabled,
  };

  refreshOnline();
  if (apiEnabled) window.setInterval(refreshOnline, 30000);
})();
