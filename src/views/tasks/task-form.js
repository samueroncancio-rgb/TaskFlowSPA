import { Header } from "../../components/Header";
import { obtenerSesion } from "../../services/auth.service";
import { createTask, getTaskById, updateTask } from "../../services/tasks.service";

export function renderTasksForm() {
  return `
    ${Header()}
    <main class="mx-auto max-w-5xl px-6 py-10">
      <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Formulario</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight text-slate-900">Crear o editar tarea</h1>
        <p class="mt-4 max-w-2xl text-slate-600">Vista base para registrar una tarea nueva o actualizar una existente.</p>

        <form id="task-form" class="mt-8 grid gap-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="title">Titulo</label>
            <input id="title" type="text" placeholder="Ej. Preparar proyecto final" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700" for="description">Descripcion</label>
            <textarea id="description" rows="5" placeholder="Describe la tarea..." class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"></textarea>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="status">Estado</label>
              <select id="status" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none">
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Completada</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="date">Fecha limite</label>
              <input id="date" type="date" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
          </div>

          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
            type="submit"
              class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"
              > Guardar tarea </button>
            <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50" href="/tasks">Cancelar</a>
          </div>
        </form>
      </section>
    </main>

    

  
  `

}



export async function setupTasksForm() {
  console.log("setupTasksForm ejecutado");
  const form = document.getElementById("task-form");

  if (!form) return;

  const taskId =
    localStorage.getItem("taskId");

  if (taskId) {

    const task =
      await getTaskById(taskId);

    document.getElementById("title").value =
      task.title;

    document.getElementById("description").value =
      task.description;

    document.getElementById("status").value =
      task.status;

    document.getElementById("date").value =
      task.date;

  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentUser = obtenerSesion();

    const title =
      document.getElementById("title").value;

    const description =
      document.getElementById("description").value;

    const status =
      document.getElementById("status").value;

    const date =
      document.getElementById("date").value;

    console.log("currentUser:", currentUser);
    console.log("taskId:", taskId);

    const newTask = {
      title,
      description,
      status,
      date,
      completed: status === "Completada",
      userId: currentUser.id,
      createdAt: Date.now()
    };

    if (taskId) {

      await updateTask(
        taskId,
        newTask
      );

      localStorage.removeItem("taskId");

    } else {

      await createTask(newTask);

    }

    form.reset();

    history.pushState({}, "", "/tasks");
    window.dispatchEvent(
      new Event("popstate")
    );
  });
}