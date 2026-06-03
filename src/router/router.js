import { getCurrentUser, destruirSesion } from "../services/auth.service";
import { notFoundViews, routes } from "./routes";

export function renderRoute() {
    const app = document.getElementById("app")
    if (!app) return;

    const currentPath = window.location.pathname
    const route = routes[currentPath] ?? { render: notFoundViews };
    const currentUser = getCurrentUser();

    // 1. Redirigir si ya está autenticado y la ruta es solo para no-autenticados (Login/Register)
    if (currentUser && route.redirectIfAuthenticated) {
        window.history.pushState({}, "", "/dashboard");
        renderRoute();
        return;
    }

    // 2. Verificar si la ruta requiere autenticación
    if (route.requiresAuth && !currentUser) {
        window.history.pushState({}, "", "/login");
        renderRoute();
        return;
    }

    // 3. Verificar roles (RBAC)
    if (route.requiresAuth && route.allowedRoles) {
        if (!route.allowedRoles.includes(currentUser.role)) {
            console.error("Acceso denegado: Rol insuficiente");
            window.history.pushState({}, "", "/dashboard");
            renderRoute();
            return;
        }
    }

    // Renderizado final
    app.innerHTML = route.render();

    if (route.setup) {
        route.setup();
    }
}

export function initRouter() {
    document.addEventListener("click", (event) => {
        const link = event.target.closest("a")
        if (!link) {
            return
        }

        const href = link.getAttribute("href")
        if (!href || !href.startsWith("/")) {
            return
        }
        event.preventDefault()
        window.history.pushState({}, "", href)
        renderRoute()

    })

    // Delegación de eventos para el botón de logout
    document.addEventListener("click", (event) => {
        if (event.target.id === "logout-btn" || event.target.closest("#logout-btn")) {
            console.log("Cerrando sesión (delegado)...");
            destruirSesion();
            window.history.pushState({}, "", "/login");
            renderRoute();
        }
    })

    window.addEventListener("popstate", renderRoute)
    renderRoute()
}