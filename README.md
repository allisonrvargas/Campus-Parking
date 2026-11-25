# 💜 Campus Parking 🚗✨

<p align="center">
  <img src="https://img.shields.io/badge/Status-Complete-ff6b35?style=for-the-badge&logo=checkmark" alt="Status"/>
  <img src="https://img.shields.io/badge/Level-Junior%20Advanced-a84bb1?style=for-the-badge" alt="Level"/>
  <img src="https://img.shields.io/badge/Made%20with-Vanilla%20JS-f74ff7?style=for-the-badge&logo=javascript" alt="JS"/>
</p>

<p align="center">
  <b>Un sistema interactivo, estético y responsivo para la gestión y administración de estacionamientos en tiempo récord.</b><br/>
  <i>Diseñado con una interfaz SPA (Single Page Application) limpia, moderna y con hermosos tonos morados y rosados. 🦄🔮</i>
</p>

---

## 🌟 Características Principales

* 🔐 **Autenticación Integrada:** Control de acceso seguro para el administrador con personalización de perfil en tiempo real.
* 🗺️ **Mapa de Slots Interactivo:** Visualización dinámica de 20 espacios de parqueo en vivo (Estados: Disponible 🟢 / Ocupado 🔴 / Seleccionado 🟣).
* ⚠️ **Alertas Inteligentes:** Sistema predictivo que despliega un banner animado (`pulseAlert`) cuando quedan menos de 5 espacios disponibles.
* 🚗 **Tarifas Personalizables:** CRUD completo de tipos de vehículos y tarifas por hora con persistencia instantánea.
* ⏱️ **Liquidación Automatizada:** Cálculo inteligente de costos basado en la diferencia exacta de tiempo (¡incluyendo soporte para turnos de medianoche! 🌙).
* 💾 **Persistencia Local:** Sincronización transparente de todas las operaciones mediante `localStorage`.

---

## 🛠️ Tecnologías Utilizadas

Para lograr esta interfaz fluida y ligera, no se utilizaron frameworks pesados, ¡puro poder nativo! 💪✨

* HTML5 Semántico
* CSS3 Avanzado (Variables nativas `:root`, Flexbox, Grid y animaciones `@keyframes`)
* Vanilla JavaScript (ES6+)
* Fuentes de Google (*Outfit*)

---

## 📂 Estructura del Proyecto

El código está modularizado de forma limpia para facilitar su mantenimiento y escalabilidad:

```text
├── index.html                    # Estructura principal y contenedores SPA
├── style.css                     # Paleta de colores, tipografía y layouts responsivos
├── principal.js                  # Helpers de LocalStorage, utilidades y hash de contraseñas
├── interfaz.js                   # Navegación entre secciones y modales
├── autenticacion.js              # Inicio de sesión y edición de perfil
├── panel_inicio.js               # Tablero de control, estadísticas y alertas dinámicas
├── espacios.js                   # Mapa interactivo de espacios de parqueo
├── servicios_parqueo.js          # Ingresos, salidas y cálculo de cobros
├── tipos_de_vehiculos.js         # Administración de tarifas y categorías
└── reporteDeServiciosPrestados.js # Reporte de servicios prestados
```

---

## ▶️ Cómo ejecutarlo

**Demo en línea:** https://allisonrvargas.github.io/Campus-Parking/

O en local, sin instalar nada: descarga o clona el repositorio y abre `index.html` en el navegador.

**Cuenta de demostración:** `admin@campusparking.com` / `Admin123`

---

## 🔐 Sobre la seguridad

Es una aplicación **solo de navegador** (sin servidor), pensada como proyecto de práctica:

- La contraseña no se guarda en texto plano: se almacena como **hash SHA-256 con sal** en `localStorage`. Si el navegador tenía un usuario guardado con la versión anterior, se migra automáticamente al iniciar sesión.
- Aun así, como no hay backend, **no es un sistema de autenticación real**: cualquiera con acceso al navegador puede leer o borrar los datos de `localStorage`. Para un uso real haría falta un servidor con sesiones.

---

## 💖 Créditos y Autoría

Desarrollado con mucho café, lógica y estilo por Allison. ✨👩‍💻

## 📄 Licencia

MIT