import { getCurrentUser, destruirSesion } from "../services/auth.service";

/**
 * Componente funcional que renderiza el encabezado de la aplicación.
 * Muestra enlaces de navegación protegidos y el estado del usuario actual.
 */
export function Header() {
  const user = getCurrentUser();

  return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900" href="/home">TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex items-center">
          <!-- Mapeo de rutas principales de la aplicación -->
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/dashboard">Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/tasks">Tareas</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/profile">Perfil</a>
          
          <!-- Enlace visible solo para usuarios con rol ADMIN -->
          ${user?.role === 'ADMIN' ? '<a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/admin">Admin</a>' : ''}
          
          <div class="ml-4 flex items-center gap-3 border-l border-slate-200 pl-4">
            <span class="text-sm font-bold text-slate-700">${user?.name || 'Invitado'}</span>
            <button id="logout-btn" type="button" class="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
              Cerrar sesión
            </button>
          </div>
        </nav>
      </div>
    </header>
  `;
}


