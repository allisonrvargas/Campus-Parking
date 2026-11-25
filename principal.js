// Obtener dato de localStorage
function G(key, defecto) {
  if (defecto === undefined) defecto = [];
  const dato = localStorage.getItem(key);
  if (dato === null) return defecto;
  return JSON.parse(dato);
}

// Guardar dato en localStorage
function S(key, valor) {
  localStorage.setItem(key, JSON.stringify(valor));
}

// Shortcut para getElementById
function $(id) {
  return document.getElementById(id);
}

// Formatear números con punto decimal (Guatemala)
function fmt(num, decimales) {
  if (decimales === undefined) decimales = 0;
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  });
}

// Escapa texto antes de ponerlo en innerHTML, para que lo escrito por el usuario nunca se interprete como HTML
function esc(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const SLOTS = 20;
let indiceServicioActivo = null;

// ---- Contraseñas: se guardan como hash SHA-256 con sal, nunca en texto plano ----
async function hashClave(clave, sal) {
  const datos = new TextEncoder().encode(sal + ':' + clave);
  const resumen = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(resumen)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function nuevaSal() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function claveCorrecta(usuario, clave) {
  if (!usuario) return false;
  if (usuario.hash) return (await hashClave(clave, usuario.sal)) === usuario.hash;
  // Usuarios guardados con la versión anterior (contraseña en texto plano): se migran al validar
  if (usuario.password !== undefined && usuario.password === clave) {
    usuario.sal = nuevaSal();
    usuario.hash = await hashClave(clave, usuario.sal);
    delete usuario.password;
    S('cp_u', usuario);
    return true;
  }
  return false;
}

// Crear el usuario de demostración si no existe (admin@campusparking.com / Admin123, documentado en el README)
async function crearUsuarioDemo() {
  if (localStorage.getItem('cp_u')) return;
  const sal = nuevaSal();
  S('cp_u', {
    nombre: 'Admin',
    email: 'admin@campusparking.com',
    sal: sal,
    hash: await hashClave('Admin123', sal)
  });
}
const usuarioDemoListo = crearUsuarioDemo();