import { Header } from "../../components/Header";
import { getUsers, updateUser, deleteUser } from "../../services/users.service";
import { getCurrentUser } from "../../services/auth.service";

export function renderAdmin() {
  return `
    ${Header()}
    <main class="mx-auto max-w-7xl px-6 py-10">
      <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Rol administrador</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Panel administrativo</h1>
        <p class="mt-4 max-w-2xl text-blue-50">Gestiona los usuarios del sistema, cambia sus roles o elimina cuentas activas.</p>
      </section>

      <section class="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <h2 class="text-xl font-bold text-slate-900">Acciones rápidas</h2>
          <div class="mt-5 grid gap-4">
            <button id="refresh-users" class="flex items-center justify-center rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100 italic">
              Actualizar lista de usuarios
            </button>
            <a class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100" href="/tasks">Ver todas las tareas</a>
            <a class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100" href="/dashboard">Volver al dashboard</a>
          </div>
        </article>

        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Gestión de Usuarios</h2>
            <span id="user-count" class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Cargando...</span>
          </div>
          <div id="users-list" class="mt-5 space-y-4">
             <!-- Usuarios cargados dinámicamente -->
          </div>
        </article>
      </section>
    </main>
  `
}

export async function setupAdmin() {
  const listContainer = document.getElementById("users-list");
  const countBadge = document.getElementById("user-count");
  const refreshBtn = document.getElementById("refresh-users");
  const self = getCurrentUser();

  async function loadUsers() {
    listContainer.innerHTML = '<p class="text-center py-10 text-slate-400">Cargando usuarios...</p>';
    const users = await getUsers();
    countBadge.textContent = `${users.length} USUARIOS`;

    listContainer.innerHTML = users.map(user => `
            <div class="rounded-2xl bg-blue-50 p-4 border border-blue-100 transition-all hover:shadow-md">
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p class="font-bold text-slate-900">${user.name} ${user.lastname || ""}</p>
                        <p class="text-sm text-slate-500">${user.email}</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="rounded-full bg-white px-3 py-1 text-xs font-bold ${user.role === 'ADMIN' ? 'text-blue-700 border border-blue-200' : 'text-slate-500 border border-slate-200'}">
                            ${user.role}
                        </span>
                        
                        ${user.id !== self.id ? `
                            <button class="change-role-btn rounded-full bg-white border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors" 
                                    data-id="${user.id}" data-role="${user.role}">
                                Cambiar a ${user.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                            </button>
                            <button class="delete-user-btn rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white transition-colors" 
                                    data-id="${user.id}">
                                Eliminar
                            </button>
                        ` : '<span class="text-xs text-slate-400 italic px-2">Eres tú</span>'}
                    </div>
                </div>
            </div>
        `).join("");

    // Attach events
    document.querySelectorAll(".change-role-btn").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.id;
        const currentRole = btn.dataset.role;
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';

        if (confirm(`¿Seguro que quieres cambiar el rol de este usuario a ${newRole}?`)) {
          const userToUpdate = users.find(u => u.id == id);
          await updateUser(id, { ...userToUpdate, role: newRole });
          loadUsers();
        }
      };
    });

    document.querySelectorAll(".delete-user-btn").forEach(btn => {
      btn.onclick = async () => {
        const id = btn.dataset.id;
        if (confirm("¿Estás completamnete seguro de eliminar a este usuario? Esta acción no se puede deshacer.")) {
          await deleteUser(id);
          loadUsers();
        }
      };
    });
  }

  if (refreshBtn) refreshBtn.onclick = loadUsers;
  loadUsers();
}