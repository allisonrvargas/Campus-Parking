// Calcular costo y cerrar el servicio (Soporta cambio de día / medianoche)
function calcularSalida() {
  const horaSalida = $('m-salida').value;
  if (!horaSalida) {
    alert('Por favor ingresa la hora de salida');
    return;
  }

  const lista = G('cp_serv');
  const servicio = lista[indiceServicioActivo];

  // 1. Crear objetos Date reales combinando la fecha del registro con las horas
  // Formato esperado: "YYYY-MM-DD" + "T" + "HH:MM"
  const momentoEntrada = new Date(`${servicio.fecha}T${servicio.entrada}`);
  let momentoSalida = new Date(`${servicio.fecha}T${horaSalida}`);

  // 2. TRUCO DE MEDIANOCHE: Si la hora de salida es menor numéricamente a la de entrada,
  // asumimos automáticamente que el vehículo salió al día siguiente.
  if (momentoSalida <= momentoEntrada) {
    momentoSalida.setDate(momentoSalida.getDate() + 1);
  }

  // 3. Calcular la diferencia exacta en horas utilizando milisegundos
  // (1 hora = 1000ms * 60s * 60m)
  const diferenciaMilisegundos = momentoSalida - momentoEntrada;
  const horas = diferenciaMilisegundos / (1000 * 60 * 60);

  // 4. Buscar tarifa y procesar el cobro
  const tipos = G('cp_tipos');
  const tipoVehiculo = tipos.find(v => v.codigo === servicio.tipo);
  const tarifa = tipoVehiculo ? tipoVehiculo.tarifa : 0;

  const costo = horas * tarifa;

  // 5. Guardar datos en el estado
  servicio.salida = horaSalida;
  servicio.costo = costo;
  S('cp_serv', lista);

  // 6. Mostrar el resultado en el modal
  const cajaCosto = $('m-costo');
  cajaCosto.innerHTML = `
    <div>Tiempo Total: <strong>${horas.toFixed(2)} hrs</strong></div>
    <div style="font-size: 1.3rem; margin-top: 5px;">Total a Pagar: <strong>Q${fmt(costo)}</strong></div>
  `;
  cajaCosto.style.display = 'block';

  // Si tienes una función para refrescar las tablas visuales de inmediato, llámala aquí:
  if (typeof mostrarServicios === 'function') mostrarServicios();
}