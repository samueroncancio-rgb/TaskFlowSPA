# Walkthrough de Mejoras - TaskFlowSPA

En este documento se explican los cambios realizados para mejorar la arquitectura, estabilidad y seguridad del proyecto.

## 1. Centralización de la Sesión (`auth.service.js`)
**¿Qué se hizo?**
* Se unificaron todas las operaciones de `localStorage` en un solo archivo.
* Se creó una constante `USER_KEY` única para evitar errores de dedo (antes se usaba `"user"` y `"SESSION-ACTUAL"` de forma mezclada).

**¿Por qué?**
Si cada vista intenta leer o escribir en el almacenamiento por su cuenta, es muy fácil que el nombre de la clave cambie o que los datos no estén sincronizados. Ahora, si queremos cambiar de `localStorage` a `sessionStorage` o `Cookies`, solo tenemos que editar este archivo.

## 2. Protección de Rutas en el Router (`router.js`)
**¿Qué se hizo?**
* Se implementó lógica de validación antes de renderizar cualquier vista.
* **requiresAuth:** Si la ruta lo requiere y no hay sesión, manda al usuario al `/login`.
* **allowedRoles:** Si la ruta pide el rol `ADMIN` y el usuario es `USER`, lo devuelve al dashboard.
* **redirectIfAuthenticated:** Si un usuario ya logueado intenta ir a `/login`, lo manda al dashboard directamente.

**¿Por qué?**
Antes, el enrutador simplemente "dibujaba" lo que pedía la URL. Un usuario malintencionado podía entrar a secciones privadas sin permiso. Ahora el sistema actúa como un "guardia" que verifica las credenciales antes de dejar pasar a alguien.

## 3. Corrección de Enlaces y Typos
**¿Qué se hizo?**
* Se corrigieron errores ortográficos en variables (`notFoundWeiws` -> `notFoundViews`).
* Se eliminaron llamadas a `setupLogin` en rutas que no eran de login (como `/admin`).

**¿Por qué?**
Los typos rompen el código. Al estandarizar los nombres, el código es más fácil de leer y depurar.

## 4. Componente de Header Reutilizable (`Header.js`) y Principio DRY
**¿Qué se hizo?**
* Se creó un componente centralizado para la navegación.
* Se eliminó el HTML del encabezado de 5 archivos distintos (`dashboard`, `tasks`, `admin`, `profile`, `task-form`) y se reemplazó por `${Header()}`.
* El enrutador (`router.js`) ahora inicializa automáticamente el Header en cada cambio de página.

**¿Por qué?**
Tener el mismo código de navegación copiado en múltiples archivos es un riesgo de mantenimiento. Al aplicar el principio **DRY (Don't Repeat Yourself)**, cualquier cambio en el menú o la lógica de logout se hace en **un solo lugar** y se refleja en toda la aplicación instantáneamente.

## 5. Mejora en el Flujo de Login
**¿Qué se hizo?**
* Se actualizó `login.js` para usar las funciones del servicio centralizado.
* Se agregó un mensaje de alerta si las credenciales son incorrectas (antes no pasaba nada).

**¿Por qué?**
El usuario necesita saber por qué no puede entrar. Además, al usar `crearSesion()`, nos aseguramos de que los datos se guarden exactamente como el resto de la app espera.

---
### Próximos pasos sugeridos:
* Mover el Header a todas las vistas de usuario.
* Implementar `try...catch` en los servicios de tareas para manejar errores de servidor.
* Separar la URL de la API en un archivo de configuración.
