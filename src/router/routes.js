import { renderLogin, setupLogin } from "../views/auth/login";
import { renderNotFound } from "../views/auth/not-found";
import { renderRegister, setupRegister } from "../views/auth/register";
import { renderHome } from "../views/home";
import { renderTasksForm, setupTasksForm } from "../views/tasks/task-form";
import { renderTasks, setupTasks } from "../views/tasks/tasks";
import { renderAdmin, setupAdmin } from "../views/users/admin";
import { renderDashboard, setupDashboard } from "../views/users/dashboard";
import { renderProfile, setupProfile } from "../views/users/profile";

/**
 * Mapa de rutas de la aplicación.
 * Cada ruta puede tener:
 * - render: Función que devuelve el HTML de la vista.
 * - setup: (Opcional) Lógica JS que se ejecuta después de inyectar el HTML.
 * - requiresAuth: Booleano para proteger la ruta.
 * - allowedRoles: (Opcional) Array de roles permitidos para la ruta.
 * - redirectIfAuthenticated: Redirige al Dashboard si el usuario ya está logueado (ej. Login/Register).
 */
export const routes = {
    "/": {
        render: renderDashboard,
        setup: setupDashboard,
        requiresAuth: true
    },
    "/home": {
        render: renderHome,
        requiresAuth: false
    },
    "/login": {
        render: renderLogin,
        setup: setupLogin,
        requiresAuth: false,
        redirectIfAuthenticated: true,
    },
    "/register": {
        render: renderRegister,
        setup: setupRegister,
        requiresAuth: false,
        redirectIfAuthenticated: true,
    },
    "/admin": {
        render: renderAdmin,
        setup: setupAdmin,
        requiresAuth: true,
        allowedRoles: ["ADMIN"]
    },
    "/dashboard": {
        render: renderDashboard,
        setup: setupDashboard,
        requiresAuth: true,
    },
    "/tasks": {
        render: renderTasks,
        setup: setupTasks,
        requiresAuth: true,
    },
    "/tasks/new": {
        render: renderTasksForm,
        setup: setupTasksForm,
        requiresAuth: true,
    },
    "/tasks/edit": {
        render: renderTasksForm,
        setup: setupTasksForm,
        requiresAuth: true,
    },
    "/profile": {
        render: renderProfile,
        setup: setupProfile,
        requiresAuth: true,
    },
}

// Vista por defecto para rutas no encontradas
export const notFoundViews = renderNotFound