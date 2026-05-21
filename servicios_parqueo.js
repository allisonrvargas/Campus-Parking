// ===== REGISTRAR ENTRADA =====
function registrarEntrada() {
  const placa  = $('r-placa').value.trim().toUpperCase();
  


  // ARREGLOOOOO FINAL PARA QUE LA PLACA NOS PERMITA INGRESAR VALORES VALIDOSSSS
  const reglaPlaca = /^[PM](-)?\d{3}[A-Z]{3}$/;
  if (!reglaPlaca.test(placa)) {
    alert(" Error: La placa no es válida. Debe tener un formato como P-123ABC o M-123ABC.");
    return; 
  } 


  

  const tipo   = $('r-tipo').value;
  const fecha  = $('r-fecha').value;
  const hora   = $('r-hora').value;
  const slot   = parseInt($('r-slot').value);

  // Validaciones
  if (!placa) { alert('Ingresa la placa del vehículo'); return; }
  if (!tipo)  { alert('Selecciona un tipo de vehículo'); return; }
  if (!fecha) { alert('Selecciona la fecha');            return; }
  if (!hora)  { alert('Ingresa la hora de entrada');     return; }
  if (!slot || slot < 1 || slot > SLOTS) {
    alert('Selecciona un slot válido en el mapa');
    return;
  }

  const lista = G('cp_serv');

  // Verificar que la placa no esté activa ya
  const placaActiva = lista.find(s => s.placa === placa && !s.salida);
  if (placaActiva) {
    alert('Esa placa ya tiene un servicio activo');
    return;
  }

  // Verificar que el slot no esté ocupado
  const slotOcupado = lista.find(s => s.slot === slot && !s.salida);
  if (slotOcupado) {
    alert('Ese slot ya está ocupado, elige otro');
    return;
  }

  // Guardar el nuevo servicio
  lista.push({ placa, tipo, fecha, entrada: hora, slot, salida: null, costo: null });
  S('cp_serv', lista);

  // Limpiar formulario
  $('r-placa').value = '';
  $('r-slot').value  = '';
  $('r-fecha').value = '';
  $('r-hora').value  = '';

  alert(`✅ Entrada registrada: ${placa} en slot ${slot}`);
  renderSlotsReg();
}

// ===== MOSTRAR TABLA DE SERVICIOS =====
function mostrarServicios() {
  const lista = G('cp_serv');

  if (lista.length === 0) {
    $('tb-serv').innerHTML = '<tr class="empty-row"><td colspan="8">No hay servicios registrados aún.</td></tr>';
    return;
  }

  $('tb-serv').innerHTML = lista.slice().reverse().map((s, iRev) => {
    // El índice real en el array original (no invertido)
    const iReal = lista.length - 1 - iRev;
    const activo = !s.salida;

    return `<tr>
      <td><strong>${s.placa}</strong></td>
      <td>${s.tipo}</td>
      <td>${s.fecha}</td>
      <td>${s.entrada}</td>
      <td>${s.slot}</td>
      <td><span class="badge ${activo ? 'b-act' : 'b-fin'}">${activo ? 'Activo' : 'Finalizado'}</span></td>
      <td>${s.costo !== null ? 'Q' + fmt(s.costo) : '—'}</td>
      <td>
        ${activo
          ? `<button class="btn btn-g btn-sm" onclick="abrirSalida(${iReal})">🚗 Salida</button>`
          : '<span style="color:var(--muted);font-size:0.82rem;">Completado</span>'}
      </td>
    </tr>`;
  }).join('');
}

// ===== ABRIR MODAL DE SALIDA =====
function abrirSalida(i) {
  indiceServicioActivo = i;
  const s = G('cp_serv')[i];
  $('m-placa-lbl').textContent = s.placa;
  $('m-salida').value = '';
  $('m-costo').style.display = 'none';
  abrirModal('mod-salida');
}

// ===== CALCULAR COSTO Y CERRAR SERVICIO (soporta cambio de día / medianoche) =====
function calcularSalida() {
  const horaSalida = $('m-salida').value;
  if (!horaSalida) {
    alert('Por favor ingresa la hora de salida');
    return;
  }

  const lista    = G('cp_serv');
  const servicio = lista[indiceServicioActivo];

  // 1. Crear objetos Date combinando fecha del registro con las horas
  const momentoEntrada = new Date(`${servicio.fecha}T${servicio.entrada}`);
  let   momentoSalida  = new Date(`${servicio.fecha}T${horaSalida}`);

  // 2. Si la salida es menor o igual a la entrada, el vehículo salió al día siguiente
  if (momentoSalida <= momentoEntrada) {
    momentoSalida.setDate(momentoSalida.getDate() + 1);
  }

  // 3. Diferencia exacta en horas
  const horas = (momentoSalida - momentoEntrada) / (1000 * 60 * 60);

  // 4. Tarifa
  const tipos       = G('cp_tipos');
  const tipoVehiculo = tipos.find(v => v.codigo === servicio.tipo);
  const tarifa      = tipoVehiculo ? tipoVehiculo.tarifa : 0;
  const costo       = horas * tarifa;

  // 5. Guardar
  servicio.salida = horaSalida;
  servicio.costo  = costo;
  S('cp_serv', lista);

  // 6. Mostrar resultado en el modal
  $('m-costo').innerHTML = `
    <div>Tiempo Total: <strong>${horas.toFixed(2)} hrs</strong></div>
    <div style="font-size:1.3rem;margin-top:5px;">Total a Pagar: <strong>Q${fmt(costo)}</strong></div>
  `;
  $('m-costo').style.display = 'block';

  mostrarServicios();
}