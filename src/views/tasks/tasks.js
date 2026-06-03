import { Header } from "../../components/Header";

export function renderTasks() {
  return `
    ${Header()}
    <main class="mx-auto max-w-6xl px-6 py-10">
      <section class="flex flex-col gap-4 rounded-[2rem] bg-blue-600 px-8 py-10 text-white md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">CRUD de tareas</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mis tareas</h1>
          <p class="mt-4 max-w-2xl text-blue-50">Vista principal para listar, editar y eliminar las tareas del usuario autenticado.</p>
        </div>
        <a class="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50" href="/tasks/new">
          Crear tarea
        </a>
      </section>

      <section  id="tasks-container" class="mt-8 grid gap-4">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Completada</p>
              <h2 class="mt-2 text-2xl font-bold text-slate-900">Definir arquitectura inicial</h2>
              <p class="mt-3 max-w-2xl text-slate-600">Documentar la estructura por capas y dejar claro el alcance base del proyecto.</p>
            </div>
            <div class="flex gap-3">
              <a class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" href="/tasks/edit">Editar</a>
              <a class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" href="/tasks">Eliminar</a>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">En progreso</p>
              <h2 class="mt-2 text-2xl font-bold text-slate-900">Construir vistas iniciales</h2>
              <p class="mt-3 max-w-2xl text-slate-600">Crear las pantallas base del proyecto para explicar la futura navegacion SPA.</p>
            </div>
            <div class="flex gap-3">
              <a class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" href="/task-form">Editar</a>
              <a class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" href="/tasks">Eliminar</a>
            </div>
          </div>
        </article>
      </section>
    </main>

    

  `

}



import { deleteTask, getTask } from "../../services/tasks.service";
import { obtenerSesion } from "../../services/auth.service";
import { getUsers } from "../../services/users.service";

export async function setupTasks() {
  const container = document.getElementById("tasks-container");
  const titleEl = document.querySelector("h1");
  const descEl = document.querySelector("p.mt-4");

  if (!container) return;

  const currentUser = obtenerSesion();
  if (!currentUser) return;

  const isAdmin = currentUser.role === "ADMIN";

  // Si es admin, traemos todas las tareas; si no, solo las suyas
  const tasks = await getTask(isAdmin ? null : currentUser.id);
  const allUsers = isAdmin ? await getUsers() : [];

  if (isAdmin) {
    titleEl.textContent = "Gestión Global de Tareas";
    descEl.textContent = "Como administrador, puedes supervisar, editar o eliminar las tareas de todos los usuarios del sistema.";
  }

  container.innerHTML = tasks.length === 0
    ? '<p class="text-center py-20 text-slate-400">No hay tareas para mostrar.</p>'
    : tasks.map(task => {
      const owner = allUsers.find(u => u.id == task.userId);
      return `
            <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50 transition-all hover:shadow-blue-100">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                <div>
                <div class="flex items-center gap-2">
                    <span class="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        ${task.status}
                    </span>
                    ${isAdmin && owner ? `
                        <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                            Asignada a: ${owner.name}
                        </span>
                    ` : ""}
                </div>

                <h2 class="mt-3 text-2xl font-bold text-slate-900">
                    ${task.title}
                </h2>

                <p class="mt-3 max-w-2xl text-slate-600">
                    ${task.description}
                </p>

                <div class="mt-4 flex items-center gap-4 text-xs text-slate-400">
                    <span class="flex items-center gap-1">
                        📅 Límite: ${task.date || "Sin fecha"}
                    </span>
                </div>
                </div>

                <div class="flex gap-3">
                <button
                    class="edit-task rounded-full border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
                    data-id="${task.id}"
                >
                    Editar
                </button>

                <button
                    class="delete-task rounded-full border border-red-100 bg-red-50 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                    data-id="${task.id}"
                >
                    Eliminar
                </button>
                </div>

            </div>
            </article>
        `
    }).join("");

  // Eventos de eliminación
  document.querySelectorAll(".delete-task").forEach(button => {
    button.onclick = async () => {
      const confirmed = confirm("¿Estás seguro de eliminar esta tarea? Esta acción afectará al usuario dueño de la misma.");
      if (!confirmed) return;

      const id = button.dataset.id;
      await deleteTask(id);
      await setupTasks();
    };
  });

  // Eventos de edición
  document.querySelectorAll(".edit-task").forEach(button => {
    button.onclick = () => {
      const id = button.dataset.id;
      localStorage.setItem("taskId", id);
      history.pushState({}, "", "/tasks/edit");
      window.dispatchEvent(new Event("popstate"));
    };
  });
}


