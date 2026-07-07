const fullFrameSet = (car) =>
  Array.from(
    { length: 8 },
    (_, index) =>
      `${car}-${String(index).padStart(2, "0")}.webp`,
  );

const carData = {
  supra: {
    index: "01 / 04",
    name: "Toyota<br>Supra MK5",
    origin: "Japan / RWD",
    description:
      "Legenda wróciła. Sześć cylindrów, tylny napęd i balans, który sprawia, że każda droga zaczyna przypominać tor.",
    power: "340 KM",
    zero: "4,3 s",
    price: "900 PLN",
    engine: "3.0L R6 Turbo",
    drive: "RWD",
    speed: "250 km/h",
    frames: fullFrameSet("supra"),
    booking: "Toyota Supra MK5",
  },
  corvette: {
    index: "02 / 04",
    name: "Chevrolet<br>Corvette C7",
    origin: "USA / V8",
    description:
      "V8 o pojemności 6,2 litra i sylwetka, której nie da się pomylić. Głośna, widowiskowa i stworzona do robienia wrażenia.",
    power: "461 KM",
    zero: "3,7 s",
    price: "1 100 PLN",
    engine: "6.2L V8",
    drive: "RWD",
    speed: "290 km/h",
    frames: fullFrameSet("corvette"),
    booking: "Chevrolet Corvette C7",
  },
  jaguar: {
    index: "03 / 04",
    name: "Jaguar<br>F-Type",
    origin: "UK / Grand Tourer",
    description:
      "Brytyjska elegancja połączona ze sportową duszą. Idealny na wyjątkowy wieczór, wesele, sesję lub dłuższy wypad.",
    power: "do 575 KM",
    zero: "od 3,7 s",
    price: "800 PLN",
    engine: "2.0 / 3.0 / 5.0",
    drive: "RWD / AWD",
    speed: "do 300 km/h",
    frames: fullFrameSet("jaguar"),
    booking: "Jaguar F-Type",
  },
  bmw: {
    index: "04 / 04",
    name: "BMW<br>M3 G80",
    origin: "Germany / M Power",
    description:
      "Cztery miejsca i charakter samochodu torowego. M3 łączy codzienną użyteczność z osiągami, których nie da się przeoczyć.",
    power: "510 KM",
    zero: "od 3,5 s",
    price: "1 050 PLN",
    engine: "3.0L R6 Twin-Turbo",
    drive: "RWD / xDrive",
    speed: "do 290 km/h",
    frames: fullFrameSet("bmw"),
    booking: "BMW M3 G80",
  },
};

const requestedKey =
  new URLSearchParams(window.location.search).get("car") || "supra";
const key = carData[requestedKey] ? requestedKey : "supra";
const car = carData[key];
const carName = car.name.replace("<br>", " ");
const mainImage = document.querySelector("#detail-image");
const thumbnails = document.querySelector("#detail-thumbnails");
let selectedFrame = 1;

document.title = `${carName} — SportCar Rental Polska`;
document.querySelector("#detail-index").textContent = car.index;
document.querySelector("#detail-name").innerHTML = car.name;
document.querySelector("#detail-origin").textContent = car.origin;
document.querySelector("#detail-description").textContent = car.description;
document.querySelector("#detail-power").textContent = car.power;
document.querySelector("#detail-zero").textContent = car.zero;
document.querySelector("#detail-price").textContent = car.price;
document.querySelector("#detail-engine").textContent = car.engine;
document.querySelector("#detail-drive").textContent = car.drive;
document.querySelector("#detail-speed").textContent = car.speed;
document.querySelector("#detail-booking").href =
  `index.html?car=${key}#rezerwacja`;
document
  .querySelector(`[data-detail-link="${key}"]`)
  ?.classList.add("is-active");

function selectFrame(index) {
  selectedFrame = (index + car.frames.length) % car.frames.length;
  mainImage.src = car.frames[selectedFrame];
  mainImage.alt = `${carName} — ujęcie ${selectedFrame + 1} z ${car.frames.length}`;

  [...thumbnails.children].forEach((button, buttonIndex) => {
    const isActive = buttonIndex === selectedFrame;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

car.frames.forEach((source, index) => {
  const button = document.createElement("button");
  const image = document.createElement("img");

  button.type = "button";
  button.className = "detail-thumbnail";
  button.setAttribute("aria-label", `Pokaż ujęcie ${index + 1}`);
  button.setAttribute("aria-pressed", "false");
  image.src = source;
  image.alt = "";
  image.loading = "eager";
  image.decoding = "async";

  button.append(image);
  button.addEventListener("click", () => selectFrame(index));
  thumbnails.append(button);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    selectFrame(selectedFrame - 1);
  }
  if (event.key === "ArrowRight") {
    selectFrame(selectedFrame + 1);
  }
});

selectFrame(selectedFrame);
