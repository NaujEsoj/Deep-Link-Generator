
/** Deep Link Creator — per‑hotel dynamic rooms **/

const el = (sel) => document.querySelector(sel);

const country = el('#country');
const lang = el('#lang');
const hotel = el('#hotel');
const startDate = el('#startDate');
const endDate = el('#endDate');
const advanced = el('#advanced');
const advancedBox = el('#advancedBox');
const room = el('#room');
const discount = el('#discount');
const outText = el('#outText');
const btnCopy = el('#copy');
const btnOpen = el('#open');
const btnReset = el('#reset');

// 🔧 EDITABLE: per‑country base URLs, hotels and per‑hotel room catalogs
// Only active rooms (active: true) will be listed.
const CONFIG = {
  mexico: {
    base: 'https://paquetes-mx.decameron.com',
    hotels: [
      {
        value: 'decameronloscabos',
        label: 'Los Cabos',
        rooms: [
          { code: 'jr-suite', name: 'Junior Suite', active: true },
          { code: 'std', name: 'Standard', active: true },
          { code: 'suite', name: 'Suite', active: false },
        ],
      },
      {
        value: 'decameroncomplex',
        label: 'Complex',
        rooms: [
          { code: 'std', name: 'Standard', active: true },
          { code: 'suite', name: 'Suite', active: true },
        ],
      },
    ],
  },
  panama: {
    base: 'https://paquetes.decameron.com',
    hotels: [
      {
        value: 'decameronpanama',
        label: 'Panama',
        rooms: [
          { code: 'std', name: 'Standard', active: true },
          { code: 'ocean', name: 'Vista al Mar', active: false },
        ],
      },
    ],
  },
  jamaica: {
    base: 'https://paquetes.decameron.com', // ajusta si aplica
    hotels: [
      {
        value: 'grand-decameron-cornwall',
        label: 'Grand Decameron Cornwall',
        // Datos de ejemplo tomando tu captura: código, activo y nombre
        rooms: [
          { code: 'bhvw', name: 'Vista a la Playa', active: false },
          { code: 'ocvw', name: 'Vista al Mar', active: false },
          { code: 'bugdos', name: 'Vista al mar 1 cama king', active: true },
          { code: 'rmdos', name: 'Vista a la playa 1 cama King', active: false },
          { code: 'brmuno', name: 'Vista a la playa 2 camas dobles', active: true },
          { code: 'brmdos', name: 'Vista a la playa 1 cama King', active: true },
          { code: 'buguno', name: 'Vista al mar 2 camas dobles', active: true },
        ],
      },
    ],
  },
};

// Helpers
const today = new Date();
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function setMinDates() {
  const startMin = toISO(today);
  const endMinDate = new Date(today); endMinDate.setDate(endMinDate.getDate() + 1);
  startDate.min = startMin;
  endDate.min = toISO(endMinDate);
}

function populateHotels(countryKey) {
  hotel.innerHTML = '<option selected disabled value="">Select Hotel</option>';
  if (!countryKey || !CONFIG[countryKey]) return;
  CONFIG[countryKey].hotels.forEach(h => {
    const opt = document.createElement('option');
    opt.value = h.value; opt.textContent = h.label;
    hotel.appendChild(opt);
  });
}

// Find selected hotel object from CONFIG for current country+hotel
function currentHotelObj() {
  const c = CONFIG[country.value];
  if (!c) return null;
  return c.hotels.find(h => h.value === hotel.value) || null;
}

// Populate room list for selected hotel
function populateRooms() {
  const h = currentHotelObj();
  // reset room select
  room.innerHTML = '';
  // Always include "None"
  const none = document.createElement('option');
  none.value = ''; none.textContent = 'None'; none.selected = true;
  room.appendChild(none);

  if (!h || !Array.isArray(h.rooms)) return;

  // Only list active rooms
  h.rooms.filter(r => r.active).forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.code;
    opt.textContent = r.name + ` (${r.code})`;
    room.appendChild(opt);
  });
}

function enableSequence() {
  const enabled = !!country.value;
  lang.disabled = !enabled;
  hotel.disabled = !enabled;
  startDate.disabled = !enabled;
  endDate.disabled = !enabled;
}

function datesValid() {
  if (!startDate.value || !endDate.value) return false;
  return new Date(endDate.value) > new Date(startDate.value);
}

function buildURL() {
  if (!country.value || !lang.value || !hotel.value || !datesValid()) return '';
  const base = CONFIG[country.value].base;
  const params = new URLSearchParams({
    checkin: startDate.value,
    checkout: endDate.value,
    lang: lang.value,
  });
  if (advanced.checked && room.value) params.set('priorityRoom', room.value);
  if (advanced.checked && discount.value.trim()) params.set('discount', discount.value.trim());
  const url = `${base}/${lang.value}/availability/${hotel.value}?${params.toString()}`;
  return url;
}

function updateOutput() {
  const url = buildURL();
  if (url) {
    outText.textContent = url;
    btnCopy.disabled = false;
    btnOpen.disabled = false;
  } else {
    outText.textContent = 'Select all options';
    btnCopy.disabled = true;
    btnOpen.disabled = true;
  }
}

// Events
country.addEventListener('change', () => {
  populateHotels(country.value);
  hotel.value = '';
  populateRooms();
  enableSequence();
  updateOutput();
});

lang.addEventListener('change', updateOutput);

hotel.addEventListener('change', () => {
  populateRooms();
  updateOutput();
});

startDate.addEventListener('change', () => {
  const sd = new Date(startDate.value);
  if (isNaN(sd)) return;
  const minEnd = new Date(sd); minEnd.setDate(minEnd.getDate() + 1);
  endDate.min = toISO(minEnd);
  if (endDate.value && new Date(endDate.value) <= sd) endDate.value = '';
  updateOutput();
});

endDate.addEventListener('change', updateOutput);

advanced.addEventListener('change', () => {
  advancedBox.hidden = !advanced.checked;
  updateOutput();
});
room.addEventListener('change', updateOutput);
discount.addEventListener('input', updateOutput);

// Actions
btnCopy.addEventListener('click', async () => {
  const url = buildURL();
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    const prev = btnCopy.textContent;
    btnCopy.textContent = 'Copied!';
    setTimeout(() => (btnCopy.textContent = prev), 1200);
  } catch (_) {
    window.prompt('Copy the link:', url);
  }
});

btnOpen.addEventListener('click', () => {
  const url = buildURL();
  if (url) window.open(url, '_blank');
});

btnReset.addEventListener('click', () => {
  country.value = '';
  lang.value = '';
  hotel.innerHTML = '<option selected disabled value="">Select Hotel</option>';
  room.innerHTML = '';
  setMinDates();
  startDate.value = '';
  endDate.value = '';
  discount.value = '';
  advanced.checked = false;
  advancedBox.hidden = true;
  enableSequence();
  updateOutput();
});

// Init
setMinDates();
enableSequence();
populateRooms();
updateOutput();
