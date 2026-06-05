import { Header } from "../../components/Header";
import { getCurrentUser } from "../../services/auth.service";
import { getTask } from "../../services/tasks.service";

/**
 * Renderiza la estructura base del Dashboard.
 * El contenido de las estadísticas y la lista de tareas se carga dinámicamente en setupDashboard.
 */
export function renderDashboard() {
  const user = getCurrentUser();
  const userName = user ? user.name : "Usuario";
  const isAdmin = user?.role === 'ADMIN';

  return `
    ${Header()}
    <main class="mx-auto max-w-6xl px-6 py-10">
      <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
          ${isAdmin ? 'Panel de Administración' : 'Dashboard principal'}
        </p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Bienvenida, ${userName}.</h1>
        <p class="mt-4 max-w-2xl text-blue-50">
          ${isAdmin
      ? 'Supervisa la productividad global y gestiona las tareas de todos los colaboradores.'
      : `Resumen general del trabajo de ${userName}, accesos rápidos y estado actual de productividad.`}
        </p>
      </section>

      <!-- Sección de Estadísticas -->
      <section class="mt-8 grid gap-4 md:grid-cols-3">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">${isAdmin ? 'Tareas globales activas' : 'Mis tareas activas'}</p>
          <p id="active-tasks-count" class="mt-3 text-4xl font-black text-blue-700">--</p>
        </article>
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">${isAdmin ? 'Completadas (Sistema)' : 'Mis tareas completadas'}</p>
          <p id="completed-tasks-count" class="mt-3 text-4xl font-black text-blue-700">--</p>
        </article>
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Total acumulado</p>
          <p id="total-tasks-count" class="mt-3 text-4xl font-black text-blue-700">--</p>
        </article>
      </section>

      <div class="mt-8 grid gap-8 lg:grid-cols-[1fr_0.4fr]">
        <!-- Lista de Tareas Recientes -->
        <section>
          <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-900">
                ${isAdmin ? 'Últimas tareas del sistema' : 'Mis tareas recientes'}
              </h2>
              <a class="text-sm font-semibold text-blue-700 hover:text-blue-600" href="/tasks">Ver todo</a>
            </div>
            <div id="recent-tasks-list" class="mt-6 space-y-4">
              <p class="text-slate-400 italic">Cargando tareas...</p>
            </div>
          </article>
        </section>

        <!-- Bloque de Accesos Rápidos lateral -->
        <section class="space-y-6">
          <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
            <h2 class="text-xl font-bold text-slate-900">Accesos rápidos</h2>
            <div class="mt-6 grid gap-4">
              <a class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100" href="/tasks/new">
                <p class="text-sm font-semibold text-blue-600">Crear</p>
                <h3 class="mt-2 text-lg font-bold text-slate-900">Nueva tarea</h3>
              </a>
              <a class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100" href="/profile">
                <p class="text-sm font-semibold text-blue-600">Cuenta</p>
                <h3 class="mt-2 text-lg font-bold text-slate-900">Editar perfil</h3>
              </a>
            </div>
          </article>
        </section>
      </div>
    </main>
  `;
}

/**
 * Lógica de inicialización del Dashboard.
 * Recupera las tareas desde el servidor y actualiza los contadores y la lista reciente.
 */
export async function setupDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  const isAdmin = user.role === 'ADMIN';

  // Si es ADMIN, se recuperan todas las tareas (se envía null al servicio).
  // Si es USER, solo sus propias tareas.
  const tasks = await getTask(isAdmin ? null : user.id);

  const activeCountEl = document.getElementById("active-tasks-count");
  const completedCountEl = document.getElementById("completed-tasks-count");
  const totalCountEl = document.getElementById("total-tasks-count");
  const recentListEl = document.getElementById("recent-tasks-list");

  // Filtra las tareas para obtener los contadores de estado
  const activeTasks = tasks.filter(t => t.status !== 'Completada');
  const completedTasks = tasks.filter(t => t.status === 'Completada');

  if (activeCountEl) activeCountEl.textContent = activeTasks.length;
  if (completedCountEl) completedCountEl.textContent = completedTasks.length;
  if (totalCountEl) totalCountEl.textContent = tasks.length;

  // Renderiza las 5 tareas más recientes
  if (recentListEl) {
    const recentTasks = tasks.slice(-5).reverse();

    if (recentTasks.length === 0) {
      recentListEl.innerHTML = '<p class="text-sm text-slate-400">No hay tareas registradas aún.</p>';
    } else {
      recentListEl.innerHTML = recentTasks.map(task => `
        <div class="flex items-center justify-between rounded-2xl bg-blue-50/50 p-4 border border-blue-50">
          <div>
            <h4 class="font-bold text-slate-900">${task.title}</h4>
            <p class="text-xs text-slate-500 mt-1 line-clamp-1">${task.description}</p>
          </div>
          <span class="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 border border-blue-100">
            ${task.status}
          </span>
        </div>
      `).join("");
    }
  }
}