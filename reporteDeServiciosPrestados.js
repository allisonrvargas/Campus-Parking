function renderReporteDeServicios() {
    const servicios = G('cp_serv');
    const activos = servicios.filter(s => !s.salida);
    const finalizados = servicios.filter(s => s.salida);
    const totalRecaudado = finalizados.reduce((suma, s) => suma + (s.costo || 0), 0);
    const libres = SLOTS - activos.length;