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

const SLOTS = 20;
let indiceServicioActivo = null;

// Crear usuario por defecto si no existe
if (!localStorage.getItem('cp_u')) {
  S('cp_u', {
    nombre: 'Admin',
    email: 'admin@campusparking.com',
    password: 'Admin123'
  });
}