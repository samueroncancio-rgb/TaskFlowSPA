/**
 * Servicio encargado de gestionar la persistencia de la sesión del usuario.
 * Utiliza localStorage para que la sesión se mantenga incluso al recargar la página.
 */

const USER_KEY = "TASKFLOW_USER";

/**
 * Guarda los datos del usuario en la memoria local para iniciar sesión.
 * @param {Object} user - Objeto con los datos del usuario.
 */
export function crearSesion(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Obtiene los datos del usuario actual desde la memoria local.
 * @returns {Object|null} El objeto del usuario si existe sesión, de lo contrario null.
 */
export function obtenerSesion() {
    const sesionJSON = localStorage.getItem(USER_KEY);
    return sesionJSON ? JSON.parse(sesionJSON) : null;
}

/**
 * Elimina los datos de sesión de la memoria local para cerrar la sesión.
 */
export function destruirSesion() {
    localStorage.removeItem(USER_KEY);
}

/**
 * Alias de obtenerSesion para mejorar la semántica del código.
 * @returns {Object|null}
 */
export function getCurrentUser() {
    return obtenerSesion();
}
