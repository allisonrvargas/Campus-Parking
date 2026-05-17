// Mostrar alerta si quedan pocos slots disponibles
function verificarAlertaSlots(libres) {
  let alerta = $('alerta-slots');

  if (libres < 5) {
    if (!alerta) {
      alerta = document.createElement('div');
      alerta.id = 'alerta-slots';
      alerta.style.cssText = `
        background: linear-gradient(135deg, #ff6b35, #ef4444);
        color: #fff;
        border-radius: 12px;
        padding: 14px 20px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        box-shadow: 0 4px 16px rgba(239,68,68,0.35);
        animation: pulseAlert 1.5s ease-in-out infinite;
      `;
      const statsGrid = $('stats-grid');
      statsGrid.parentNode.insertBefore(alerta, statsGrid);
    }
    const plural = libres === 1 ? '' : 's';
    alerta.innerHTML = `
      <span style="font-size:1.6rem;">⚠️</span>
      <div>
        <div>¡Slots casi llenos! Solo quedan <strong>${libres} slot${plural} libre${plural}</strong></div>
        <div style="font-size:0.78rem;opacity:0.85;font-weight:400;margin-top:2px;">Considera gestionar las salidas pendientes</div>
      </div>
    `;
  } else {
    if (alerta) alerta.remove();
  }
}

// Dashboard - página de inicio
function renderInicio() {
  const servicios = G('cp_serv');
  const activos = servicios.filter(s => !s.salida);
  const finalizados = servicios.filter(s => s.salida);
  const totalRecaudado = finalizados.reduce((suma, s) => suma + (s.costo || 0), 0);
  const libres = SLOTS - activos.length;

  verificarAlertaSlots(libres);

  const estiloSlots = libres < 5 ? 'border:2px solid #ef4444;' : '';
  const estiloValor = libres < 5 ? 'color:#ef4444;' : '';

  $('stats-grid').innerHTML = `
    <div class="stat">
      <div class="s-ico"><img src="imagenes/vehiculos-activos.svg" style="width:40px;height:40px;"/></div>
      <div class="s-val">${activos.length}</div>
      <div class="s-lbl">Vehículos activos</div>
    </div>
    <div class="stat" style="${estiloSlots}">
      <div class="s-ico"><img src="imagenes/slots-disponibles.svg" style="width:40px;height:40px;"/></div>
      <div class="s-val" style="${estiloValor}">${libres}</div>
      <div class="s-lbl">Slots disponibles</div>
    </div>
    <div class="stat">
      <div class="s-ico"><img src="imagenes/finalizados.svg" style="width:40px;height:40px;"/></div>
      <div class="s-val">${finalizados.length}</div>
      <div class="s-lbl">Servicios finalizados</div>
    </div>
    <div class="stat">
      <div class="s-ico"><img src="imagenes/recaudado.svg" style="width:40px;height:40px;"/></div>
      <div class="s-val">Q${fmt(totalRecaudado)}</div>
      <div class="s-lbl">Total recaudado</div>
    </div>
  `;

  renderSlots('slots-inicio', false);
}

// Página de ganancias
function renderGanancias() {
  const finalizados = G('cp_serv').filter(s => s.salida);
  const total = finalizados.reduce((suma, s) => suma + (s.costo || 0), 0);

  $('g-total-val').textContent = 'Q' + fmt(total);

  if (finalizados.length === 0) {
    $('tb-gan').innerHTML = '<tr class="empty-row"><td colspan="7">Sin ganancias todavía</td></tr>';
    return;
  }

  $('tb-gan').innerHTML = finalizados.slice().reverse().map(s => {
    const [h1, m1] = s.entrada.split(':').map(Number);
    const [h2, m2] = s.salida.split(':').map(Number);
    const horas = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;

    return `<tr>
      <td>${s.placa}</td>
      <td>${s.tipo}</td>
      <td>${s.fecha}</td>
      <td>${s.entrada}</td>
      <td>${s.salida}</td>
      <td>${fmt(horas, 2)}h</td>
      <td><strong>Q${fmt(s.costo)}</strong></td>
    </tr>`;
  }).join('');
}