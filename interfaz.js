// Títulos de cada sección para la topbar
const TITULOS = {
  'pg-inicio':    'Inicio',
  'pg-registro':  'Registro',
  'pg-servicios': 'Servicios',
  'pg-tipos':     'Tipos de Vehículos',
  'pg-ganancias': 'Ganancias'
};

// Navegar entre páginas
function goTo(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));

  $(id).classList.add('active');
  $('nav-' + id).classList.add('active');
  $('tb-title').textContent = TITULOS[id] || '';

  if (id === 'pg-inicio')    renderInicio();
  if (id === 'pg-registro')  { cargarTiposSelect(); renderSlotsReg(); }
  if (id === 'pg-servicios') mostrarServicios();
  if (id === 'pg-tipos')     mostrarTipos();
  if (id === 'pg-ganancias') renderGanancias();
}

// Abrir modal
function abrirModal(id) {
  $(id).classList.add('open');
}

// Cerrar modal
function cerrarModal(id) {
  $(id).classList.remove('open');
  const cajaCosto = $('m-costo');
  if (cajaCosto) cajaCosto.style.display = 'none';
}

// Mostrar fecha y hora en la topbar
function mostrarFecha() {
  const ahora = new Date();
  $('tb-date').textContent =
    ahora.toLocaleDateString('es-GT', { weekday: 'short', day: 'numeric', month: 'short' }) +
    ' · ' +
    ahora.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
}

setInterval(mostrarFecha, 30000);