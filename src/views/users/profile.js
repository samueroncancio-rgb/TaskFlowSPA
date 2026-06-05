import { Header } from "../../components/Header";
import { getCurrentUser, crearSesion, destruirSesion } from "../../services/auth.service";
import { updateUser, deleteUser } from "../../services/users.service";

/**
 * Renderiza la vista de perfil de usuario.
 * Muestra un formulario pre-rellenado con los datos del usuario actual.
 */
export function renderProfile() {
  const user = getCurrentUser();
  // Formatea el nombre completo uniendo nombre y apellido
  const userName = user ? `${user.name} ${user.lastname || ""}` : "Usuario";
  const userEmail = user ? user.email : "usuario@taskflow.com";

  return `
    ${Header()}
    <main class="mx-auto max-w-5xl px-6 py-10">
      <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside class="rounded-[2rem] bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Cuenta</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1>
          <p class="mt-4 text-blue-50">Gestiona tus datos personales y tu cuenta dentro del sistema.</p>
        </aside>

        <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
          <form id="profile-form" class="grid gap-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="name">Nombre completo</label>
              <input id="name" type="text" value="${userName}" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" required />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="profile-email">Correo electrónico</label>
              <input id="profile-email" type="email" value="${userEmail}" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" required />
            </div>
            <hr class="my-2 border-blue-50">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password-current">Contraseña actual</label>
              <input id="password-current" type="password" placeholder="Ingresa tu contraseña actual" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
              <p class="mt-1 text-xs text-slate-400 italic">Requerido solo si deseas cambiar tu contraseña o correo.</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password-new">Nueva contraseña</label>
              <input id="password-new" type="password" placeholder="Nueva contraseña (deja en blanco para no cambiar)" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>
            <div class="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="submit" id="save-profile" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors">
                Guardar cambios
              </button>
              <button type="button" id="delete-profile" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                Eliminar mi cuenta
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  `;
}

/**
 * Lógica de inicialización de la vista de perfil.
 * Maneja el envío del formulario, la validación de contraseñas y la eliminación de cuenta.
 */
export function setupProfile() {
  const user = getCurrentUser();
  if (!user) return;

  const form = document.getElementById("profile-form");
  const saveBtn = document.getElementById("save-profile");
  const deleteBtn = document.getElementById("delete-profile");

  // Listener para el envío del formulario de actualización
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameValue = document.getElementById("name").value.trim();
    const emailValue = document.getElementById("profile-email").value.trim();
    const currentPass = document.getElementById("password-current").value;
    const newPass = document.getElementById("password-new").value;

    // Validación de campos obligatorios
    if (!nameValue || !emailValue) {
      alert("El nombre y el correo son obligatorios.");
      return;
    }

    // Lógica de seguridad: verificar contraseña si se cambia email o password
    const changingPass = newPass.length > 0;
    const changingEmail = emailValue !== user.email;

    if (changingPass || changingEmail) {
      if (!currentPass) {
        alert("Debes ingresar tu contraseña actual para realizar estos cambios.");
        return;
      }
      if (currentPass !== user.password) {
        alert("La contraseña actual es incorrecta.");
        return;
      }
    }

    // Construcción del objeto de actualización
    const updatedData = {
      ...user,
      name: nameValue.split(" ")[0] || "",
      lastname: nameValue.split(" ").slice(1).join(" ") || "",
      email: emailValue,
      password: changingPass ? newPass : user.password
    };

    saveBtn.disabled = true;
    saveBtn.textContent = "Guardando...";

    // Petición PUT al servidor fake
    const response = await updateUser(user.id, updatedData);

    if (response && response.ok) {
      // Actualiza la sesión local con los nuevos datos
      crearSesion(updatedData);
      alert("Perfil actualizado correctamente.");
      // Recarga la vista emitiendo el evento popstate que escucha el router
      window.dispatchEvent(new Event("popstate"));
    } else {
      alert("Hubo un error al actualizar el perfil.");
      saveBtn.disabled = false;
      saveBtn.textContent = "Guardar cambios";
    }
  });

  // Listener para la eliminación de cuenta
  deleteBtn.addEventListener("click", async () => {
    const confirmed = confirm("¿Estás completamente seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todas tus tareas.");

    if (confirmed) {
      const response = await deleteUser(user.id);
      if (response && response.ok) {
        // Limpia la sesión y redirige al login
        destruirSesion();
        alert("Tu cuenta ha sido eliminada.");
        window.history.pushState({}, "", "/login");
        window.dispatchEvent(new Event("popstate"));
      } else {
        alert("No se pudo eliminar la cuenta.");
      }
    }
  });
}