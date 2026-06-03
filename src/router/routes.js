import { renderLogin, setupLogin } from "../views/auth/login";
import { renderNotFound } from "../views/auth/not-found";
import { renderRegister, setupRegister } from "../views/auth/register";
import { renderHome } from "../views/home";
import { renderTasksForm, setupTasksForm } from "../views/tasks/task-form";
import { renderTasks, setupTasks } from "../views/tasks/tasks";
import { renderAdmin, setupAdmin } from "../views/users/admin";
import { renderDashboard } from "../views/users/dashboard";
import { renderProfile } from "../views/users/profile";

export const routes = {
    "/": {
        render: renderDashboard,
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
        //setup: setupDashboard,
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
        requiresAuth: true,
        //setup:setupProfile,

    },



}
export const notFoundViews = renderNotFound