// SVG del ícono para slot libre
const SLOT_LIBRE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
  <path d="M436.19-729.27q-20.04-20.04-20.04-47.65 0-27.62 20.04-47.66 20.04-20.04 47.66-20.04 27.61 0 47.65 20.04t20.04 47.66q0 27.61-20.04 47.65t-47.65 20.04q-27.62 0-47.66-20.04ZM693.08-98.46V-280q0-9.23-5.39-14.62-5.38-5.38-14.61-5.38h-187.7q-25.3 0-43.42-18.12-18.11-18.11-18.11-43.42V-600q0-25.31 17.34-42.65Q458.54-660 483.85-660q14 0 28.03 7.81 14.04 7.81 33.27 30.04 55.77 65.23 96.81 89.34 41.04 24.12 95.73 31.27v40q-58.38-6.15-105.07-31.84-46.7-25.7-94.93-76.93v216.46h133.85q25.31 0 43.42 18.12 18.12 18.11 18.12 43.42v193.85h-40Zm-289.23 0q-74.54 0-128.04-53.5-53.5-53.5-53.5-128.04 0-69.69 45.5-120.08 45.5-50.38 116.04-59.77v40.47q-51.93 7.84-86.73 46.42-34.81 38.58-34.81 92.96 0 59.23 41.15 100.38 41.16 41.16 100.39 41.16 54.38 0 92.96-34.81 38.57-34.81 46.42-86.73h40.46q-7.84 69-59 115.27-51.15 46.27-120.84 46.27Z"/>
</svg>`;

// Obtener los slots que están ocupados actualmente
function getSlotOcupados() {
  return G('cp_serv')
    .filter(s => !s.salida)
    .map(s => s.slot);
}

// Dibujar el mapa de espacios
// clickable = true: permite seleccionar (página Registro)
// clickable = false: solo visualización (página Inicio)
function renderSlots(idContenedor, clickable) {
  const ocupados = getSlotOcupados();
  const slotSeleccionado = parseInt($('r-slot') ? $('r-slot').value : 0) || 0;
  const servicios = G('cp_serv');

  $(idContenedor).innerHTML = Array.from({ length: SLOTS }, (_, i) => {
    const n = i + 1;
    const estaOcupado = ocupados.includes(n);
    const estaSeleccionado = n === slotSeleccionado && clickable;

    let clase = estaOcupado ? 'occ' : (estaSeleccionado ? 'sel' : '');
    const icono = estaOcupado ? '🔴' : SLOT_LIBRE_SVG;
    const onclick = !estaOcupado && clickable ? `onclick="seleccionarSlot(${n})"` : '';

    let title = '';
    if (estaOcupado) {
      const encontrado = servicios.find(x => x.slot === n && !x.salida);
      if (encontrado) title = `title="Placa: ${encontrado.placa}"`;
    }

    return `<div class="slot ${clase}" ${onclick} ${title}>
      <div class="s-ic">${icono}</div>
      <div class="s-n">${n}</div>
    </div>`;
  }).join('');
}

// Seleccionar un slot desde el mapa en la página de registro
function seleccionarSlot(n) {
  $('r-slot').value = n;
  renderSlotsReg();
}

function renderSlotsReg() {
  renderSlots('slots-registro', true);
}