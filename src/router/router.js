import { getCurrentUser, destruirSesion } from "../services/auth.service";
import { notFoundViews, routes } from "./routes";

/**
 * Función encargada de renderizar la vista correspondiente a la ruta actual.
 * Maneja la lógica de protección de rutas, redirecciones y RBAC (Control de Acceso basado en Roles).
 */
export function renderRoute() {
    const app = document.getElementById("app")
    if (!app) return;

    // Detecta la ruta actual desde la URL
    const currentPath = window.location.pathname
    // Busca la configuración de la ruta o asigna la vista 404 si no existe
    const route = routes[currentPath] ?? { render: notFoundViews };
    const currentUser = getCurrentUser();

    // 1. Redirección de Invitado: Si el usuario ya está autenticado e intenta ir a Login/Register
    if (currentUser && route.redirectIfAuthenticated) {
        window.history.pushState({}, "", "/dashboard");
        renderRoute();
        return;
    }

    // 2. Guardia de Autenticación: Verifica si la ruta requiere estar logueado
    if (route.requiresAuth && !currentUser) {
        window.history.pushState({}, "", "/login");
        renderRoute();
        return;
    }

    // 3. Sistema RBAC: Verifica si el usuario tiene el rol permitido para la ruta
    if (route.requiresAuth && route.allowedRoles) {
        if (!route.allowedRoles.includes(currentUser.role)) {
            console.error("Acceso denegado: Rol insuficiente");
            window.history.pushState({}, "", "/dashboard");
            renderRoute();
            return;
        }
    }

    // Renderizado: Inyecta el HTML de la vista en el contenedor principal
    app.innerHTML = route.render();

    // Ejecuta la lógica de inicialización específica de la vista (event listeners, fetches, etc.)
    if (route.setup) {
        route.setup();
    }
}

/**
 * Inicializa los escuchadores de eventos globales para la navegación SPA.
 */
export function initRouter() {
    // Delegación de eventos para todos los enlaces (<a>) con rutas internas
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a")
        if (!link) {
            return
        }

        const href = link.getAttribute("href")
        // Solo maneja enlaces que empiecen con "/" para evitar links externos
        if (!href || !href.startsWith("/")) {
            return
        }
        event.preventDefault()
        // Actualiza la URL sin recargar la página
        window.history.pushState({}, "", href)
        renderRoute()

    })

    // Delegación de eventos específica para el botón de cerrar sesión
    document.addEventListener("click", (event) => {
        if (event.target.id === "logout-btn" || event.target.closest("#logout-btn")) {
            console.log("Cerrando sesión (delegado)...");
            destruirSesion();
            window.history.pushState({}, "", "/login");
            renderRoute();
        }
    })

    // Escucha el evento de retroceso/avance del navegador
    window.addEventListener("popstate", renderRoute)

    // Renderiza la ruta inicial al cargar la aplicación
    renderRoute()
}