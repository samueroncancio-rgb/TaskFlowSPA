const USER_KEY = "TASKFLOW_USER";

export function crearSesion(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function obtenerSesion() {
    const sesionJSON = localStorage.getItem(USER_KEY);
    return sesionJSON ? JSON.parse(sesionJSON) : null;
}

export function destruirSesion() {
    localStorage.removeItem(USER_KEY);
}

export function getCurrentUser() {
    return obtenerSesion();
}
