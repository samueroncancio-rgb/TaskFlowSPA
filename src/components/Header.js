import { getCurrentUser, destruirSesion } from "../services/auth.service";

export function Header() {
    const user = getCurrentUser();

    return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900" href="/home">TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex items-center">
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/dashboard">Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/tasks">Tareas</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/profile">Perfil</a>
          ${user?.role === 'ADMIN' ? '<a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/admin">Admin</a>' : ''}
          <button id="logout-btn" type="button" class="ml-4 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100">
            Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  `;
}


