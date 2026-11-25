// Carga la aplicación real (index.html y sus scripts, en el mismo orden que el navegador) dentro de jsdom.
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const abiertas = [];

// jsdom mantiene temporizadores vivos: hay que cerrar cada ventana para que el proceso de pruebas termine
export function cerrarTodas() {
    for (const w of abiertas.splice(0)) w.close();
}

export async function abrirApp({ almacenamiento } = {}) {
    const html = readFileSync(join(raiz, 'index.html'), 'utf8');
    const scripts = [...html.matchAll(/<script\s+src="([^"]+)"><\/script>/g)].map((m) => m[1]);
    const alertas = [];

    const dom = new JSDOM(html.replace(/<script\s+src="[^"]+"><\/script>/g, ''), {
        url: 'http://localhost/',
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        beforeParse(w) {
            w.alert = (m) => alertas.push(String(m));
            w.confirm = () => true;
            Object.defineProperty(w, 'crypto', { value: webcrypto, configurable: true });
            w.TextEncoder = TextEncoder;
            for (const [k, v] of Object.entries(almacenamiento ?? {})) w.localStorage.setItem(k, v);
        }
    });
    const { window } = dom;
    abiertas.push(window);
    // Cada script se inserta como <script> clásico, igual que en el navegador: así comparten las constantes globales
    // (un eval() aislaría los const/let de cada archivo).
    for (const s of scripts) {
        const el = window.document.createElement('script');
        el.textContent = readFileSync(join(raiz, s), 'utf8');
        window.document.body.appendChild(el);
    }
    await window.eval('usuarioDemoListo');
    return { window, document: window.document, alertas, $: (id) => window.document.getElementById(id), leer: (k) => JSON.parse(window.localStorage.getItem(k)) };
}

export async function iniciarSesion(app, email = 'admin@campusparking.com', clave = 'Admin123') {
    app.$('li-email').value = email;
    app.$('li-pass').value = clave;
    await app.window.doLogin();
    return app.$('app').classList.contains('visible');
}

export function crearTipo(app, codigo, nombre, tarifa) {
    app.$('tv-cod').value = codigo;
    app.$('tv-nom').value = nombre;
    app.$('tv-tar').value = String(tarifa);
    app.window.guardarTipo();
}

export function registrarEntrada(app, { placa, tipo, fecha = '2026-06-10', hora = '10:00', slot }) {
    app.window.cargarTiposSelect(); // lo mismo que hace la pantalla de registro al abrirse
    app.$('r-placa').value = placa;
    app.$('r-tipo').value = tipo;
    app.$('r-fecha').value = fecha;
    app.$('r-hora').value = hora;
    app.$('r-slot').value = String(slot);
    app.window.registrarEntrada();
}