import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { abrirApp, iniciarSesion, crearTipo, registrarEntrada, cerrarTodas } from './ayudante.js';

afterEach(cerrarTodas);

test('el usuario de demostración inicia sesión y una contraseña incorrecta no', async () => {
    const mala = await abrirApp();
    assert.equal(await iniciarSesion(mala, 'admin@campusparking.com', 'incorrecta'), false);
    assert.equal(mala.$('li-err').style.display, 'block');

    const buena = await abrirApp();
    assert.equal(await iniciarSesion(buena), true);
});

test('la contraseña se guarda como hash con sal, nunca en texto plano', async () => {
    const app = await abrirApp();
    const u = app.leer('cp_u');
    assert.equal(u.password, undefined);
    assert.match(u.hash, /^[0-9a-f]{64}$/);
    assert.match(u.sal, /^[0-9a-f]{32}$/);
    assert.ok(!JSON.stringify(u).includes('Admin123'));
});

test('un usuario guardado con la versión antigua (texto plano) se migra al iniciar sesión', async () => {
    const app = await abrirApp({ almacenamiento: { cp_u: JSON.stringify({ nombre: 'Vieja', email: 'vieja@x.com', password: 'Clave123' }) } });
    assert.equal(await iniciarSesion(app, 'vieja@x.com', 'Clave123'), true);
    const u = app.leer('cp_u');
    assert.equal(u.password, undefined);
    assert.ok(u.hash && u.sal);
});

test('crear tipos de vehículo: guarda, rechaza campos vacíos y códigos repetidos', async () => {
    const app = await abrirApp();
    crearTipo(app, 'carro', 'Carro', 8);
    assert.deepEqual(app.leer('cp_tipos'), [{ codigo: 'CARRO', nombre: 'Carro', tarifa: 8 }]);

    crearTipo(app, '', '', '');
    assert.match(app.alertas.at(-1), /completa todos los campos/);

    crearTipo(app, 'CARRO', 'Otro', 5);
    assert.match(app.alertas.at(-1), /ya existe/);
    assert.equal(app.leer('cp_tipos').length, 1);
});

test('la placa debe cumplir el formato guatemalteco (P-123ABC o M-123ABC)', async () => {
    const app = await abrirApp();
    crearTipo(app, 'CARRO', 'Carro', 8);
    for (const placa of ['ABC123', 'P-12ABC', 'X-123ABC', '']) {
        registrarEntrada(app, { placa, tipo: 'CARRO', slot: 1 });
        assert.match(app.alertas.at(-1), /placa no es válida/, `aceptó "${placa}"`);
    }
    assert.equal((app.leer('cp_serv') ?? []).length, 0);
    registrarEntrada(app, { placa: 'p123abc', tipo: 'CARRO', slot: 1 });
    assert.equal(app.leer('cp_serv')[0].placa, 'P123ABC');
});

test('no permite repetir una placa activa ni usar un espacio ocupado', async () => {
    const app = await abrirApp();
    crearTipo(app, 'CARRO', 'Carro', 8);
    registrarEntrada(app, { placa: 'P-123ABC', tipo: 'CARRO', slot: 3 });
    registrarEntrada(app, { placa: 'P-123ABC', tipo: 'CARRO', slot: 4 });
    assert.match(app.alertas.at(-1), /placa ya tiene un servicio activo/);
    registrarEntrada(app, { placa: 'M-456DEF', tipo: 'CARRO', slot: 3 });
    assert.match(app.alertas.at(-1), /slot ya está ocupado/);
    assert.equal(app.leer('cp_serv').length, 1);
});

test('el espacio debe estar entre 1 y 20', async () => {
    const app = await abrirApp();
    crearTipo(app, 'CARRO', 'Carro', 8);
    registrarEntrada(app, { placa: 'P-123ABC', tipo: 'CARRO', slot: 21 });
    assert.match(app.alertas.at(-1), /slot válido/);
});

test('calcula el costo por horas exactas (2.5 h x Q8 = Q20)', async () => {
    const app = await abrirApp();
    crearTipo(app, 'CARRO', 'Carro', 8);
    registrarEntrada(app, { placa: 'P-123ABC', tipo: 'CARRO', hora: '10:00', slot: 1 });
    app.window.abrirSalida(0);
    app.$('m-salida').value = '12:30';
    app.window.calcularSalida();
    const s = app.leer('cp_serv')[0];
    assert.equal(s.salida, '12:30');
    assert.equal(s.costo, 20);
    assert.match(app.$('m-costo').textContent, /2\.50 hrs/);
});

test('soporta turnos de medianoche (23:00 a 01:00 = 2 h)', async () => {
    const app = await abrirApp();
    crearTipo(app, 'MOTO', 'Moto', 5);
    registrarEntrada(app, { placa: 'M-456DEF', tipo: 'MOTO', hora: '23:00', slot: 2 });
    app.window.abrirSalida(0);
    app.$('m-salida').value = '01:00';
    app.window.calcularSalida();
    assert.equal(app.leer('cp_serv')[0].costo, 10);
});

test('calcularSalida exige la hora de salida', async () => {
    const app = await abrirApp();
    crearTipo(app, 'CARRO', 'Carro', 8);
    registrarEntrada(app, { placa: 'P-123ABC', tipo: 'CARRO', slot: 1 });
    app.window.abrirSalida(0);
    app.$('m-salida').value = '';
    app.window.calcularSalida();
    assert.match(app.alertas.at(-1), /hora de salida/);
    assert.equal(app.leer('cp_serv')[0].salida, null);
});

test('seguridad: el HTML escrito en un tipo de vehículo no se interpreta (XSS)', async () => {
    const app = await abrirApp();
    crearTipo(app, 'XSS', '<img src=x onerror="window.hackeado=1">Carro', 8);
    app.window.mostrarTipos();
    app.window.cargarTiposSelect();
    assert.equal(app.document.querySelectorAll('#tb-tipos img').length, 0, 'se creó una etiqueta <img> en la tabla');
    assert.equal(app.document.querySelectorAll('#r-tipo img').length, 0, 'se creó una etiqueta <img> en el selector');
    assert.match(app.$('tb-tipos').textContent, /<img src=x/);
    assert.equal(app.window.hackeado, undefined);
});

test('esc escapa los cinco caracteres peligrosos', async () => {
    const app = await abrirApp();
    assert.equal(app.window.esc(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
    assert.equal(app.window.esc(null), '');
});

test('la tabla de ganancias muestra las horas reales, también en turnos de medianoche', async () => {
    const app = await abrirApp();
    crearTipo(app, 'MOTO', 'Moto', 5);
    registrarEntrada(app, { placa: 'M-456DEF', tipo: 'MOTO', hora: '23:00', slot: 2 });
    app.window.abrirSalida(0);
    app.$('m-salida').value = '01:00';
    app.window.calcularSalida();
    app.window.renderGanancias();
    assert.match(app.$('tb-gan').textContent, /2\.00h/);
    assert.match(app.$('g-total-val').textContent, /Q10/);
});

test('todos los scripts que carga index.html existen y se ejecutan sin errores', async () => {
    const app = await abrirApp(); // lanza si algún script tiene un error de sintaxis o de ejecución
    for (const nombre of ['doLogin', 'guardarTipo', 'registrarEntrada', 'calcularSalida', 'renderGanancias', 'goTo']) {
        assert.equal(typeof app.window[nombre], 'function', `falta la función ${nombre}`);
    }
});