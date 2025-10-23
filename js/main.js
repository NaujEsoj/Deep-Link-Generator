/** Deep Link Creator — EC/PE => booking-search + numeric HID; otros => bookcore + slug **/

// Helpers para seleccionar nodos
const el = (sel) => document.querySelector(sel);

// UI elements
const country   = el('#country');
const lang      = el('#lang');
const hotel     = el('#hotel');
const startDate = el('#startDate');
const endDate   = el('#endDate');

// Advanced
const advanced    = el('#advanced');
const advancedBox = el('#advancedBox');
const room        = el('#room');
const discount    = el('#discount');

// Output / actions
const outText = el('#outText');
const btnCopy = el('#copy');
const btnOpen = el('#open');
const btnReset = el('#reset');

// ===================== Data Model =====================
// Países que deben usar el flujo especial (HID numérico)
const SPECIAL_NUMERIC_COUNTRIES = new Set(['EC','PE']);

// Catálogo global de hoteles: slug (texto) + hid (numérico) + rooms (para Priority Room)
const HOTELS = [

  //*********************COLOMBIA *********************** */

  { slug: "apbtsp",  label: "Apartahotel Boutique San Pedro", hid: 42290, rooms: [
    { code: 'apthl', name: 'Apartahotel', active: true  }
  ] },

  { slug: "dcmbr",   label: "Decameron Barú", hid: 8985, rooms: [
    { code: 'ofpl', name: 'Ocean Front Plus ', active: true  },
    { code: 'std', name: 'Estándar', active: true  },
    { code: 'stdpl', name: 'Estándar Plus', active: true  }
  ] },

  { slug: "dcmcrtg", label: "Decameron Cartagena", hid: 8670, rooms: [
    { code: 'std', name: 'Estándar', active: true }
  ] },

  { slug: "dcmdctn", label: "Decameron Decalodge Ticuna", hid: 8690, rooms: [
    { code: 'std', name: 'Estándar', active: true }
  ] },

  { slug: "dcmgln",  label: "Decameron Galeón", hid: 8675, rooms: [
    { code: 'st',  name: 'Suite',     active: true },
    { code: 'vil', name: 'Villa',     active: true },
    { code: 'std', name: 'Estándar',  active: true }
  ] },

  { slug: "dcmisl",  label: "Decameron Isleño", hid: 8671, rooms: [
    { code: 'stdkg',  name: 'Estándar King',                   active: true },
    { code: 'stdtn',  name: 'Estándar Twin',                   active: true },
    { code: 'stdvmt', name: 'Estándar Vista al mar Twin',      active: true },
    { code: 'spvm',   name: 'Superior Vista al Mar',           active: true },
    { code: 'stdvmk', name: 'Estándar Vista al mar King',      active: true }
  ] },

  { slug: "dcmlhlc", label: "Decameron Las Heliconias", hid: 17955, rooms: [
    { code: 'stdsp', name: 'Estándar superior', active: true },
    { code: 'dlx',   name: 'Deluxe',            active: true },
    { code: 'std',   name: 'Estándar',          active: true }
  ] },

  { slug: "dcmdlf",  label: "Decameron Los Delfines", hid: 8691, rooms: [
    { code: 'std', name: 'Estándar',     active: true },
    { code: 'js',  name: 'Junior Suite', active: true }
  ] },

  { slug: "dcmnrz",  label: "Decameron Marazul", hid: 8672, rooms: [
    { code: 'std', name: 'Estándar', active: true }
  ] },

  { slug: "dcmnrl",  label: "Decameron Maryland", hid: 8673, rooms: [
    { code: 'stdqn', name: 'Estándar Queen', active: true },
    { code: 'spr',   name: 'Superior',        active: true },
    { code: 'js',    name: 'Junior suite',    active: true }
  ] },

  { slug: "dcmpnc",  label: "Decameron Panaca", hid: 8693, rooms: [
    { code: 'std', name: 'Estándar', active: true }
  ] },

  { slug: "dcmsls",  label: "Decameron San Luis", hid: 8668, rooms: [
    { code: 'stdvm', name: 'Estándar vista al mar', active: true },
    { code: 'std',   name: 'Estándar',               active: true }
  ] },

  { slug: "rrfchto", label: "Refugio Rancho Tota", hid: 8894, rooms: [
    { code: 'std',  name: 'Estándar',                 active: true },
    { code: 'tpcb', name: 'Habitación tipo cabaña',   active: true }
  ] },


  // ****************************PERÚ**************************

  { slug: "dcmpsl", label: "Royal Decameron Punta Sal", hid: 13038, rooms: [
    { code: 'std',   name: 'Estándar',              active: true },
    { code: 'ocnfp', name: 'Ocean front plus',      active: true },
    { code: 'stdpl', name: 'Estandar plus',         active: true },
    { code: 'stdvm', name: 'Standard vista al mar', active: true },
    { code: 'stdsp', name: 'Estándar superior',     active: true },
    { code: 'sprpl', name: 'Superior plus',         active: true },
    { code: 'ocnvp', name: 'Ocean view plus',       active: true }
  ] },

  { slug: "dcmpbl", label: "Decameron El Pueblo", hid: 24445, rooms: [
    { code: 'stdm',  name: 'Standard matrimonial',            active: true },
    { code: 'stdt',  name: 'Estándar twin',                   active: true },
    { code: 'stdvj', name: 'Standard vista al jardin',        active: true },
    { code: 'st',    name: 'Suite',                           active: true },
    { code: 'spr',   name: 'Superior',                        active: true },
    { code: 'sprvj', name: 'Superior vista al jardin',        active: true },
    { code: 'sprvp', name: 'Superior vista panorámica',       active: true },
  ] },


 // ****************************MÉXICO**************************

  { slug: "decameronislacoral", label: "Decameron Isla Coral, Ramada All Inclusive", hid: 42741, rooms: [
    { code: 'stdov',    name: 'Estándar Vista al Mar',                 active: true },
    { code: 'std',      name: 'Estándar',                              active: true },
    { code: 'sunok',    name: 'Estándar 1 Camas King con Balcón',      active: true },
    { code: 'sdosq',    name: 'Estándar 2 Camas Queen',                 active: true },
    { code: 'ugcuatro', name: 'Vista al mar 1 cama King',               active: true },
    { code: 'vdosq',    name: 'Vista al mar 2 camas Queen',             active: true },
    { code: 'vmuno',    name: 'Vista frente al mar 1 cama King',        active: true }
  ] },

  { slug: "decameronlamarina", label: "Decameron La Marina, Ramada All Inclusive", hid: 42742, rooms: [
    { code: 'std',      name: 'Estándar',                           active: true },
    { code: 'stdov',    name: 'Estándar vista al mar',              active: true },
    { code: 'sdosq',    name: 'Estándar 2 Camas Queen',             active: true },
    { code: 'vdosq',    name: 'Vista al mar 2 camas Queen',         active: true },
    { code: 'ugcuatro', name: 'Vista al mar 1 cama King',           active: true },
    { code: 'vmuno',    name: 'Vista Frente al Mar 1 Cama King',    active: true }
  ] },

  { slug: "decameronloscocos", label: "Decameron Los Cocos, Ramada All Inclusive", hid: 8698, rooms: [
    { code: 'std',   name: 'Estándar',                  active: true },
    { code: 'rmuno', name: 'Estándar 2 camas Dobles',   active: true },
    { code: 'rmdos', name: 'Estándar 1 cama King',      active: true }
  ] },

  { slug: "decameroncomplex", label: "Grand Decameron Complex, A Trademark All Inclusive", hid: 8697, rooms: [
    { code: 'ofront',   name: 'Frente al Mar',                     active: true },
    { code: 'oview',    name: 'Vista al Mar',                      active: true },
    { code: 'std',      name: 'Estándar',                          active: true },
    { code: 'rmdos',    name: 'Estándar 1 cama King',              active: true },
    { code: 'rmuno',    name: 'Estándar 2 camas Dobles',           active: true },
    { code: 'ugcuatro', name: 'Vista al mar 1 cama King',          active: true },
    { code: 'ugtres',   name: 'Vista al mar 2 camas dobles',       active: true },
    { code: 'fmuno',    name: 'Frente al mar 1 cama King',         active: true },
    { code: 'fmdos',    name: 'Frente al mar 2 camas dobles',      active: true }
  ] },

  { slug: "decameronloscabos", label: "Grand Decameron Los Cabos, A Trademark All Inclusive", hid: 16545, rooms: [
    { code: 'stdpls',  name: 'Frente al Mar',                 active: false },
    { code: 'std',     name: 'Estándar',                      active: true  },
    { code: 'ovpls',   name: 'Vista al Mar',                  active: true  },
    { code: 'rmdos',   name: 'Estándar 1 cama King',          active: true  },
    { code: 'rmuno',   name: 'Estándar 2 camas Dobles',       active: true  },
    { code: 'ugcuatro',name: 'Vista al mar 1 cama King',      active: true  },
    { code: 'ugtres',  name: 'Vista al mar 2 camas dobles',   active: true  }
  ] },

 // ****************************JAMAICA**************************

  { slug: "grand-decameron-cornwall", label: "Grand Decameron Cornwall", hid: 24853, rooms: [
    { code: 'bugdos', name: 'Vista al mar 1 cama king',        active: true  },
    { code: 'brmuno', name: 'Vista a la playa 2 camas dobles', active: true  },
    { code: 'brmdos', name: 'Vista a la playa 1 cama King',    active: true  },
    { code: 'buguno', name: 'Vista al mar 2 camas dobles',     active: true  },
    { code: 'bhvw',   name: 'Vista a la Playa',                active: false },
    { code: 'ocvw',   name: 'Vista al Mar',                    active: false },
    { code: 'rmdos',  name: 'Vista a la playa 1 cama King',    active: false },
  ]},

  { slug: "dcmmtg", label: "Grand Decameron Montego Beach, A Trademark All Inclusive", hid: 1078, rooms: [
    { code: 'std',    name: 'Estándar',                          active: false },
    { code: 'ovvw',   name: 'Vista al Mar',                      active: false },
    { code: 'uguno',  name: 'Vista al Mar 2 Camas Dobles n.a',   active: false },
    { code: 'mrmdos', name: 'estandar 1 cama king',              active: true  },
    { code: 'mrmuno', name: 'Estandar 2 camas dobles',           active: true  },
    { code: 'mguno',  name: 'Vista al Mar 2 Camas Dobles',       active: true  },
    { code: 'mgdos',  name: 'Vista al mar 1 cama king',          active: true  }
  ] },


   // ****************************PANAMÁ**************************

  { slug: "decameronpanama", label: "Grand Decameron Panama, A Trademark All Inclusive", hid: 8695, rooms: [
    { code: 'sup',      name: 'Estándar Vista al Jardín',              active: false },
    { code: 'ovpls',    name: 'Vista al Mar Plus',                      active: false },
    { code: 'ofpls',    name: 'Estándar vista al mar',                  active: false },
    { code: 'gvpls',    name: 'Vista al Jardín Plus',                   active: false },
    { code: 'rmdos',    name: 'Vista al Jardín 1 Cama King',            active: true  },
    { code: 'ugcinco',  name: 'Vista al Jardín Plus 1 Cama King',       active: true  },
    { code: 'rmuno',    name: 'Vista al Jardín 2 Camas Dobles',         active: true  },
    { code: 'uguno',    name: 'Vista al Jardín Plus 2 Camas Dobles',    active: true  },
    { code: 'ugcuatro', name: 'Vista al Mar 1 Cama King',               active: true  },
    { code: 'ugseis',   name: 'Vista al Mar Plus 1 Cama King',          active: true  },
    { code: 'ugtres',   name: 'Vista al Mar 2 Camas Dobles',            active: true  },
    { code: 'ugdos',    name: 'Vista al Mar Plus 2 Camas Dobles',       active: true  }
  ] },

// ****************************ECUADOR**************************

  { slug: "dcmmph", label: "Royal Decameron Mompiche", hid: 9029, rooms: [
    { code: 'std',  name: 'Estándar',     active: true },
    { code: 'ofrt', name: 'Ocean front',  active: true },
    { code: 'oviv', name: 'Ocean view',   active: true }
  ] },

  { slug: "dcmpct", label: "Royal Decameron Punta Centinela", hid: 12742, rooms: [
    { code: 'stdvj', name: 'Estándar vista al jardín',   active: true },
    { code: 'sprvj', name: 'Superior vista al jardín',   active: true },
    { code: 'jsvj',  name: 'Junior Suite vista al jardín', active: true },
    { code: 'stdvm', name: 'Estándar vista al mar',      active: true },
    { code: 'sprvm', name: 'Superior vista al mar',      active: true },
    { code: 'jsvm',  name: 'Junior Suite vista al mar',  active: true }
  ] },

// ****************************EL SALVADOR**************************

  { slug: "dcmsln", label: "Royal Decameron Salinitas", hid: 8699, rooms: [
    { code: 'rmdos',    name: 'Estándar 1 cama King',                    active: true  },
    { code: 'rmuno',    name: 'Estándar 2 camas dobles',                 active: true  },
    { code: 'spr',      name: 'Superior',                                 active: false },
    { code: 'ugtres',   name: 'Vista al mar 2 camas dobles',              active: true  },
    { code: 'smuno',    name: 'Superior Vista al mar 1 cama King',        active: true  },
    { code: 'smdos',    name: 'Superior Vista al mar 2 camas dobles',     active: true  },
    { code: 'ugcuatro', name: 'Vista al mar 1 cama King',                 active: true  },
    { code: 'std',      name: 'Estándar',                                 active: false }
  ] },

];


// ===================== Helpers =====================
const today = new Date();
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function setMinDates() {
  const startMin = toISO(today);
  const endMinDate = new Date(today); endMinDate.setDate(endMinDate.getDate() + 1);
  startDate.min = startMin;
  endDate.min = toISO(endMinDate);
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

function getHotelBySlug(slug) {
  return HOTELS.find(h => h.slug === slug) || null;
}

function populateHotels() {
  hotel.innerHTML = '<option selected disabled value="">Select Hotel</option>';
  HOTELS.forEach(h => {
    const opt = document.createElement('option');
    opt.value = h.slug;
    opt.textContent = h.label;
    hotel.appendChild(opt);
  });
}

function populateRooms() {
  const h = getHotelBySlug(hotel.value);
  room.innerHTML = '';
  const none = document.createElement('option');
  none.value = ''; none.textContent = 'None'; none.selected = true;
  room.appendChild(none);

  if (!h || !Array.isArray(h.rooms)) return;
  h.rooms.filter(r => r.active).forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.code;
    opt.textContent = `${r.name} (${r.code})`;
    room.appendChild(opt);
  });
}

// ===================== URL Builders =====================
// EC/PE => booking-search.php con HID numérico
// https://booking.decameron.com/booking-search.php?base=${ISO2}&language=${lang}&hid=${HID}&checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&num-adults=2&num-child=0
function buildBookingSearchURL(hotelObj, countryISO, langCode, start, end, adultsQty = 2, childrenQty = 0) {
  if (hotelObj.hid === null || hotelObj.hid === undefined) {
    return { url: '', error: 'Falta el código numérico (hid) para este hotel.' };
  }
  const params = new URLSearchParams({
    base: countryISO,
    language: langCode,
    hid: String(hotelObj.hid),
    checkin: start,
    checkout: end,
    'num-adults': String(Math.max(1, Number(adultsQty) || 2)),
    'num-child': String(Math.max(0, Number(childrenQty) || 0)),
  });
  return { url: `https://booking.decameron.com/booking-search.php?${params.toString()}`, error: '' };
}

// Resto => bookcore + slug (con priorityRoom/discount opcionales)
// https://www.decameron.com/${lang}/bookcore/availability/${slug}/${start}/${end}/?country=${ISO2}[&priorityRoom=...&discount=...]
function buildBookcoreURL(hotelObj, countryISO, langCode, start, end, priorityRoom, discountCode) {
  let url = `https://www.decameron.com/${langCode}/bookcore/availability/${hotelObj.slug}/${start}/${end}/?country=${countryISO}`;
  const extra = new URLSearchParams();
  if (advanced.checked && priorityRoom) extra.set('priorityRoom', priorityRoom);
  if (advanced.checked && discountCode) extra.set('discount', discountCode);
  const qs = extra.toString();
  if (qs) url += `&${qs}`;
  return { url, error: '' };
}

function buildURL() {
  if (!country.value || !lang.value || !hotel.value || !datesValid()) {
    return { url: '', error: '' };
  }

  const countryISO = country.value;
  console.log('countryISO', countryISO);

  const langCode   = lang.value.toLowerCase();
  const h = getHotelBySlug(hotel.value);
  if (!h) return { url: '', error: 'Hotel no encontrado' };

  const start = startDate.value;
  const end   = endDate.value;

  // Optional advanced params for bookcore
  const pr   = room.value || '';
  const disc = (discount.value || '').trim();

  if (SPECIAL_NUMERIC_COUNTRIES.has(countryISO)) {
    console.log('into if');
    
    // EC / PE => booking-search (uses numeric HID)
    // Adults/children default to 2 / 0 inside the builder.
    return buildBookingSearchURL(h, countryISO, langCode, start, end);
  }

  // Others => bookcore (slug-based), keep advanced extras
  return buildBookcoreURL(h, countryISO, langCode, start, end, pr, disc);
}

// ===================== UI Wiring =====================
function updateOutput() {
  const { url, error } = buildURL();
  if (url) {
    outText.textContent = url;
    btnCopy.disabled = false;
    btnOpen.disabled  = false;
  } else {
    outText.textContent = error || 'Select all options';
    btnCopy.disabled = true;
    btnOpen.disabled  = true;
  }
}

country.addEventListener('change', () => {
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
  if (!isNaN(sd)) {
    const minEnd = new Date(sd); minEnd.setDate(minEnd.getDate() + 1);
    endDate.min = toISO(minEnd);
    if (endDate.value && new Date(endDate.value) <= sd) endDate.value = '';
  }
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
  const { url } = buildURL();
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    const prev = btnCopy.textContent;
    btnCopy.textContent = 'Copied!';
    setTimeout(() => (btnCopy.textContent = prev), 1200);
  } catch {
    window.prompt('Copy the link:', url);
  }
});

btnOpen.addEventListener('click', () => {
  const { url } = buildURL();
  if (url) window.open(url, '_blank');
});

btnReset.addEventListener('click', () => {
  country.value = '';
  lang.value = '';
  hotel.value = '';
  startDate.value = '';
  endDate.value = '';
  room.innerHTML = '';
  discount.value = '';
  advanced.checked = false;
  advancedBox.hidden = true;
  setMinDates();
  enableSequence();
  updateOutput();
});

// ===================== Init =====================
(function init() {
  setMinDates();
  populateHotels();
  enableSequence();
  populateRooms();
  updateOutput();
})();