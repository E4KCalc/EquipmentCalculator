import { renderAppRoot, setupNavbarEvents, setupDarkModeToggle } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
    setupNavbarEvents();
    renderAppRoot();
    setupDarkModeToggle();
});
