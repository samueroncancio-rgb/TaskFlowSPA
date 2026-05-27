import { renderLogin } from "../views/auth/login";
import { renderNotFound } from "../views/auth/not-found";
import { renderRegister } from "../views/auth/register";
import { renderHome } from "../views/home";
import { renderTasksForm } from "../views/tasks/task-form";
import { renderTasks } from "../views/tasks/tasks";
import { renderAdmin } from "../views/users/admin";
import { renderDashboard } from "../views/users/dashboard";
import { renderProfile } from "../views/users/profile";

export const routes ={
    "/home":{
        render:renderHome,
        requiresAuth:false
    },
    "/login":{
        render:renderLogin,
        //setup:setupLogin,
        requiresAuth:false,
        redirectIfAuthenticated:true,
    },
    "/register":{
        render:renderRegister,
        //setup: setupRegister,
        requiresAuth:false,
        redirectIfAuthenticated:true,
    },
    "/admin":{
        render:renderAdmin,
        //setup:setupLogin,
        requiresAuth:true,
        allowedRoles:["ADMIN"]
    },
    "/dashboard":{
        render:renderDashboard,
        //setup: setupDashboard,
        requiresAuth:true,
    },
    "/tasks":{
        render:renderTasks,
        //setup:setupRender,
        requiresAuth:true,


    },
    "/tasks/new":{
        render:renderTasksForm,
        //setup:setupTasksForm,
        requiresAuth:true,


    },
    "/tasks/edit":{
        render:renderTasksForm,
        //setup:setupTasksForm,
        requiresAuth:true,

    },
    "/profile":{
        render:renderProfile,
        requiresAuth:true,
        //setup:setupProfile,

    },



}
export const notFoundWeiws=renderNotFound