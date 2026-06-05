/**
 * Punto de entrada principal de la aplicación.
 * Importa el enrutador y los estilos globales para inicializar la SPA.
 */
import { initRouter } from "./router/router";
import "./styles/global.css";

// Inicializa el sistema de rutas para manejar la navegación sin recargar la página.
initRouter();
