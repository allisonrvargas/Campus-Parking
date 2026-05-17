// Guardar nuevo tipo de vehículo
function guardarTipo() {
  const codigo = $('tv-cod').value.trim().toUpperCase();
  const nombre = $('tv-nom').value.trim();
  const tarifa = parseFloat($('tv-tar').value);

  if (!codigo || !nombre || isNaN(tarifa)) {
    alert('Por favor completa todos los campos');
    return;
  }

  const lista = G('cp_tipos');

  const yaExiste = lista.find(v => v.codigo === codigo);
  if (yaExiste) {
    alert('Ese código ya existe, elige otro');
    return;
  }

  lista.push({ codigo, nombre, tarifa });
  S('cp_tipos', lista);

  $('tv-cod').value = '';
  $('tv-nom').value = '';
  $('tv-tar').value = '';

  mostrarTipos();
}

// Mostrar tabla de tipos
function mostrarTipos() {
  const lista = G('cp_tipos');

  if (lista.length === 0) {
    $('tb-tipos').innerHTML = '<tr class="empty-row"><td colspan="4">No hay tipos registrados aún.</td></tr>';
    return;
  }

  $('tb-tipos').innerHTML = lista.map((v, i) => `
    <tr>
      <td><strong>${v.codigo}</strong></td>
      <td>${v.nombre}</td>
      <td>Q${fmt(v.tarifa)}/h</td>
      <td>
        <button class="btn btn-gr btn-sm" onclick="editarTipo(${i})">✏️ Editar</button>
        <button class="btn btn-d btn-sm" onclick="borrarTipo(${i})">🗑️ Eliminar</button>
      </td>
    </tr>
  `).join('');
}

// Abrir modal para editar un tipo
function editarTipo(i) {
  const v = G('cp_tipos')[i];
  $('et-idx').value = i;
  $('et-cod').value = v.codigo;
  $('et-nom').value = v.nombre;
  $('et-tar').value = v.tarifa;
  abrirModal('mod-et');
}

// Guardar cambios del tipo editado
function actualizarTipo() {
  const i = parseInt($('et-idx').value);
  const lista = G('cp_tipos');

  lista[i].codigo = $('et-cod').value.trim().toUpperCase();
  lista[i].nombre = $('et-nom').value.trim();
  lista[i].tarifa = parseFloat($('et-tar').value);

  S('cp_tipos', lista);
  cerrarModal('mod-et');
  mostrarTipos();
}

// Eliminar un tipo
function borrarTipo(i) {
  if (!confirm('¿Seguro que deseas eliminar este tipo?')) return;
  const lista = G('cp_tipos');
  lista.splice(i, 1);
  S('cp_tipos', lista);
  mostrarTipos();
}

// Llenar el select de tipos en el formulario de registro
function cargarTiposSelect() {
  const lista = G('cp_tipos');

  if (lista.length === 0) {
    $('r-tipo').innerHTML = '<option value="">-- Primero crea un tipo de vehículo --</option>';
    return;
  }

  $('r-tipo').innerHTML = lista.map(v =>
    `<option value="${v.codigo}">${v.nombre} — Q${fmt(v.tarifa)}/h</option>`
  ).join('');
}

// Alias para compatibilidad con interfaz.js
function renderTipos() {
  mostrarTipos();
}