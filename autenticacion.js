// Login
function doLogin() {
  const email = $('li-email').value.trim();
  const pass = $('li-pass').value;
  const usuario = G('cp_u', null);

  if (usuario && email === usuario.email && pass === usuario.password) {
    $('page-login').classList.add('hidden');
    $('app').classList.add('visible');
    $('tb-user').textContent = (usuario.nombre || 'A')[0].toUpperCase();
    mostrarFecha();
    cargarTiposSelect();
    // Esperar a que el navegador pinte el #app antes de renderizar los slots
    requestAnimationFrame(() => {
      renderInicio();
    });
  } else {
    $('li-err').style.display = 'block';
  }
}

// Logout
function doLogout() {
  $('page-login').classList.remove('hidden');
  $('app').classList.remove('visible');
  $('li-email').value = '';
  $('li-pass').value = '';
  $('li-err').style.display = 'none';
}

// Abrir modal de perfil con los datos actuales
function abrirPerfil() {
  const usuario = G('cp_u', {});
  $('p-nom').value = usuario.nombre || '';
  $('p-email').value = usuario.email || '';
  $('p-pass').value = '';
  $('p-pass-actual').value = '';
  $('p-err').style.display = 'none';
  $('p-ok').style.display = 'none';
  abrirModal('mod-perfil');
}

// Guardar cambios del perfil
function guardarPerfil() {
  const usuario = G('cp_u', {});
  const passActual = $('p-pass-actual').value;
  const nuevoNombre = $('p-nom').value.trim();
  const nuevoEmail = $('p-email').value.trim();
  const nuevaPass = $('p-pass').value;

  if (passActual !== usuario.password) {
    $('p-err').textContent = 'Contraseña actual incorrecta';
    $('p-err').style.display = 'block';
    $('p-ok').style.display = 'none';
    return;
  }

  if (!nuevoNombre || !nuevoEmail) {
    $('p-err').textContent = 'El nombre y el email son obligatorios';
    $('p-err').style.display = 'block';
    return;
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(nuevoEmail)) {
    $('p-err').textContent = 'Formato de email no válido';
    $('p-err').style.display = 'block';
    return;
  }

  usuario.nombre = nuevoNombre;
  usuario.email = nuevoEmail;
  if (nuevaPass !== '') {
    usuario.password = nuevaPass;
  }

  S('cp_u', usuario);
  $('tb-user').textContent = nuevoNombre[0].toUpperCase();
  $('p-err').style.display = 'none';
  $('p-ok').style.display = 'block';

  setTimeout(() => cerrarModal('mod-perfil'), 1200);
}